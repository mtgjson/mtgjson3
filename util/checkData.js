"use strict";

var C = require('../shared/C'),
	shared = require('../shared/shared'),
	ansidiff = require('ansidiff'),
    winston = require('winston');

/**
 * Load the codes of all sets on C.SETS
 */
function setNames(callback) {
	var setList = [];

	var i, l = C.SETS.length;
	for (i = 0; i < l; i++) {
		setList.push(C.SETS[i].code);
	}

	if (callback)
		callback(null, setList);
}

/**
 * Builds a dictionary with ALL card information
 */
/*
var fs = require("fs");
var path = require("path");

function loadSets(callback) {
	var allSets = {};

	var processList = function(err, setList) {
		setList.serialForEach(
			function(setCode, cb) {
				fs.readFile(path.join(__dirname, '..', 'json', setCode + '.json'), 'utf8', function(err, data) {
					if (err)
						throw(err);

					var setData = JSON.parse(data);
					allSets[setCode] = setData;
					cb();
				});
			},
			function(err) {
				if (err)
					throw(err);

				callback(null, allSets);
			}
		);
	};

	setNames(processList);
}
*/

setNames(function(err, setList) {
	if (err)
		throw(err);

	var allCards = {};

	var ignoreSets = [ 'CED', 'CEI', 'pJGP', 'pREL', 'DPA', 'pSUS' ];
	var checkFields = C.ORACLE_FIELDS;

	var checkCard = function(card, setCode) {
		if (!card.name) {
			winston.error("Card with no name.");
		}

		if (card.name.match(/B.F.M. \(Big Furry Monster\)/gi))
			return;

		if (ignoreSets.indexOf(setCode) >= 0)
			return;

		if (allCards.hasOwnProperty(card.name)) {
			checkFields.forEach(function(field) {
				// Compare
				if (!card[field]) {
					if (allCards[card.name][field]) {
						winston.info("'%s' (%s) mismatch for field '%s' (previous sets: %s)", card.name, setCode, field, allCards[card.name]._sets.join(','));
					}
				}
				else {
					var fieldDifference = ansidiff.words(card[field], allCards[card.name][field]);
					if (fieldDifference)
						winston.info("'%s' (%s) has a field '%s' mismatch: '%s' (previous sets: %s)",
							card.name,
							setCode,
							field,
							fieldDifference.trim(),
							allCards[card.name]._sets.join(',')
						);
				}
			});
		}
		else {
			allCards[card.name] = card;
			allCards[card.name]._sets = [];
		}

		allCards[card.name]._sets.push(setCode);
	};

	setList.serialForEach(
		function(setCode, cb) {
			shared.processSet(
				setCode,
				function(SET) {
					SET.cards.forEach(function(card) { checkCard(card, SET.code); });
				},
				cb);
		},
		function finish() {
		}
	);
});
