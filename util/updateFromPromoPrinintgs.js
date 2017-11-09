"use strict";

var fs = require("fs"),
	shared = require('../shared/shared'),
	path = require("path"),
	tiptoe = require("tiptoe"),
	winston = require("winston"),
	childProcess = require("child_process");

var cardsByName = {};

tiptoe(
	function getJSON()
	{
		winston.info("Loading promo sets...");

		shared.getMCISetCodes().serialForEach(function(setCode, subcb)
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, subcb);
		}, this);
	},
	function processSets(setsRaw)
	{
		winston.info("Parsing promo sets...");

		var sets = setsRaw.map(function(setRaw) { return JSON.parse(setRaw); });

		winston.info("Iterating over promo set cards...");
		sets.forEach(function(set)
		{
			set.cards.forEach(function(card)
			{
				if(!cardsByName.hasOwnProperty(card.name))
					cardsByName[card.name] = [];

				cardsByName[card.name].push(set);
			});
		});

		sets.forEach(function(set)
		{
			set.cards.forEach(function(card)
			{
				card.printings.push(set.name);
				card.printings = card.printings.concat(cardsByName[card.name].map(function(set) { return set.name; }));
				shared.finalizePrintings(card);
			});
		});

		winston.info("Saving promo sets...");
		sets.serialForEach(function(set, subcb)
		{
			shared.saveSet(set, subcb);
		}, this);
	},
	function updateOtherSets()
	{
        var cb = this;
        var cmd = 'node ' + path.join(__dirname, 'updatePrintingsFromSet.js') + ' mcisets';
        childProcess.exec(cmd, function(err, stdout, stderr) {
            if (stdout) winston.info(stdout);
            if (stderr) winston.console.error(stderr);
            return cb(err);
        });
	},
	function finish(err)
	{
		if(err)
		{
			winston.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
