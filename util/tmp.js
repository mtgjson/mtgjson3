"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	shared = require("shared"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

var MATCH_NAMES = ["Ancestral Vision", "Archdemon of Greed", "Bane of Hanweir", "Dryad Arbor", "Evermind", "Garruk, the Veil-Cursed", "Gatstaf Howler", "Ghastly Haunting", "Hinterland Scourge", "Homicidal Brute", "Howlpack Alpha", "Howlpack of Estwald", "Hypergenesis", "Insectile Aberration", "Ironfang", "Krallenhorde Killer", "Krallenhorde Wantons", "Living End", "Lord of Lineage", "Ludevic's Abomination", "Markov's Servant", "Merciless Predator", "Moonscarred Werewolf", "Nightfall Predator", "Rampaging Werewolf", "Ravager of the Fells", "Restore Balance", "Silverpelt Werewolf", "Stalking Vampire", "Terror of Kruin Pass", "Thraben Militia", "Tovolar's Magehunter", "Ulvenwald Primordials", "Unhallowed Cathar", "Unholy Fiend", "Werewolf Ransacker", "Wheel of Fate", "Wildblood Pack", "Withengar Unbound"];

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
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function checkSet(setCode, cb)
{
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function compare(setRaw)
		{
			JSON.parse(setRaw).cards.forEach(function(card)
			{
				if(MATCH_NAMES.contains(card.name))
				{
					base.info(card.colors.join(", "));
				}
			});

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
