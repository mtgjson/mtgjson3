"use strict";

var C = require('../shared/C'),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtil = require('@sembiance/xutil').dust,
	tiptoe = require("tiptoe"),
    winston = require("winston"),
    cloneDeep = require("clone-deep");

function usage()
{
	winston.error("Usage: node %s <set code or name> [cardtype]", process.argv[1]);
	process.exit(1);
}

if(process.argv.length<3 || !process.argv[2].length)
	usage();

var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===process.argv[2].toLowerCase() || SET.code.toLowerCase()===process.argv[2].toLowerCase()) { return SET; } });
if(!targetSet)
{
	winston.error("Set %s not found!", process.argv[2]);
	usage();
}

var onlyCardType = process.argv.length>=4 ? process.argv[3] : undefined;

tiptoe(
	function loadJSON()
	{
		fs.readFile(path.join(__dirname, "..", "json", targetSet.code + ".json"), {encoding:"utf8"}, this);
	},
	function render(setRaw)
	{
		renderSet(setRaw, false, this.parallel());
		renderSet(setRaw, true, this.parallel());
	},
	function save(html, htmlOriginal)
	{
		fs.writeFile(path.join(__dirname, "verify.html"), html, {encoding:"utf8"}, this);
		fs.writeFile(path.join(__dirname, "verifyOriginal.html"), htmlOriginal, {encoding:"utf8"}, this);
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

function renderSet(setRaw, original, cb)
{
	var set = JSON.parse(setRaw);
	if(onlyCardType)
		set.cards = set.cards.filter(function(card) { return card.type.toLowerCase().split(" ").contains(onlyCardType.toLowerCase()); });

	set.cards.forEach(function(card)
	{
		if(original)
		{
			card.text = card.originalText;
			card.type = card.originalType;
		}

		var dup = cloneDeep(card, true);
		["name", "manaCost", "cmc", "type", "supertypes", "types", "subtypes", "rarity", "artist", "number", "loyalty", "releaseDate", "source",
		 "power", "toughness", "text", "originalText", "originalType", "flavor", "imageName", "rulings", "layout", "multiverseid", "colors", "names",
		 "foreignNames", "printings", "legalities", "id"].forEach(function(key) { delete dup[key]; });
		card.json = util.inspect(dup);

		card.symbolrarity = card.rarity==="Basic Land" ? "Common" : card.rarity;

		if(card.text)
			card.text = card.text.replaceAll("\n", "<br>");
		if(card.originalText)
			card.originalText = card.originalText.replaceAll("\n", "<br>");
		if(card.flavor)
			card.flavor = card.flavor.replaceAll("\n", "<br>");
	});

	var dustData =
	{
		title : "[" + set.code + "] " + set.name + " (" + set.cards.length + " cards)",
		code : set.code,
		cards : set.cards
	};

	dustUtil.render(__dirname, "verify", dustData, cb);
}
