"use strict";
/*global setImmediate: true*/

var base = require("node-base"),
	C = require("C"),
	fs = require("fs"),
	path = require("path"),
	tiptoe = require("tiptoe"),
	rip = require("./rip.js");

function usage()
{
	base.error("Usage: node %s <set code or name>", process.argv[1]);
	process.exit(1);
}

if(process.argv.length<3)
	usage();

process.argv.slice(2).serialForEach(function(arg, subcb)
{
	var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===arg.toLowerCase() || SET.code.toLowerCase()===arg.toLowerCase()) { return SET; } });
	if(!targetSet)
	{
		base.error("Set %s not found!", arg);
		setImmediate(subcb);
		return;
	}

	tiptoe(
		function build()
		{
			rip.ripSet(targetSet.name, this);
		},
		function save(set)
		{
			fs.writeFile(path.join(__dirname, "..", "json", set.code + ".json"), JSON.stringify(set), {encoding:"utf8"}, this);
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

