"use strict";

var base = require('@sembiance/xbase'),
	shared = require("shared"),
	fs = require("fs"),
	path = require("path"),
	tiptoe = require("tiptoe");

var CARD_FIELDS = [ "name", "number", "rarity", "type", "manaCost", "text", "flavor", "artist", "power", "toughness"];

console.log("Set Name\tSet Code\t" + CARD_FIELDS.join("\t"));

shared.getSetsToDo().serialForEach(processSet, function(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function processSet(code, cb)
{
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw)
		{
			var set = JSON.parse(setRaw);
			set.cards.forEach(function(card)
			{
				process.stdout.write(set.name + "\t" + set.code + "\t");

				CARD_FIELDS.forEach(function(CARD_FIELD, i)
				{
					if(i>0)
						process.stdout.write("\t");

					if(card.hasOwnProperty(CARD_FIELD))
						process.stdout.write(typeof card[CARD_FIELD]==="string" ? card[CARD_FIELD].replaceAll("\n", " ").replaceAll("\t", " ") : card[CARD_FIELD]);
				});

				process.stdout.write("\n");
			});

			this();
		},
		cb
	);
}
