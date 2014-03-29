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


checkSetsForDups(function() { process.exit(0); });

function checkSetsForDups(cb)
{
	tiptoe(
		function processSets()
		{
			C.SETS.map(function(SET) { return SET.code; }).serialForEach(function(code, subcb)
			{
				checkSetForDups(code, subcb);
			}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function checkSetForDups(setCode, cb)
{
	var ALLOWED_DUPS = ["B.F.M. (Big Furry Monster)"];
	
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "web", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function compare(setRaw)
		{
			var setData = JSON.parse(setRaw);
			var cardsByName = {};

			setData.cards.forEach(function(card)
			{
				if(card.hasOwnProperty("variations") || ALLOWED_DUPS.contains(card.name))
					return;

				if(cardsByName.hasOwnProperty(card.name))
					base.info("%s DUP: %s\n%s", setCode, card.name, diffUtil.diff(cardsByName[card.name], card));
				else
					cardsByName[card.name] = card;
			});

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
