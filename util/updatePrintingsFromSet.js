"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	shared = require("shared"),
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

			var setCards = {};
			set.cards.forEach(function(card)
			{
				card.printings.remove(set.name);
				if(!card.printings || !card.printings.length)
					return;

				card.printings.forEach(function(printing)
				{
					var printingCode = getSetCodeByName(printing);
					if(!printingCode)
					{
						base.error("Unknown printing: %s", printing);
						return;
					}

					if(!setCards.hasOwnProperty(printingCode))
						setCards[printingCode] = [];

					setCards[printingCode].push(card.name);
					setCards[printingCode] = setCards[printingCode].uniqueBySort();
				});
			});

			Object.keys(setCards).serialForEach(function(setCode, subcb)
			{
				addPrintingToSetCards(setCode, setCards[setCode], set.name, subcb);
			}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function addPrintingToSetCards(setCode, targetCardNames, printingName, cb)
{
	base.info("Adding printing [%s] to set [%s] for all cards: %s", printingName, setCode, targetCardNames.join(", "));

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

				if(!card.printings.contains(printingName))
				{
					card.printings.push(printingName);
					card.printings = shared.sortPrintings(card.printings);
				}

				if(!card.printingCodes.contains(setCode))
				{
					card.printingCodes.push(setCode);
					card.printingCodes = shared.sortPrintingCodes(card.printingCodes);
				}
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