"use strict";

var fs = require("fs"),
	path = require("path"),
	shared = require('../shared/shared'),
	tiptoe = require("tiptoe"),
	winston = require("winston");

shared.getSetsToDo().serialForEach(processSet, function(err) {
	if(err) {
		winston.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function fixCard(card) {
	if (!card.text)
		return;

	var text = card.text;
	var newText = text.replace(
		/Add {([0-9]*)}/gi,
		function(full, part) {
			var ret = 'Add ';
			for (var i = 0; i < part; i++)
				ret += '{C}';
			return(ret);
		}
	);
	card.text = newText;
}

function processSet(code, cb) {
	winston.info("Fixing mana generation for set: %s", code);

	var set = null;

	tiptoe(
		function getJSON() {
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw) {
			set = JSON.parse(setRaw);

			var i, l = set.cards.length;
			for (i = 0; i < l; i++) {
				fixCard(set.cards[i]);
			}

			this();
		},
		function saveSet() {
			if (set === null) {
				throw('Error processing set');
			}

			shared.saveSet(set, this);
		},
		function finish(err) {
			setImmediate(function() { cb(err); });
		}

	);
}
