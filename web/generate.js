"use strict";

var base = require("xbase"),
	C = require("C"),
	util = require("util"),
	runUtil = require("xutil").run,
	rimraf = require("rimraf"),
	printUtil = require("xutil").print,
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	unicodeUtil = require("xutil").unicode,
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("xutil").dust,
	moment = require("moment"),
	tiptoe = require("tiptoe");

var dustData = 
{
	sets  : [],
	setCodesNotOnGatherer : C.SETS_NOT_ON_GATHERER.join(", ")
};

tiptoe(
	function removeJSONDirectory()
	{
		rimraf(path.join(__dirname, "json"), this);
	},
	function createJSONDirectory()
	{
		fs.mkdir(path.join(__dirname, "json"), this);
	},
	function loadJSON()
	{
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

		C.SETS.forEach(function(SET, i)
		{
			var setWithExtras = JSON.parse(args[i]);

			// Strip out internal only data
			delete setWithExtras.magicCardsInfoCode;
			delete setWithExtras.isMCISet;
			delete setWithExtras.magicRaritiesCode;

			allSetsWithExtras[SET.code] = setWithExtras;
			allSetsArrayWithExtras.push(setWithExtras);
			
			var set = base.clone(setWithExtras, true);
			set.cards.forEach(function(card)
			{
				// Strip out extras
				delete card.rulings;
				delete card.foreignNames;
				delete card.printings;
				delete card.originalText;
				delete card.originalType;
				delete card.legalities;
				delete card.source;
			});

			allSets[SET.code] = set;
			allSetsArray.push(set);

			fs.writeFile(path.join(__dirname, "json", SET.code + ".json"), JSON.stringify(set), {encoding : "utf8"}, this.parallel());
			if(SET.code==="CON")
				fs.writeFile(path.join(__dirname, "json", "_" + SET.code + ".json"), JSON.stringify(set), {encoding : "utf8"}, this.parallel());
			fs.writeFile(path.join(__dirname, "json", SET.code + "-x.json"), JSON.stringify(setWithExtras), {encoding : "utf8"}, this.parallel());

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

		dustData.sets = dustData.sets.sort(function(a, b) { return moment(a.releaseDate, "YYYY-MM-DD").unix()-moment(b.releaseDate, "YYYY-MM-DD").unix(); });

		dustData.allSize = printUtil.toSize(JSON.stringify(allSets).length, 1);
		dustData.allSizeX = printUtil.toSize(JSON.stringify(allSetsWithExtras).length, 1);

		dustData.changeLog = JSON.parse(fs.readFileSync(path.join(__dirname, "changelog.json"), {encoding : "utf8"})).map(function(o) { o.when = moment(o.when, "YYYY-MM-DD").format("MMM D, YYYY"); return o; });
		dustData.lastUpdated = dustData.changeLog[0].when;
		dustData.version = dustData.changeLog[0].version;

		fs.writeFile(path.join(__dirname, "json", "AllSets.json"), JSON.stringify(allSets), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSetsArray.json"), JSON.stringify(allSetsArray), {encoding : "utf8"}, this.parallel());

		fs.writeFile(path.join(__dirname, "json", "AllSets-x.json"), JSON.stringify(allSetsWithExtras), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSetsArray-x.json"), JSON.stringify(allSetsArrayWithExtras), {encoding : "utf8"}, this.parallel());
		
		fs.writeFile(path.join(__dirname, "json", "SetCodes.json"), JSON.stringify(C.SETS.map(function(SET) { return SET.code; })), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "SetList.json"), JSON.stringify(C.SETS.map(function(SET) { return {name : SET.name, code : SET.code, releaseDate : SET.releaseDate}; })), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "version-full.json"), JSON.stringify({version:dustData.version}), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "version.json"), JSON.stringify(dustData.version), {encoding : "utf8"}, this.parallel());

		fileUtil.copy(path.join(__dirname, "changelog.json"), path.join(__dirname, "json", "changelog.json"), this.parallel());
	},
	function verifyJSON()
	{
		checkSetsForProblems(this.parallel());
	},
	function zipJSON()
	{
		runUtil.run("zip", ["-9", "AllSets.json.zip", "AllSets.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
		runUtil.run("zip", ["-9", "AllSets-x.json.zip", "AllSets-x.json"], { cwd:  path.join(__dirname, "json"), silent : true }, this.parallel());
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
	function render()
	{
		dustData.allSizeZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSets.json.zip")).size, 1);
		dustData.allSizeXZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSets-x.json.zip")).size, 1);
		dustData.allSetFilesZipSize = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSetFiles.zip")).size, 1);
		dustData.allSetFilesXZipSize = printUtil.toSize(fs.statSync(path.join(__dirname, "json", "AllSetFiles-x.zip")).size, 1);

		C.SETS.forEach(function(SET, i)
		{
			dustData.sets[i].sizeZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", SET.code + ".json.zip")).size, 1);
			dustData.sets[i].sizeXZip = printUtil.toSize(fs.statSync(path.join(__dirname, "json", SET.code + "-x.json.zip")).size, 1);
		});

		dustUtil.render(__dirname, "index", dustData, { keepWhitespace : true }, this);
		//dustUtils.render(post.contentPath, "content", post, { keepWhitespace : true }, this);
	},
	function save(html)
	{
		fs.writeFile(path.join(__dirname, "index.html"), html, {encoding:"utf8"}, this);
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
	var ALLOWED_DUPS = ["B.F.M. (Big Furry Monster)"];
	
	var VALID_TYPES =
	{
		layout       : "string",
		name         : "string",
		names        : ["string"],
		manaCost     : "string",
		cmc          : "number",
		colors       : ["string"],
		type         : "string",
		supertypes   : ["string"],
		types        : ["string"],
		subtypes     : ["string"],
		rarity       : "string",
		text         : "string",
		flavor       : "string",
		artist       : "string",
		number       : "string",
		power        : "string",
		toughness    : "string",
		loyalty      : "number",
		multiverseid : "number",
		variations   : ["number"],
		imageName    : "string",
		watermark    : "string",
		border       : "string",
		hand         : "number",
		life         : "number",
		rulings      : ["object"],
		foreignNames : ["object"],
		printings    : ["string"],
		originalText : "string",
		originalType : "string",
		timeshifted  : "boolean",
		reserved     : "boolean",
		source       : "string",
		releaseDate  : "string",
		legalities   : {}
	};

	var ALLOWED_CATEGORIES = ["letter", "space", "punctuation", "number", "symbol"];
	var ALLOWED_OTHER_CHARS = ['\n'];

	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "web", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function compare(setRaw)
		{
			var setData = JSON.parse(setRaw);
			var cardsByName = {};

			// Check for duplicate cards
			setData.cards.forEach(function(card)
			{
				if(card.hasOwnProperty("variations") || ALLOWED_DUPS.contains(card.name) || setData.type==="promo")
					return;

				if(cardsByName.hasOwnProperty(card.name))
					base.info("%s DUP: %s\n%s", setCode, card.name, diffUtil.diff(cardsByName[card.name], card));
				else
					cardsByName[card.name] = card;
			});

			// Check for invalid data types
			setData.cards.forEach(function(card)
			{
				Object.forEach(card, function(key, val)
				{
					if(!VALID_TYPES.hasOwnProperty(key))
					{
						base.info("%s (%s) NO KNOWN TYPE REFERENCE: [%s] : [%s]", setCode, card.name, key, val);
						return;
					}

					if(Array.isArray(VALID_TYPES[key]))
					{
						if(val.some(function(v) { return typeof v!==VALID_TYPES[key][0]; }))
							base.info("%s (%s) HAS A NON-%s IN ARRAY: [%s] : [%s]", setCode, card.name, VALID_TYPES[key][0], key, val);

						return;
					}

					if(Object.isObject(VALID_TYPES[key]))
					{
						if(!Object.isObject(val))
							base.info("%s (%s) INVALID TYPE: [%s] : [%s] (Not an object)", setCode, card.name, key, val);

						return;
					}

					if(typeof val!==VALID_TYPES[key])
					{
						base.info("%s (%s) INVALID TYPE: [%s] : [%s] (%s !== %s)", setCode, card.name, key, val, typeof val, VALID_TYPES[key]);
						return;
					}
				});
			});

			// Check for invalid characters
			setData.cards.forEach(function(card)
			{
				Object.forEach(VALID_TYPES, function(name, type) {
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

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

