"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

var setsToDo = process.argv.slice(2);
if(setsToDo.length===1 && setsToDo[0].toLowerCase()==="allsets")
{
	setsToDo = C.SETS.map(function(SET) { return SET.code; });
}

tiptoe(
	function processSets()
	{
		setsToDo.serialForEach(function(code, subcb)
		{
			processSet(code, subcb);
		}, this);
	},
	function processSetsX()
	{
		setsToDo.serialForEach(function(code, subcb)
		{
			processSet(code + "-x", subcb);
		}, this);
	},
	function finish(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function processSet(code, cb)
{
	base.info("%s", code);

	tiptoe(
		function getJSON()
		{
			request("http://mtgjson.com/json/" + code + ".json", this.parallel());
			fs.readFile(path.join(__dirname, "..", "web", "json", code + ".json"), {encoding : "utf8"}, this.parallel());
		},
		function compare(oldJSONArgs, newJSON)
		{
			var result = compareSets(JSON.parse(oldJSONArgs[1]), JSON.parse(newJSON));
			if(result)
				console.log(result);

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function compareSets(oldSet, newSet)
{
	var result = "";
	var oldCardsMap = oldSet.cards.mutate(function(card, result) { result[(card.name + " (" + card.multiverseid + ")")] = card; return result; }, {});
	var newCardsMap = newSet.cards.mutate(function(card, result) { result[(card.name + " (" + card.multiverseid + ")")] = card; return result; }, {});

	var cardsChanged = diffUtil.diff(Object.keys(oldCardsMap), Object.keys(newCardsMap));
	if(cardsChanged)
	{
		result += "Cards Changed : ";
		result += cardsChanged;
	}

	Object.forEach(oldCardsMap, function(key, oldCard)
	{
		if(!newCardsMap.hasOwnProperty(key))
			return;

		var newCard = newCardsMap[key];

		var subResult = diffUtil.diff(oldCard, newCard);
		if(subResult)
		{
			result += color.magenta(JSON.stringify(key)) + " : \n";
			result += subResult;
		}
	});

	return result;
}
