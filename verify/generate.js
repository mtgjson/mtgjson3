"use strict";

var base = require("node-base"),
	C = require("C"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("node-utils").dust,
	tiptoe = require("tiptoe");

function usage()
{
	base.error("Usage: node %s <set code or name>", process.argv[1]);
	process.exit(1);
}

if(process.argv.length<3 || !process.argv[2].length)
	usage();

var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===process.argv[2].toLowerCase() || SET.code.toLowerCase()===process.argv[2].toLowerCase()) { return SET; } });
if(!targetSet)
{
	base.error("Set %s not found!", process.argv[2]);
	usage();
}

tiptoe(
	function loadJSON()
	{
		fs.readFile(path.join(__dirname, "..", "json", targetSet.code + ".json"), {encoding:"utf8"}, this);
	},
	function render(setRaw)
	{
		var set = JSON.parse(setRaw);
		set.cards.forEach(function(card)
		{
			var dup = base.clone(card, true);
			["name", "manaCost", "cmc", "type", "supertypes", "types", "subtypes", "rarity", "artist", "number", "loyalty", "power", "toughness", "text", "flavor", "imageName", "rulings", "layout", "multiverseid", "colors", "names", "foreignNames"].forEach(function(key) { delete dup[key]; });
			card.json = util.inspect(dup);

			if(card.text)
				card.text = card.text.replaceAll("\n", "<br>");
			if(card.flavor)
				card.flavor = card.flavor.replaceAll("\n", "<br>");
		});

		var dustData =
		{
			title : "[" + set.code + "] " + set.name + " (" + set.cards.length + " cards)",
			code : set.code,
			cards : set.cards
		};

		dustUtil.render(__dirname, "verify", dustData, this);
	},
	function save(html)
	{
		fs.writeFile(path.join(__dirname, "verify.html"), html, {encoding:"utf8"}, this);
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