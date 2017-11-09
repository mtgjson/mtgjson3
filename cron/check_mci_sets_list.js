#!/usr/local/bin/node

"use strict";

var url = require("url"),
	C = require('../shared/C'),
	path = require("path"),
	httpUtil = require('@sembiance/xutil').http,
	domino = require("domino"),
	tiptoe = require("tiptoe"),
	winston = require("winston");

var MCI_SETS_TO_IGNORE = ["9eb", "8eb", "uhaa"];

tiptoe(
	function getPageAndPrevious()
	{
		httpUtil.get("http://magiccards.info/sitemap.html", this);
	},
	function compareVersions(setsHTML)
	{
		var mciSets = Array.toArray(domino.createWindow(setsHTML).document.querySelector("a[name='en']").nextElementSibling.nextElementSibling.querySelectorAll("li a")).map(function(o) { return path.dirname(url.parse(o.getAttribute("href")).pathname).substring(1).toLowerCase(); }).filterEmpty().unique();
		if(mciSets.length<1)
		{
			winston.error("No MCI sets found! Probably a temporary error...");
			process.exit(1);
		}

		var newMCISets = mciSets.subtract(C.SETS.filter(function(SET) { return SET.hasOwnProperty("magicCardsInfoCode"); }).map(function(SET) { return SET.magicCardsInfoCode.toLowerCase(); }).unique().concat(MCI_SETS_TO_IGNORE));
		if(newMCISets.length>0)
			winston.info(newMCISets);

		this();
	},
	function finish(err)
	{
		if(err)
		{
			winston.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
