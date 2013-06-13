"use strict";

var base = require("node-base"),
	fs = require("fs"),
	path = require("path"),
	tiptoe = require("tiptoe"),
	rip = require("./rip.js");

var sets = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "json", "sets.json"), {encoding:"utf8"}));

function usage()
{
	base.error("Usage: node %s <set code or name>", process.argv[1]);
	process.exit(1);
}

if(process.argv.length<3 || !process.argv[2].length)
	usage();

var targetSet = sets.mutateOnce(function(set) { if(set.name.toLowerCase()===process.argv[2].toLowerCase() || set.code.toLowerCase()===process.argv[2].toLowerCase()) { return set; } });
if(!targetSet)
{
	base.error("Set %s not found!", process.argv[2]);
	usage();
}

tiptoe(
	function getCards()
	{
		rip.cards(targetSet.name, this);
	},
	function processCards(cards)
	{
		base.info(cards);
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