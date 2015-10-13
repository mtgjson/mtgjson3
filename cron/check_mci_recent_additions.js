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
		httpUtil.get("http://magiccards.info/additions.html", this.parallel());
		fs.readFile(path.join(__dirname, "previous_mci_additions.json"), { encoding : "utf8"}, this.parallel());
	},
	function compareVersions(setsHTML, previousSetsJSON)
	{

		var additions = Array.toArray(domino.createWindow(setsHTML[0]).document.querySelector("h1").nextElementSibling.querySelectorAll("tr td:nth-child(1) a")).map(function(o) { return o.textContent.trim(); }).filterEmpty();
		if(additions.length<1)
		{
			base.error("No additions found! Probably a temporary error...");
			process.exit(1);
		}

		var previousAdditions = JSON.parse(previousSetsJSON);

		if(additions.join(", ")!==previousAdditions.join(", "))
			base.info("Sets changed.\nBefore: %s\n\nAfter: %s", previousAdditions.join(", "), additions.join(", "));

		fs.writeFile(path.join(__dirname, "previous_mci_additions.json"), JSON.stringify(additions, null, '  ');, {encoding : "utf8"}, this);
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