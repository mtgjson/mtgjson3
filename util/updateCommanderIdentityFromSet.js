"use strict";

var base = require("xbase"),
	fs = require("fs"),
	path = require("path"),
	shared = require("shared"),
	tiptoe = require("tiptoe"),
	rip = require('../build/rip.js');

shared.getSetsToDo().serialForEach(processSet, function(err) {
	if(err) {
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function processSet(code, cb) {
	base.info("Processing ColorIdentity for set: %s", code);

	var set = null;

	tiptoe(
		function getJSON() {
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw) {
			set = JSON.parse(setRaw);

			rip.fixCommanderIdentityForCards(set.cards, this);
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
