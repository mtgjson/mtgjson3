"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	shared = require("shared"),
	path = require("path"),
	tiptoe = require("tiptoe");

shared.getSetsToDo().serialForEach(processSet, function(err) {
	if(err) {
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function processSet(code, cb) {
	base.info("Processing set: %s", code);

	tiptoe(
		function getJSON() {
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw) {
			var set = JSON.parse(setRaw);

			// Will contain all legalities on this set.
			var cardLegalitiesByName = {};
			// Which other sets have this card?
			var setCards = {};

			// Parsing each card...
			set.cards.forEach(function(card) {
				card.printings.remove(set.code); // We don't want to update our own set.

				if(!card.printings || !card.printings.length) {
					// This card has no other printings, we don't need to bother.
					return;
				}

				cardLegalitiesByName[card.name] = card.legalities;

				// Updates the printings where we need to update something
				card.printings.forEach(function(printingCode) {
					if(!setCards.hasOwnProperty(printingCode))
						setCards[printingCode] = [];

					setCards[printingCode].push(card.name);
					setCards[printingCode] = setCards[printingCode].uniqueBySort();
				});
			});

			// Go over each set and update the legalities to reflect this set.
			Object.keys(setCards).serialForEach(function(setCode, subcb) {
				updateLegalitiesForSetCards(setCode, setCards[setCode], cardLegalitiesByName, subcb);
			}, this);
		},
		function finish(err) {
			setImmediate(function() { cb(err); });
		}
	);
}

/**
 * Updates the legalities of a list of sets with the given legalities.
 * @param setCode String with the name of the set we want to update
 * @param targetCardNames Array of Strings with the names of the cards we want to update on this set.
 * @param cardLegalitiesByName Dictionary with the key being the card name and the value is the legalities
 *                             we want to reflect on the given setCode.
 * @param cb Function with the callback to pass the error or pass no parameter 
 */
function updateLegalitiesForSetCards(setCode, targetCardNames, cardLegalitiesByName, cb) {
	base.info("Adding legalities to set [%s] for all cards: %s", setCode, targetCardNames.join(", "));

	tiptoe(
		function getJSON() {
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function addPrintingsAndSave(setRaw) {
			var set = JSON.parse(setRaw);

			set.cards.forEach(function(card) {
				if(!targetCardNames.contains(card.name))
					return;

				if(!cardLegalitiesByName.hasOwnProperty(card.name))
					return;

				card.legalities = cardLegalitiesByName[card.name];
				shared.updateStandardForCard(card);
			});

			shared.saveSet(set, this);
		},
		function finish(err) {
			setImmediate(function() { cb(err); });
		}
	);
}
