#!/usr/local/bin/node

"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	fs = require("fs"),
	url = require("url"),
	path = require("path"),
	httpUtil = require("xutil").http,
	domino = require("domino"),
	tiptoe = require("tiptoe");

tiptoe(
	function getPageAndPrevious()
	{
		httpUtil.get("http://gatherer.wizards.com/Pages/Default.aspx", this.parallel());
		fs.readFile(path.join(__dirname, "previous_sets.json"), { encoding : "utf8"}, this.parallel());
	},
	function compareVersions(setsHTML, previousSetsJSON)
	{

		var sets = Array.toArray(domino.createWindow(setsHTML[0]).document.querySelectorAll("select#ctl00_ctl00_MainContent_Content_SearchControls_setAddText option")).map(function(o) { return o.getAttribute("value").trim(); }).filterEmpty();
		if(sets.length<1)
		{
			base.error("No sets found! Probably a temporary error...");
			process.exit(1);
		}

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