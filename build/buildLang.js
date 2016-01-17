"use strict";

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	path = require("path"),
	shared = require("shared"),
	tiptoe = require("tiptoe"),
	rip = require("./rip.js"),
	urlUtil = require("xutil").url;

var langRef = {
	"ch": "Chinese Simplified",		// TODO: Fixme.
	"ch-s": "Chinese Traditional",	// TODO: Fixme.
	"fr": "French",
	"de": "German",
	"it": "Italian",
	"jp": "Japanese",
	"ko": "Korean",
	"pt": "Portuguese (Brazil)",
	"ru": "Russian",
	"es": "Spanish",
};

if(process.argv.length<4) {
	base.error("Usage: node %s <2-digit-lang|all> <set codes>\n- Only one language at a time\n- The set must already be retrieved by 'buildSet'", process.argv[1]);
	process.exit(1);
}

var langCode = process.argv[2].toLowerCase();

shared.getSetsToDo(3).serialForEach(
	function(code, subcb) {
		var setInfo = null;
		C.SETS.map(function(x) { if (x.code == code) setInfo = x; });

		if (setInfo == null) {
			console.error("Invalid set: %s", code);
			return(setImmediate(subcb));
		}

		var langs = [];

		if (!setInfo.translations) {
			console.error("No translations for set: %s", code);
			return(setImmediate(subcb));
		}

		if (langCode === 'all') {
			langs = Object.keys(setInfo.translations);
		}
		else {
			langs = [ code ];
		}

		langs.serialForEach(
			function (cLang, codecb) {
				buildLang(cLang, code, codecb);
			},
			subcb
		);
	},
	function(err) {
		if (err) {
			console.error(err);
			throw(err);
		}

		console.log('done.');
	}
);

function buildLang(lang, setCode, callback) {
	console.log(setCode);

	fs.readFile(path.join(__dirname, '..', 'json', setCode.toUpperCase() + '.json'), 'utf8', function(err, data) {
		if (err) {
			console.error(err);
			return(setImmediate(function() { callback(err); }));
		}

		var setData = JSON.parse(data);
		if (!setData.translations) {
			var msg = "Set " + setCode + " does not have any translations.";
			console.error(msg);
			return(setImmediate(function() { callback(msg); }));
		}
		if (!setData.translations[lang]) {
			var msg = "Set " + setCode + " does not have the requested translation: '" + lang + "'.";
			console.error(msg);
			return(setImmediate(function() { callback(msg); }));
		}

		retrieve(lang, setData, callback);
	});
}

function retrieve(lang, set, callback) {
	var fullSet = {
		'name': set.translations[lang],
		'code': set.code,
		'language': lang
	};

	console.log("Processing %d cards", set.cards.length);

	var multiverseids = [];

	tiptoe(
		function getMultiverses() {
			set.cards.serialForEach(
				function(card, cb) {
					// Find language
					var i, l = card.foreignNames.length;
					var multiverseid = null;
					for (i = 0; i < l; i++) {
						if (card.foreignNames[i].language == langRef[lang])
							multiverseid = card.foreignNames[i].multiverseid;
					}

					if (multiverseid == null) {
						console.error("Cannot find correct multiverseid for card '%s'", card.name);
						return(setImmediate(cb));
					}

					multiverseids.push(multiverseid);
					cb();
				},
				this
			);
		},
		function processIds() {
			rip.processMultiverseids(multiverseids, this);
		},
		function () {
			var cards = arguments[0];
			fullSet.cards = Array.prototype.slice.call(cards).map(function(card) {
				if (card.rulings) {
					card.rulings = null;
					delete card.rulings;
				}

				return(card);
			});

			shared.saveSet(fullSet, this);
			//fs.writeFile(path.join(__dirname, 'test.json'), JSON.stringify(fullSet, null, '  '), 'utf8', this);
		},
		function finish(err) {
			if (callback) callback(err);
			console.log('done');
		}
	);
}