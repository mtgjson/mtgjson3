"use strict";

var base = require("node-base"),
	C = require("C"),
	fs = require("fs"),
	path = require("path"),
	querystring = require("querystring"),
	url = require("url"),
	rip = require("./rip.js"),
	moment = require("moment"),
	tiptoe = require("tiptoe");

rip.tmp(function(err) { if(err) { base.error(err); } process.exit(); });

//base.info(querystring.parse(url.parse("../Card/Details.aspx?multiverseid=923").query).multiverseid);

//base.info(listURL);

//"http://gatherer.wizards.com/Pages/Search/Default.aspx?output=checklist&sort=cn+&set=[%22" + setName.replaceAll(" ", "%20") + "%22]"

/*
tiptoe(
	function load()
	{
		fs.readFile(path.join(__dirname, "..", "json", "sets.json"), {encoding:"utf8"}, this);
	},
	function changeAndSave(setsJSON)
	{
		var sets = JSON.parse(setsJSON);
		sets.sort(function(a, b)
		{
			return moment(a.releaseDate, "YYYY-MM-DD").unix()-moment(b.releaseDate, "YYYY-MM-DD").unix();
		});
		fs.writeFile(path.join(__dirname, "..", "json", "sets.json"), JSON.stringify(sets), {encoding:"utf8"}, this);
	},
	function finish(err)
	{
		if(err)
		{
			base.error(process.error);
			process.exit(1);
		}

		process.exit();
	}
);*/