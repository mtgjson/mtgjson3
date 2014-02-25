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
	httpUtil = require("xutil").http,
	path = require("path"),
	tiptoe = require("tiptoe");

//http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=GU&size=large&rarity=C

C.SETS.serialForEach(processSet, function finish(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function processSet(SET, cb)
{
	if(!SET.hasOwnProperty("gathererCode"))
		return setImmediate(cb);

	tiptoe(
		function loadJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this);
		},
		function modifyAndSave(setRaw)
		{
			var setData = JSON.parse(setRaw);
			setData.gathererCode = SET.gathererCode;

			fs.writeFile(path.join(__dirname, "..", "json", SET.code + ".json"), JSON.stringify(setData), {encoding : "utf8"}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}