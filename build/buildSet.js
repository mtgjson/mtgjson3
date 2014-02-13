"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	optimist = require("optimist"),
	path = require("path"),
	tiptoe = require("tiptoe"),
	rip = require("./rip.js");

optimist = optimist.boolean("forcePrintings");
var argv = optimist.argv;

function usage()
{
	base.error("Usage: node %s <set code or name>", process.argv[1]);
	process.exit(1);
}

if(argv._.length<1)
	usage();

var forcePrintings = !!argv.forcePrintings;

var setsToDo = argv._;
if(setsToDo.length===1 && setsToDo[0].toLowerCase()==="allsets")
{
	setsToDo = C.SETS.map(function(SET) { return SET.code; });
}
else if(setsToDo.length===1 && setsToDo[0].toLowerCase().startsWith("startat"))
{
	var targetSetCode = setsToDo[0].substring("startat".length);
	setsToDo = C.SETS.map(function(SET) { return SET.code; });
	setsToDo = setsToDo.slice(setsToDo.indexOf(targetSetCode));
}

base.info("Doing sets: %s", setsToDo);

setsToDo.serialForEach(function(arg, subcb)
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
			rip.ripSet(targetSet.name, {forcePrintings : forcePrintings}, this);
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
