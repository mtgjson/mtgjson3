"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	shared = require("shared"),
	fs = require("fs"),
	path = require("path"),
	tiptoe = require("tiptoe");


tiptoe(
	function loadJSON()
	{
		fs.readFile(path.join(__dirname, "..", "json", "RQS.json"), {encoding:"utf8"}, this);
	},
	function parseJSON(rawJSON)
	{
		var set = JSON.parse(rawJSON);
		set.cards.forEach(function(card)
		{
			base.info("cp \"4ed/%s.jpg\" rqs/", card.imageName);
			base.info("cp \"4ed/%s.crop.jpg\" rqs/", card.imageName);
			base.info("cp \"4ed/%s.hq.jpg\" rqs/", card.imageName);
			base.info("cp \"4ed/%s.crop.hq.jpg\" rqs/", card.imageName);
		});

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
);
