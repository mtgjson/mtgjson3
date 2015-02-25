"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	shared = require("shared"),
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

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
	base.info("Processing set: %s", code);

	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw)
		{
			var set = JSON.parse(setRaw);

			var cardLegalitiesByName = {};
			var setCards = {};
			set.cards.forEach(function(card)
			{
				card.printings.remove(set.name);
				if(!card.printings || !card.printings.length)
					return;

				cardLegalitiesByName[card.name] = card.legalities;

				card.printings.forEach(function(printing)
				{
					var printingCode = getSetCodeByName(printing);

					if(!setCards.hasOwnProperty(printingCode))
						setCards[printingCode] = [];

					setCards[printingCode].push(card.name);
					setCards[printingCode] = setCards[printingCode].uniqueBySort();
				});
			});

			Object.keys(setCards).serialForEach(function(setCode, subcb)
			{
				updateLegalitiesForSetCards(setCode, setCards[setCode], cardLegalitiesByName, subcb);
			}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function updateLegalitiesForSetCards(setCode, targetCardNames, cardLegalitiesByName, cb)
{
	base.info("Adding legalities to set [%s] for all cards: %s", setCode, targetCardNames.join(", "));

	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function addPrintingsAndSave(setRaw)
		{
			var set = JSON.parse(setRaw);

			set.cards.forEach(function(card)
			{
				if(!targetCardNames.contains(card.name))
					return;

				if(!cardLegalitiesByName.hasOwnProperty(card.name))
					return;

				card.legalities = cardLegalitiesByName[card.name];
			});

			fs.writeFile(path.join(__dirname, "..", "json", setCode + ".json"), JSON.stringify(set), {encoding : "utf8"}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function getSetCodeByName(name)
{
	return C.SETS.mutateOnce(function(SET) { return SET.name===name ? SET.code : undefined; });
}