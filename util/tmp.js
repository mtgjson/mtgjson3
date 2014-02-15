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

var types = [];

C.SETS.forEach(function(SET)
{
	if(SET.booster)
		types = types.concat(SET.booster.flatten());
});

base.info(types.uniqueBySort());

/*
tiptoe(
	function loadJSON()
	{
		fs.readFile(path.join(__dirname, "..", "web", "json", "AllSets.json"), {encoding:"utf8"}, this);
	},
	function analyze(setsJSON)
	{
		var notPresent = 0;
		var empty = 0;
		var hasItems = 0;

		Object.values(JSON.parse(setsJSON)).map(function(set) { return set.cards; }).flatten().forEach(function(card)
		{
			if(!card.hasOwnProperty("colors") || !Array.isArray(card.colors))
				base.info(card.name);
			else if(card.colors.length===0)
				empty++;
			else
				hasItems++;
		});

		base.info("notPresent: %s\nempty: %s\nhasItems: %s\n", notPresent, empty, hasItems);
		this();
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
);*/