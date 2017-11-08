/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var base = require('@sembiance/xbase');
var C = require('../shared/C');
var shared = require('../shared/shared');
var tiptoe = require('tiptoe');
var rip = require('./rip.js');
var async = require('async');

var langRef = {
	"ch": "Chinese Simplified",		// TODO: Fixme.
	"cn": "Chinese Simplified",		// TODO: Fixme.
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

if (require.main == module) {
	// Only fetch automatically if we're called directly.
	if (process.argv.length < 4) {
		base.error("Usage: node %s <2-digit-lang|all> <set codes>\n- Only one language at a time\n- The set must already be retrieved by 'buildSet'", process.argv[1]);
		process.exit(1);
	}

	var langCode = process.argv[2].toLowerCase();

	var setsToDo = shared.getSetsToDo(3);

	async.eachSeries(
		setsToDo,
		function(code, subcb) {
			var setInfo = null;
			C.SETS.map(function(x) { if (x.code == code) setInfo = x; });

			if (setInfo === null) {
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
				langs = [ langCode ];
			}

			async.eachSeries(
				langs,
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
}

function buildLang(lang, setCode, callback) {
	console.log('%s:%s', setCode, lang);

	fs.readFile(path.join(__dirname, '..', 'json', setCode.toUpperCase() + '.json'), 'utf8', function(err, data) {
		if (err) {
			console.error(err);
			return(setImmediate(function() { callback(err); }));
		}

                var msg;
		var setData = JSON.parse(data);
		if (!setData.translations) {
			msg = "Set " + setCode + " does not have any translations.";
			console.error(msg);
			return(setImmediate(callback, msg));
		}
		if (!setData.translations[lang]) {
			msg = "Set " + setCode + " does not have the requested translation: '" + lang + "'.";
			console.error(msg);
			return(setImmediate(callback, msg));
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

					if (multiverseid === null) {
						console.error("Cannot find correct multiverseid for card '%s'", card.name);
						return(setImmediate(cb));
					}

					multiverseids.push(multiverseid);
					setImmediate(cb);
				},
				this
			);
		},
		function processIds() {
			rip.processMultiverseids(multiverseids, this);
		},
		function processCards(cards) {
			fullSet.cards = Array.prototype.slice.call(cards).map(function(card) {
				if (card.rulings) {
					card.rulings = null;
					delete card.rulings;
				}

				return(card);
			});

			base.info("Doing set corrections...");
			shared.performSetCorrections(shared.getSetCorrections(fullSet.code), fullSet);

			shared.saveSet(fullSet, this);
		},
		function finish(err) {
			if (callback) callback(err);
			console.log('done fetching set ' + set.code);
		}
	);
}

module.exports = buildLang;
