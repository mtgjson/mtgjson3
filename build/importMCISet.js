"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	path = require("path"),
	shared = require("shared"),
	tiptoe = require("tiptoe"),
	rip = require("./rip.js");

var setsToDo = shared.getSetsToDo();

base.info("Doing sets: %s", setsToDo);

setsToDo.serialForEach(function(arg, subcb)
{
	var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===arg.toLowerCase() || SET.code.toLowerCase()===arg.toLowerCase()) { return SET; } });
	if(!targetSet)
	{
		base.error("Set %s not found!", arg);
		return setImmediate(subcb);
	}

	if(!targetSet.isMCISet)
	{
		base.error("Set %s is not an MCI set (isMCISet is not set)", arg);
		return setImmediate(subcb);
	}

	tiptoe(
		function build()
		{
			rip.ripMCISet(targetSet, this);
		},
		function save(set)
		{
			fs.writeFile(path.join(__dirname, "..", "json", set.code + ".json"), JSON.stringify(set, null, '  ');, {encoding:"utf8"}, this);
		},
		function finish(err)
		{
			subcb(err);
		}
	);
}, function exit(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});
