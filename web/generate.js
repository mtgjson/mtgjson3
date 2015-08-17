"use strict";

var base = require("xbase"),
	C = require("C"),
	runUtil = require("xutil").run,
	rimraf = require("rimraf"),
	printUtil = require("xutil").print,
	diffUtil = require("xutil").diff,
	unicodeUtil = require("xutil").unicode,
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("xutil").dust,
	moment = require("moment"),
	shared = require("shared"),
	tiptoe = require("tiptoe");

var JSONP_PREFIX = "mtgjsoncallback(";
var JSONP_SUFFIX = ");";

var dustData = 
{
	title : "Magic the Gathering card data in JSON format",
	sets  : [],
	setCodesNotOnGatherer : C.SETS_NOT_ON_GATHERER.join(", ")
};

tiptoe(
	function removeJSONDirectory()
	{
		base.info("Clearing JSON directory...");
		rimraf(path.join(__dirname, "json"), this);
	},
	function createJSONDirectory()
	{
		fs.mkdir(path.join(__dirname, "json"), this);
	},
	function loadJSON()
	{
		base.info("Loading JSON...");
		C.SETS.forEach(function(SET)
		{
			fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this.parallel());
		}.bind(this));
	},
	function saveSets()
	{
		var args=arguments;

		var allSets = {};
		var allSetsArray = [];

		var allSetsWithExtras = {};
		var allSetsArrayWithExtras = [];

		var allCardsWithExtras = {};
		var previousSeenSetCodes = {};

		var taintedSetCodes = [];
		var taintedCards = [];
		base.info("Creating JSON files...");
		C.SETS.forEach(function(SET, i)
		{
			var setWithExtras = JSON.parse(args[i]);

			setWithExtras.cards.forEach(function(card)
			{
				C.INTERNAL_ONLY_FIELDS.forEach(function(INTERNAL_ONLY_FIELD)
				{
					delete card[INTERNAL_ONLY_FIELD];
				});

				Object.forEach(C.FIELD_TYPES, function(fieldName, fieldType)
				{
					if(!allCardsWithExtras.hasOwnProperty(card.name))
						allCardsWithExtras[card.name] = {};

					if(C.SET_SPECIFIC_FIELDS.contains(fieldName))
						return;

					if(!previousSeenSetCodes.hasOwnProperty(card.name))
						previousSeenSetCodes[card.name] = {};
					if(!previousSeenSetCodes[card.name].hasOwnProperty(fieldName))
						previousSeenSetCodes[card.name][fieldName] = [];

					var fieldValue = card[fieldName];
					if(fieldName==="imageName")		// Modify for AllCards.json the imageName field to match the mtgimage.com /card/ prefix syntax
						fieldValue = card.name.toLowerCase().strip(":\"?").replaceAll("/", " ").trim("0123456789 .").replaceAll(" token card", "");

					if(C.ORACLE_FIELDS.contains(fieldName) && !["B.F.M. (Big Furry Monster)"].contains(card.name) && fieldName!=="foreignNames")
					{
						if(!card.hasOwnProperty(fieldName))
						{
							if(allCardsWithExtras[card.name].hasOwnProperty(fieldName))
							{
								base.warn("Card [%s] mismatch with field [%s] between current set [%s] and previous [%s] with values:\n\tNO VALUE\n\t%s", card.name, fieldName, SET.code, previousSeenSetCodes[card.name][fieldName].join(" "), allCardsWithExtras[card.name][fieldName]);
								taintedCards.push({card:card, fieldName:fieldName});

								previousSeenSetCodes[card.name][fieldName].forEach(function(prevSetCode)
								{
									allSetsWithExtras[prevSetCode].cards.forEach(function(prevCard) { if(prevCard.name===card.name) { taintedCards.push({card:prevCard, fieldName:fieldName}); } });
								});

								[].concat(previousSeenSetCodes[card.name][fieldName], [SET.code]).forEach(function(taintedCode)
								{
									if(!C.SETS.filter(function(taintedSet) { return taintedSet.code===taintedCode; })[0].isMCISet && !C.SETS_NOT_ON_GATHERER.contains(taintedCode))
										taintedSetCodes.push(taintedCode);
								});
							}

							return;
						}

						if(allCardsWithExtras[card.name].hasOwnProperty(fieldName))
						{
							var fieldDifference = diffUtil.diff(fieldValue, allCardsWithExtras[card.name][fieldName]);
							if(fieldDifference)
							{
								base.warn("Card [%s] mismatch with field [%s] between current set [%s] and previous [%s] with : %s", card.name, fieldName, SET.code, previousSeenSetCodes[card.name][fieldName].join(" "), fieldDifference);
								taintedCards.push({card:card, fieldName:fieldName});
								
								previousSeenSetCodes[card.name][fieldName].forEach(function(prevSetCode)
								{
									allSetsWithExtras[prevSetCode].cards.forEach(function(prevCard) { if(prevCard.name===card.name) { taintedCards.push({card:prevCard, fieldName:fieldName}); } });
								});

								[].concat(previousSeenSetCodes[card.name][fieldName], [SET.code]).forEach(function(taintedCode)
								{
									if(!C.SETS.filter(function(taintedSet) { return taintedSet.code===taintedCode; })[0].isMCISet && !C.SETS_NOT_ON_GATHERER.contains(taintedCode))
										taintedSetCodes.push(taintedCode);
								});
							}
						}
					}

					previousSeenSetCodes[card.name][fieldName].push(setWithExtras.code);
					
					allCardsWithExtras[card.name][fieldName] = fieldValue;
				});
			});

			// Strip out internal only data
			delete setWithExtras.isMCISet;
			delete setWithExtras.magicRaritiesCode;
			delete setWithExtras.essentialMagicCode;
			delete setWithExtras.useMagicRaritiesNumber;

			allSetsWithExtras[SET.code] = setWithExtras;
			allSetsArrayWithExtras.push(setWithExtras);
			
			var set = base.clone(setWithExtras, true);
			set.cards.forEach(function(card)
			{
				// Strip out extras
				C.EXTRA_FIELDS.forEach(function(EXTRA_FIELD)
				{
					delete card[EXTRA_FIELD];
				});
			});

			allSets[SET.code] = set;
			allSetsArray.push(set);

			fs.writeFile(path.join(__dirname, "json", SET.code + ".json"), JSON.stringify(set), {encoding : "utf8"}, this.parallel());
			fs.writeFile(path.join(__dirname, "json", SET.code + ".jsonp"), JSONP_PREFIX + JSON.stringify(set) + ', "' + SET.code + '"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());
			if(SET.code==="CON")
			{
				fs.writeFile(path.join(__dirname, "json", "_" + SET.code + ".json"), JSON.stringify(set), {encoding : "utf8"}, this.parallel());
				fs.writeFile(path.join(__dirname, "json", "_" + SET.code + ".jsonp"), JSONP_PREFIX + JSON.stringify(set) + ', "' + SET.code + '"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());
			}
			fs.writeFile(path.join(__dirname, "json", SET.code + "-x.json"), JSON.stringify(setWithExtras), {encoding : "utf8"}, this.parallel());
			fs.writeFile(path.join(__dirname, "json", SET.code + "-x.jsonp"), JSONP_PREFIX + JSON.stringify(setWithExtras) + ', "' + SET.code + '-x"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

			var setSize = printUtil.toSize(JSON.stringify(set).length, 0);
			setSize = "&nbsp;".repeat(6-setSize.length) + setSize;

			var setXSize = printUtil.toSize(JSON.stringify(setWithExtras).length, 0);
			setXSize = "&nbsp;".repeat(6-setXSize.length) + setXSize;

			var dustSetData = {code : SET.code, name : SET.name, releaseDate : SET.releaseDate, size : setSize, sizeX : setXSize};
			if(SET.code==="CON")
				dustSetData.isCON = true;
			if(SET.code.length===3)
				dustSetData.shortCode = true;

			dustData.sets.push(dustSetData);
		}.bind(this));

		taintedSetCodes = taintedSetCodes.unique();
		if(taintedSetCodes.length>0)
		{
			base.info("Tainted set codes: %s", taintedSetCodes.join(" "));
			this.data.taintedCards = taintedCards;
		}

		var allCards = base.clone(allCardsWithExtras, true);
		Object.values(allCards).forEach(function(card)
		{
			// Strip out extras
			C.EXTRA_FIELDS.forEach(function(EXTRA_FIELD)
			{
				delete card[EXTRA_FIELD];
			});
		});

		dustData.sets = dustData.sets.sort(function(a, b) { return moment(a.releaseDate, "YYYY-MM-DD").unix()-moment(b.releaseDate, "YYYY-MM-DD").unix(); });

		dustData.allSize = printUtil.toSize(JSON.stringify(allSets).length, 1);
		dustData.allSizeX = printUtil.toSize(JSON.stringify(allSetsWithExtras).length, 1);

		dustData.allCardsSize = printUtil.toSize(JSON.stringify(allCards).length, 1);
		dustData.allCardsSizeX = printUtil.toSize(JSON.stringify(allCardsWithExtras).length, 1);

		var changeLog = JSON.parse(fs.readFileSync(path.join(__dirname, "changelog.json"), {encoding : "utf8"}));

		dustData.changeLog = changeLog.map(function(o, i) {
			o.whenAtom = moment(o.when, "YYYY-MM-DD").format("YYYY-MM-DDTHH:mm:ss");
			o.when = moment(o.when, "YYYY-MM-DD").format("MMM D, YYYY");
			o.uniqueID = changeLog.length-i;
			o.atomContent = "<p>Changes:<br><ul>" + o.changes.map(function(change) { return "<li>" + change + "</li>"; }).join(""); + "</ul></p>";
			return o;
		});

		dustData.changeLogAtom = dustData.changeLog.slice(0, 9);

		dustData.lastUpdatedAtom = dustData.changeLog[0].whenAtom;		
		dustData.lastUpdated = dustData.changeLog[0].when;
		dustData.version = dustData.changeLog[0].version;
		dustData.setSpecificFields = C.SET_SPECIFIC_FIELDS.sort().join(", ");

		fs.writeFile(path.join(__dirname, "json", "AllSets.json"), JSON.stringify(allSets), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSets.jsonp"), JSONP_PREFIX + JSON.stringify(allSets) + ', "AllSets"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllSetsArray.json"), JSON.stringify(allSetsArray), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSetsArray.jsonp"), JSONP_PREFIX + JSON.stringify(allSetsArray) + ', "AllSetsArray"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllSets-x.json"), JSON.stringify(allSetsWithExtras), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSets-x.jsonp"), JSONP_PREFIX + JSON.stringify(allSetsWithExtras) + ', "AllSets-x"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllSetsArray-x.json"), JSON.stringify(allSetsArrayWithExtras), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSetsArray-x.jsonp"), JSONP_PREFIX + JSON.stringify(allSetsArrayWithExtras) + ', "AllSetsArray-x"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllCards.json"), JSON.stringify(allCards), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllCards.jsonp"), JSONP_PREFIX + JSON.stringify(allCards) + ', "AllCards"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllCards-x.json"), JSON.stringify(allCardsWithExtras), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllCards-x.jsonp"), JSONP_PREFIX + JSON.stringify(allCardsWithExtras) + ', "AllCards-x"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());
		
		fs.writeFile(path.join(__dirname, "json", "SetCodes.json"), JSON.stringify(C.SETS.map(function(SET) { return SET.code; })), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "SetCodes.jsonp"), JSONP_PREFIX + JSON.stringify(C.SETS.map(function(SET) { return SET.code; })) + ', "SetCodes"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "SetList.json"), JSON.stringify(C.SETS.map(function(SET) { return {name : SET.name, code : SET.code, releaseDate : SET.releaseDate}; })), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "SetList.jsonp"), JSONP_PREFIX + JSON.stringify(C.SETS.map(function(SET) { return {name : SET.name, code : SET.code, releaseDate : SET.releaseDate}; })) + ', "SetList"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "version-full.json"), JSON.stringify({version:dustData.version}), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "version-full.jsonp"), JSONP_PREFIX + JSON.stringify({version:dustData.version}) + ', "version-full"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "version.json"), JSON.stringify(dustData.version), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "version.jsonp"), JSONP_PREFIX + JSON.stringify(dustData.version) + ', "version"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "changelog.json"), fs.readFileSync(path.join(__dirname, "changelog.json"), {encoding : "utf8"}), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "changelog.jsonp"), JSONP_PREFIX + fs.readFileSync(path.join(__dirname, "changelog.json"), {encoding : "utf8"}) + ', "changelog"' + JSONP_SUFFIX, {encoding : "utf8"}, this.parallel());
	},
	function clearTaintedCacheFilesIfNecessary()
	{
		if(!this.data.taintedCards)
			return this();

		base.info("Clearing cache files for tainted cards...");

		var self=this;

		this.data.taintedCards.filter(function(taintedCard) { return taintedCard.card.hasOwnProperty("multiverseid"); }).serialForEach(function(taintedCard, subcb)
		{
			shared.buildCacheFileURLs(taintedCard.card, (taintedCard.fieldName==="printings" ? "printings" : (taintedCard.fieldName.startsWith("original") ? "original" : (taintedCard.fieldName==="legalities" ? "legalities" : "oracle"))), subcb);
		}, function(err, cacheFileURLs) { base.info("Clearing %d cache files...", cacheFileURLs.length); cacheFileURLs.flatten().uniqueBySort().serialForEach(shared.clearCacheFile, self); });
	},
	function verifyJSON()
	{
		base.info("Checking sets for problems...");
		checkSetsForProblems(this.parallel());
	},
	function zipJSON()
	{
		base.info("Zipping files...");
		runUtil.run("zip", ["-9", "AllSets.json.zip", "AllSets.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllSets-x.json.zip", "AllSets-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllCards.json.zip", "AllCards.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllCards-x.json.zip", "AllCards-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllSetFiles.zip"].concat(C.SETS.map(function(SET) { return SET.code + ".json"; })), { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllSetFiles-x.zip"].concat(C.SETS.map(function(SET) { return SET.code + "-x.json"; })), { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllSetFilesWindows.zip"].concat(C.SETS.map(function(SET) { return (SET.code==="CON" ? "_" : "") + SET.code + ".json"; })), { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());

		C.SETS.serialForEach(function(SET, cb)
		{
			runUtil.run("zip", ["-9", SET.code + ".json.zip", SET.code + ".json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());

		C.SETS.serialForEach(function(SET, cb)
		{
			runUtil.run("zip", ["-9", SET.code + "-x.json.zip", SET.code + "-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());

		// Windows CON.json.zip
		C.SETS.serialForEach(function(SET, cb)
		{
			if(SET.code!=="CON")
				return setImmediate(cb);

			runUtil.run("zip", ["-9", "_" + SET.code + ".json.zip", "_" + SET.code + ".json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());
	},
	function zipJSON()
	{
		base.info("Gzipping files...");
		runUtil.run("gzip", ["-k", "AllSets.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("gzip", ["-k", "AllSets-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("gzip", ["-k", "AllCards.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("gzip", ["-k", "AllCards-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());

		C.SETS.serialForEach(function(SET, cb)
		{
			runUtil.run("gzip", ["-k", SET.code + ".json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());

		C.SETS.serialForEach(function(SET, cb)
		{
			runUtil.run("gzip", ["-k", SET.code + "-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());

		// Windows CON.json.zip
		C.SETS.serialForEach(function(SET, cb)
		{
			if(SET.code!=="CON")
				return setImmediate(cb);

			runUtil.run("gzip", ["-k", "_" + SET.code + ".json"], { cwd:  path.join(__dirname, "json"), silent : true }, cb);
		}, this.parallel());
	},
	function render()
	{
		base.info("Rendering index and atom...");
		dustData.allSizeZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSets.json.zip")).size, 1);
		dustData.allSizeXZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSets-x.json.zip")).size, 1);
		dustData.allCardsSizeZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllCards.json.zip")).size, 1);
		dustData.allCardsSizeXZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllCards-x.json.zip")).size, 1);
		dustData.allSetFilesZipSize = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSetFiles.zip")).size, 1);
		dustData.allSetFilesXZipSize = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSetFiles-x.zip")).size, 1);

		C.SETS.forEach(function(SET, i)
		{
			dustData.sets[i].sizeZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", SET.code + ".json.zip")).size, 1);
			dustData.sets[i].sizeXZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", SET.code + "-x.json.zip")).size, 1);
		});

		dustUtil.render(__dirname, "index", dustData, { keepWhitespace : true }, this.parallel());
		dustUtil.render(__dirname, "atom", dustData, { keepWhitespace : true }, this.parallel());
	},
	function save(indexHTML, atomXML)
	{
		fs.writeFile(path.join(__dirname, "index.html"), indexHTML, {encoding:"utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "atom.xml"), atomXML, {encoding:"utf8"}, this.parallel());
	},
	function finish(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function checkSetsForProblems(cb)
{
	tiptoe(
		function processSets()
		{
			C.SETS.map(function(SET) { return SET.code; }).serialForEach(function(code, subcb)
			{
				checkSetForProblems(code, subcb);
			}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function checkSetForProblems(setCode, cb)
{
	var ALLOWED_CATEGORIES = ["letter", "space", "punctuation", "number", "symbol"];
	var ALLOWED_OTHER_CHARS = ['\n'];
	var ALLOWED_MISSING_NUMBERS = ["CST"];
	var ALLOWED_MISSING_MAGICCARDSINFO_CODE = ["RQS", "VAN", "FRF_UGIN"];
	var ALLOWED_DUP_CARD_NUMBERS =
	{
		PLS : ["Ertai, the Corrupted", "Skyship Weatherlight", "Tahngarth, Talruum Hero"],
		ME4 : ["Urza's Mine", "Urza's Power Plant", "Urza's Tower"]
	};

	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "web", "json", setCode + "-x.json"), {encoding : "utf8"}, this);
		},
		function compare(setRaw)
		{
			var setData = JSON.parse(setRaw);

			// Check for magicCardsInfoCode
			if(!ALLOWED_MISSING_MAGICCARDSINFO_CODE.contains(setCode) && !setData.hasOwnProperty("magicCardsInfoCode"))
				base.info("%s Does not have field 'magicCardsInfoCode'", setCode);

			// Check for duplicate printings entries
			setData.cards.forEach(function(card)
			{
				if(card.printings && card.printings.length!==card.printings.unique().length)
					base.info("%s Duplicate printings entry for card %s", setCode, card.name);
			});

			// Ensure imageName is present and unique within the set
			var imageNames = [];
			setData.cards.forEach(function(card)
			{
				if(!card.hasOwnProperty("imageName"))
				{
					base.info("%s (%s) Does not have an imageName field!", setCode, card.name);
					return;
				}

				/*if(imageNames.contains(card.imageName))
				{
					base.info("%s (%s) Does has a DUPLICATE imageName field: %s", setCode, card.name, card.imageName);
					return;
				}*/

				imageNames.push(card.imageName);
			});

			// Check for invalid data types
			setData.cards.forEach(function(card)
			{
				Object.forEach(card, function(key, val)
				{
					if(!C.FIELD_TYPES.hasOwnProperty(key))
					{
						base.info("%s (%s) NO KNOWN TYPE REFERENCE: [%s] : [%s]", setCode, card.name, key, val);
						return;
					}

					if(Array.isArray(C.FIELD_TYPES[key]))
					{
						if(val.some(function(v) { return typeof v!==C.FIELD_TYPES[key][0]; }))
							base.info("%s (%s) HAS A NON-%s IN ARRAY: [%s] : [%s]", setCode, card.name, C.FIELD_TYPES[key][0], key, val);

						return;
					}

					if(Object.isObject(C.FIELD_TYPES[key]))
					{
						if(!Object.isObject(val))
							base.info("%s (%s) INVALID TYPE: [%s] : [%s] (Not an object)", setCode, card.name, key, val);

						return;
					}

					if(typeof val!==C.FIELD_TYPES[key])
					{
						base.info("%s (%s) INVALID TYPE: [%s] : [%s] (%s !== %s)", setCode, card.name, key, val, typeof val, C.FIELD_TYPES[key]);
						return;
					}
				});
			});

			// Check for invalid characters
			setData.cards.forEach(function(card)
			{
				Object.forEach(C.FIELD_TYPES, function(name, type) {
					if(type!=="string")
						return;

					if(!card.hasOwnProperty(name) || !card[name])
						return;

					var categories = unicodeUtil.getCategories(card[name]);
					categories.forEach(function(category, i)
					{
						if(ALLOWED_CATEGORIES.contains(category))
							return;

						var c = card[name].charAt(i);
						if(ALLOWED_OTHER_CHARS.contains(c))
							return;

						base.info("Card [%s] (%s) has invalid character in field [%s]: [%s] (%s)", card.name, card.multiverseid || "", name, c, c.charCodeAt(0));
					});
				});
			});

			// Check for basic land invalid rarities
			setData.cards.forEach(function(card)
			{
				if(card.type.contains("Basic Land") && card.rarity!=="Basic Land")
					base.info("Basic land [%s] (%s) from set %s has rarity %s", card.name, card.multiverseid || "", setData.name, card.rarity);
			});

			// Check for cards with no text that should have it
			setData.cards.forEach(function(card)
			{
				if(card.layout==="token")
					return;

				if(card.types && card.types.contains("Creature"))
					return;

				if(card.supertypes && card.types && card.supertypes.contains("Basic") && card.types.contains("Land"))
					return;

				if(!card.text || card.text.trim().length===0)
					base.info("%s Card [%s] (%s) has no text field", setCode, card.name, card.multiverseid || "");
			});

			// Check for duplicate 'number' fields
			if(setData.type!=="promo")
			{
				var seenNumbers = [];
				setData.cards.forEach(function(card)
				{
					if(["plane", "phenomenon", "scheme", "vanguard"].contains(card.layout) || !card.hasOwnProperty("number"))
						return;

					if((!ALLOWED_DUP_CARD_NUMBERS.hasOwnProperty(setCode) || !ALLOWED_DUP_CARD_NUMBERS[setCode].contains(card.name)) && !card.starter && setData.type!=="starter" && seenNumbers.contains(card.number))
						base.info("%s: Duplicate card number (%s): %s", setCode, card.name, card.number);
					else
						seenNumbers.push(card.number);
				});

				// Check for missing numbers
				if(seenNumbers.length>0 && !ALLOWED_MISSING_NUMBERS.contains(setData.code))
				{
					var realNumbers = [];
					seenNumbers.forEach(function(seenNumber) { realNumbers.push(+seenNumber.replace(/[^0-9]/, "", "g")); });
					realNumbers = realNumbers.unique();
					for(var i=1;i<=realNumbers.length;i++)
					{
						if(!realNumbers.contains(i))
							base.info("%s: Missing card number: %d", setCode, i);
					}
				}
			}

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
