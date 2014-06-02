"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	util = require("util"),
	url = require("url"),
	moment = require("moment"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

tiptoe(
	function loadHTML()
	{
		request("http://dev.mtgjson.com/", this);
	},
	function processHTML(response, pageHTML)
	{
		var changeLog = [];
		var doc = cheerio.load(pageHTML);
		doc("table.changeLog tbody tr").map(function(i, item) { return doc(item); }).forEach(function(tr)
		{
			var changeEntry = {
				version : tr.find("td:nth-child(1)").text().trim(),
				when : moment(tr.find("td:nth-child(2)").text().trim(), "MMM D, YYYY").format("YYYY-MM-DD"),
				changes : []
			};

			tr.find("td:nth-child(3) > ul > li").map(function(i, item) { return doc(item); }).map(function(change)
			{ 
				var subLIs = change.find("ul li");
				if(subLIs.length>0)
					subLIs.forEach(function(subLI) { changeEntry.changes.push("Added set: " + subLI.text()); });
				else
					changeEntry.changes.push(change.text());
			});

			changeLog.push(changeEntry);
		});
		
		//base.info(util.inspect(changeLog, {depth : null}));
		base.info(JSON.stringify(changeLog, null, "\t"));
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

checkSets(function() { process.exit(0); });

function checkSets(cb)
{
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
			setImmediate(function() { cb(err); });
		}
	);
}

function checkSet(setCode, cb)
{
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function compare(setRaw)
		{
			var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.code===setCode) { return SET; } });
			if(!targetSet.hasOwnProperty("oldCode"))
				return this();

			var set = JSON.parse(setRaw);
			set.oldCode = targetSet.oldCode;

			fs.writeFile(path.join(__dirname, "..", "json", setCode + ".json"), JSON.stringify(set), {encoding : "utf8"}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
