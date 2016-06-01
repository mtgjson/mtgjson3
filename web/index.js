'use strict';

var pug = require('pug');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var tiptoe = require('tiptoe');
var async = require('async');
var C = require('C');
var moment = require('moment');

var diffUtil = require('xutil').diff;
var runUtil = require("xutil").run;

var clone = require('../clonekit');

var JSONP_PREFIX = 'mtgjsoncallback(';
var JSONP_SUFFIX = ');';
var output = path.join(__dirname, '..', 'public');
var jsonRoot = path.join(output, 'json');

// Jade Params
var params = {
	title : "Magic the Gathering card data in JSON format",	// for atom
	analytics: "<scr" + "ipt>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-66983210-2', 'auto');ga('send', 'pageview');</scr" + "ipt>",
	sets: {},
	moment: moment
};

var SETS = [];
// Sets variables
var allSets = {};
var allSetsWithExtras = {};
var allSetsArray = [];
var allSetsArrayWithExtras = [];

// Cards variables
var allCardsWithExtras = {};
var allCards = {};
var allCardsArray = [];
var allCardsArrayWithExtras = [];

// Other stuff
var previousSeenSetCodes = {};
var taintedCards = [];


function processCard(SET, card, callback) {
	if (!allCardsWithExtras.hasOwnProperty(card.name)) {
		allCardsWithExtras[card.name] = {};
	}

	if(!previousSeenSetCodes.hasOwnProperty(card.name))
		previousSeenSetCodes[card.name] = {};

	var checkTaint = function(fieldName, fieldValue) {
		if (!fieldValue) {
			if (card.hasOwnProperty(fieldName))
				fieldValue = card[fieldName];
		}

		// Do nothing if we do not have a previous value.
		if (!allCardsWithExtras[card.name].hasOwnProperty(fieldName))
			return;
		
		var previousValue = allCardsWithExtras[card.name][fieldName];

		var taint = false;
		var diff = null;
		if (previousValue) {
			if (!fieldValue) {
				console.log("No value present");
				taint = true;
			}
			else 
				diff = diffUtil.diff(previousValue, fieldValue);

			if (diff) {
				taint = true
			}
		}

		if (taint) {
			taintedCards.push({ card: card, fieldName: fieldName });
			console.log("Tainted field %s on card '%s' (%s)", fieldName, card.name, SET.code);
			if (diff)
				console.log(diff);
		}
	};

	async.eachSeries(
		Object.keys(C.FIELD_TYPES),
		function(fieldName, subcb) {
			if (C.SET_SPECIFIC_FIELDS.contains(fieldName)) {
				subcb();
				return;
			}

			if (!previousSeenSetCodes[card.name].hasOwnProperty(fieldName))
				previousSeenSetCodes[card.name][fieldName] = [];

			var fieldValue = card[fieldName];
			if (fieldName === "imageName")		// Modify for AllCards.json the imageName field
				fieldValue = card.name.toLowerCase().strip(":\"?").replaceAll("/", " ").trim("0123456789 .").replaceAll(" token card", "");

			if (C.ORACLE_FIELDS.contains(fieldName) && fieldName !== 'foreignNames') {
				checkTaint(fieldName, fieldValue);
			}

			previousSeenSetCodes[card.name][fieldName].push(SET.code);
			allCardsWithExtras[card.name][fieldName] = fieldValue;

			subcb();
		},
		callback
	);

}

function processSet(SET, callback) {
	console.log(SET.code);
	// Fix cards
	async.each(
		SET.cards,
		function(card, cb) {
			processCard(SET, card, cb);
		},
		function(err) {
			delete SET.isMCISet;
			delete SET.magicRaritiesCode;
			delete SET.essentialMagicCode;
			delete SET.useMagicRaritiesNumber;

			// Create Simple Set
			var SimpleSet = clone(SET, true);
			async.each(SimpleSet.cards, function(card, cb) {
				// Strip out extras
				async.each(C.EXTRA_FIELDS, function(EXTRA_FIELD, subcb) {
					delete card[EXTRA_FIELD];
					subcb();
				}, cb);
			});

			callback && callback(null, SET, SimpleSet);
		}
	);
}

function saveSet(Code, FullSET, SimpleSET, callback) {
	var done = false;
	var i = 0;

	var setPrefix = path.join(jsonRoot, Code);

	var _ss = JSON.stringify(SimpleSET);
	var _fs = JSON.stringify(FullSET);

	var Size = _ss.length;
	var FullSize = _fs.length;

	// Add a function to the counter and return the check function.
	var push = function() {
		i++;
		return(check);
	};

	// Checks for errors and check if we're done. Once we're done, fire the callback.
	var check = function(err) {
		if (err)
			throw(err);

		i--;
		if (done && i == 0)
			callback && callback(null, FullSize, Size);
	};

	fs.writeFile(setPrefix + '.json', _ss, { encoding: 'utf8' }, push());
	fs.writeFile(setPrefix + '-x.json', _fs, { encoding: 'utf8' }, push());

	if (Code == 'CON') {
		fs.writeFile(setPrefix + '_.json', _ss, { encoding: 'utf8' }, push());
		fs.writeFile(setPrefix + '_.jsonp', JSONP_PREFIX + _ss + JSONP_SUFFIX, { encoding: 'utf8' }, push());
	}

	// JSONP
	fs.writeFile(setPrefix + '.jsonp', JSONP_PREFIX + _ss + JSONP_SUFFIX, { encoding: 'utf8' }, push());
	fs.writeFile(setPrefix + '-x.jsonp', JSONP_PREFIX + _fs + JSONP_SUFFIX, { encoding: 'utf8' }, push());

	done = true;
}

tiptoe(
	function removeDirectory() {
		console.log("Clearing Output directory...");
		rimraf(output, this);
	},
	function createDirectoryStructure() {
		tiptoe(
			function() {
				fs.mkdir(output, this);
			},
			function() {
				fs.mkdir(jsonRoot, this);
			},
			this
		);
	},
	function loadJSON() {
		console.log("Loading JSON...");
		async.eachSeries(
			C.SETS,
			function(SET, cb) {
				fs.readFile(path.join(__dirname, '..', 'json', SET.code + '.json'), { encoding: 'utf8' }, function(err, data) {
					if (err) throw(err);
					SETS.push(JSON.parse(data));
					cb();
				});
			},
			this
		);
	},
	function processJSON() {
		async.eachSeries(
			SETS,
			function(SET, cb) {
				params.sets[SET.code] = {
					code: SET.code,
					releaseDate : SET.releaseDate
				};

				processSet(SET, function(err, FullSET, SimpleSET) {
					allSetsWithExtras[SET.code] = FullSET;
					allSetsArrayWithExtras.push(FullSET);
					allSets[SET.code] = SimpleSET;
					allSetsArray.push(SimpleSET);

					saveSet(SET.code, FullSET, SimpleSET, function(err, FullSize, SimpleSize) {
						params.sets[SET.code].simpleSize = SimpleSize;
						params.sets[SET.code].fullSize = FullSize;
						cb();
					});
				});
			},
			this
		);
	},
	function saveFullJSON() {
		var save = function(fname, data, callback) {
			var _data = JSON.stringify(data);
			var size = _data.length;

			tiptoe(
				function() {
					fs.writeFile(path.join(jsonRoot, fname + '.json'), _data, 'utf-8', this.parallel());
					fs.writeFile(path.join(jsonRoot, fname + '.jsonp'), JSONP_PREFIX + _data + JSONP_SUFFIX, 'utf-8', this.parallel());
				},
				function(err) {
					if (callback) setImmediate(callback, err, size);
				}
			);
		};

		var dataBlock = {
			'AllSets': { data: allSets, param: 'allSize' },
			'AllSets-x': { data: allSetsWithExtras, param: 'allSizeX' },
			'AllSetsArray': { data: allSetsArray, param: 'allSizeArray' },
			'AllSetsArray-x': { data: allSetsArrayWithExtras, param: 'allSizeArrayX' },
			'AllCards': { data: allCards, param: 'allCards' },
			'AllCards-x': { data: allCardsWithExtras, param: 'allCardsX' },
			'AllCardsArray': { data: allCardsArray, param: 'allCardsArray' },
			'AllCardsArray-x': { data: allCardsArrayWithExtras, param: 'allCardsArrayX' }
		};
		async.eachSeries(
			Object.keys(dataBlock),
			function(block, cb) {
				console.log("Saving %s...", block);
				save(block, dataBlock[block].data, function(err, size) {
					if (err) throw(err);
					dataBlock[dataBlock[block].param] = size;
					cb();
				});
			},
			this
		);
	},
	function changelog() {
		fs.readFile(path.join(__dirname, 'changelog.json'), { encoding: 'utf8' }, this);
	},
	function staticInfo(changelog_raw) {
		var changelog = JSON.parse(changelog_raw);

		params.changelog = changelog.map(function(o, i) {
			o.whenAtom = moment(o.when, "YYYY-MM-DD").format("YYYY-MM-DDTHH:mm:ss");
			o.whenSiteMap = o.when;
			o.when = moment(o.when, "YYYY-MM-DD").format("MMM D, YYYY");
			o.uniqueID = changelog.length-i;
			o.atomContent = "<p>Changes:<br><ul>" + o.changes.map(function(change) { return "<li>" + change + "</li>"; }).join("") + "</ul></p>";
			return o;
		});

		// Update stuff for our html output
		params.version = changelog[0].version;
		params.changeLogAtom = changelog.slice(0, 9);

		params.lastUpdatedAtom = params.changelog[0].whenAtom;
		params.lastUpdated = params.changelog[0].when;
		params.lastUpdatedSiteMap = params.changelog[0].whenSiteMap;
		params.setSpecificFields = C.SET_SPECIFIC_FIELDS.sort().join(", ");

		// SetCodes
		var setCodes = JSON.stringify(C.SETS.map(function(SET) { return SET.code; }));
		fs.writeFile(path.join(jsonRoot, 'SetCodes.json'), setCodes, { encoding : 'utf8' }, this.parallel());
		fs.writeFile(path.join(jsonRoot, 'SetCodes.jsonp'), JSONP_PREFIX + setCodes + ', "SetCodes"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

		// SetList
		var setList = JSON.stringify(C.SETS.map(function(SET) { return { name : SET.name, code : SET.code, releaseDate : SET.releaseDate }; }));
		fs.writeFile(path.join(jsonRoot, 'SetList.json'), setList, { encoding : 'utf8' }, this.parallel());
		fs.writeFile(path.join(jsonRoot, 'SetList.jsonp'), JSONP_PREFIX + setList + ', "SetList"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

		// Version
		var version = JSON.stringify({ version: params.version });
		fs.writeFile(path.join(jsonRoot, 'version-full.json'), version, { encoding : 'utf8' }, this.parallel());
		fs.writeFile(path.join(jsonRoot, 'version-full.jsonp'), JSONP_PREFIX + version + ', "version-full"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

		fs.writeFile(path.join(jsonRoot, 'version.json'), JSON.stringify(params.version), { encoding : 'utf8' }, this.parallel());
		fs.writeFile(path.join(jsonRoot, 'version.jsonp'), JSONP_PREFIX + JSON.stringify(params.version) + ', "version"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

		// Changelog
		var cl = JSON.stringify(changelog);
		fs.writeFile(path.join(jsonRoot, 'changelog.json'), cl, { encoding : 'utf8' }, this.parallel());
		fs.writeFile(path.join(jsonRoot, 'changelog.jsonp'), JSONP_PREFIX + cl + ', "changelog"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());
	},
	function createHTML() {
		var options = {
			pretty: true
		};
		var save = function(jadefn, fn, callback) {
			var func = pug.compileFile(path.join(__dirname, jadefn), options);
			var html = func(params);

			fs.writeFile(path.join(output, fn), html, 'utf-8', callback);
		};

		save('index.jade', 'index.html', this.parallel());
		save('atom.jade', 'atom.xml', this.parallel());
		save('sitemap.jade', 'sitemap.xml', this.parallel());
		save('sets.jade', 'sets.html', this.parallel());
		save('changelog.jade', 'changelog.html', this.parallel());
		save('documentation.jade', 'documentation.html', this.parallel());
	},
	function zipFiles() {
		console.log("Compressing files...");
		var self = this;
		var runParams = { cwd: jsonRoot, silent : true };
		fs.readdir(
			jsonRoot,
			function(err, files) {
				async.each(
					files,
					function(fn, cb) {
						tiptoe(
							function() {
								runUtil.run('zip', [ '-9', fn + '.zip', fn ], runParams, this.parallel());
								runUtil.run('gzip', [ '-k', fn ], runParams, this.parallel());
							},
							cb
						);
					},
					self
				);
			}
		);
	},
	function zipSpecial() {
		var runParams = { cwd: jsonRoot, silent : true };
		runUtil.run("zip", ["-9", "AllSetFiles.zip"].concat(C.SETS.map(function(SET) { return SET.code + ".json"; })), runParams, this.parallel());
		runUtil.run("zip", ["-9", "AllSetFiles-x.zip"].concat(C.SETS.map(function(SET) { return SET.code + "-x.json"; })), runParams, this.parallel());
		runUtil.run("zip", ["-9", "AllSetFilesWindows.zip"].concat(C.SETS.map(function(SET) { return SET.code + (SET.code==="CON" ? "_" : "") + ".json"; })), runParams, this.parallel());
	},
	function zipRoot() {
		var self = this;
		var runParams = { cwd: output, silent : true };
		fs.readdir(
			output,
			function(err, files) {
				async.each(
					files,
					function(fn, cb) {
						if (fn == 'json')
							return(cb());
						runUtil.run('gzip', [ '-k', fn ], runParams, cb);
					},
					self
				);
			}
		);
	},
	function(err) {
		if (err) throw(err);

		//console.log(params);

		console.log('done');
	}
);
