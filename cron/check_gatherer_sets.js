#!/usr/local/bin/node

"use strict";
/*global setImmediate: true*/

var base = require("node-base"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	path = require("path"),
	tiptoe = require("tiptoe");

tiptoe(
	function getPageAndPrevious()
	{
		request("http://gatherer.wizards.com/Pages/Default.aspx", this.parallel());
		fs.readFile(path.join(__dirname, "previous_sets.json"), { encoding : "utf8"}, this.parallel());
	},
	function compareVersions(currentHTML, previousSetsJSON)
	{
		var sets = [];

		var doc = cheerio.load(currentHTML);

		doc("select#ctl00_ctl00_MainContent_Content_SearchControls_setAddText option").map(function(i, item) { return doc(item); }).forEach(function(option)
		{
			var value = option.attr("value").trim();
			if(!value)
				return;

			sets.push(value);
		});

		var previousSets = JSON.parse(previousSetsJSON);

		var removedSets = previousSets.subtract(sets);
		if(removedSets.length)
			base.info("Sets Removed: %s", removedSets.join(", "));

		var addedSets = sets.subtract(previousSets);
		if(addedSets.length)
			base.info("Sets Added: %s", addedSets.join(", "));

		fs.writeFile(path.join(__dirname, "previous_sets.json"), JSON.stringify(sets), {encoding : "utf8"}, this);
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