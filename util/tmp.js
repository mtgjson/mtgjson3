"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	shared = require("shared"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

tiptoe(
	function processSets()
	{
		C.SETS.map(function(SET) { return SET.code; }).serialForEach(function(code, subcb)
		{
			checkSet(code, subcb);
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

function checkSet(setCode, cb)
{
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function modifyAndSave(setRaw)
		{
			var set = JSON.parse(setRaw);
			set.cards.forEach(function(card)
			{
				if(card.flavor && card.flavor.contains("“"))
					base.info("Flavor contains curly quote: %s (%s) %s", card.name, setCode, card.flavor);
			});

			//fs.writeFile(path.join(__dirname, "..", "json", setCode + ".json"), JSON.stringify(set), {encoding : "utf8"}, this);
			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
