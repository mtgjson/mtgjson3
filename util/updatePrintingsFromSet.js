"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	fs = require("fs"),
	shared = require("shared"),
	path = require("path"),
	tiptoe = require("tiptoe");

if (require.main == module) {
	shared.getSetsToDo().serialForEach(processSet, function(err) {
		if(err) {
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	});
}

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
				card.printings.remove(set.code);
				if(!card.printings || !card.printings.length)
					return;

				card.printings.forEach(function(printing)
				{
					if(!setCards.hasOwnProperty(printing))
						setCards[printing] = [];

					setCards[printing].push(card.name);
					setCards[printing] = setCards[printing].uniqueBySort();
				});
			});

			Object.keys(setCards).serialForEach(function(setCode, subcb)
			{
				addPrintingToSetCards(setCode, setCards[setCode], set.code, subcb);
			}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function addPrintingToSetCards(setCode, targetCardNames, printingCode, cb)
{
	base.info("Adding printing [%s] to set [%s] for all cards: %s", printingCode, setCode, targetCardNames.join(", "));

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

				if(!card.printings.contains(printingCode))
				{
					card.printings.push(printingCode);
					shared.finalizePrintings(card);
				}
			});

			shared.saveSet(set, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

module.exports = processSet;
