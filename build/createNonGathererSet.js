"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	path = require("path"),
	moment = require("moment"),
	fs = require("fs"),
	shared = require("shared"),
	tiptoe = require("tiptoe");

var targetSetCode = process.argv[2];
if(!C.SETS_NOT_ON_GATHERER.contains(targetSetCode))
{
	base.error("Usage: node %s <set code>", process.argv[1]);
	process.exit(1);
}

var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.code===targetSetCode) { return SET; } });
if(!C.EXTRA_SET_CARD_PRINTINGS.hasOwnProperty(targetSet.code))
	process.exit(0);

var newSet = base.clone(targetSet);
newSet.cards = [];

tiptoe(
	function getTargetMultiverseids()
	{
		getMultiverseidsForSet(targetSetCode, this);
	},
	function processSets(targetMultiverseids)
	{
		C.SETS.map(function(SET) { return SET.code; }).serialForEach(function(setCode, subcb) { processSet(setCode, targetMultiverseids, subcb); }, this);
	},
	function saveAndFinish(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		shared.performSetCorrections(shared.getSetCorrections(targetSetCode), newSet);

		newSet.cards = newSet.cards.sort(shared.cardComparator);

		fs.writeFileSync(path.join(__dirname, "..", "json", targetSetCode + ".json"), JSON.stringify(newSet), {encoding : "utf8"});

		process.exit(0);
	}
);

function processSet(setCode, targetMultiverseids, cb)
{
	if(setCode===targetSetCode)
		return setImmediate(cb);

	var MODERN_CREATURE_TYPES = ["DKM"];

	tiptoe(
		function loadSetJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
			
		},
		function processSetJSON(err, setRaw)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var set = JSON.parse(setRaw);
			set.cards.forEach(function(card)
			{
				if(card.multiverseid && targetMultiverseids.contains(card.multiverseid))
				{
					var newCard = base.clone(card, true);
					delete newCard.multiverseid;
					delete newCard.variations;
					delete newCard.number;
					delete newCard.border;

					if(C.SETS_WITH_NO_IMAGES.contains(targetSetCode))
					{
						delete newCard.imageName;
					}
					else
					{
						newCard.imageName = newCard.imageName.trim("0123456789 .");
						if(newCard.rarity==="Basic Land")
							newCard.imageName = newCard.imageName + "1";
					}

					if(newCard.rarity!=="Basic Land")
						newCard.rarity = "Special";

					if(MODERN_CREATURE_TYPES.contains(targetSetCode))
						newCard.originalType = newCard.originalType.replace("Summon", "Creature");

					newSet.cards.push(newCard);
				}
			});

			return setImmediate(cb);
		}
	);
}

function getMultiverseidsForSet(setCode, cb)
{
	var SPECIFIC_CARD_MULTIVERSEIDS =
	{
		ATH :
		{
			"Aesthir Glider" : 3041,
			"Armageddon" : 2320,
			"Armored Pegasus" : 4374,
			"Combat Medic" : 1970,
			"Disenchant" : 2337,
			"Erhnam Djinn" : 945,
			"Feast of the Unicorn" : 16625,
			"Giant Spider" : 2216,
			"Goblin Grenade" : 1952,
			"Goblin Matron" : 6596,
			"Gorilla Chieftain" : 3143,
			"Hurricane" : 3986,
			"Hymn to Tourach" : 1849,
			"Icatian Javelineers" : 1985,
			"Raging Goblin" : 6106,
			"Scavenger Folk" : 1777,
			"Swamp" : 2743,
			"Unholy Strength" : 2133,
			"Warrior's Honor" : 3731
		},
		DPA :
		{
			"Elvish Warrior" : 153003,
			"Shock": 83261
		}
	};

	var EXTRA_SETS_TO_ALLOW =
	{
		ATH : ["6ED", "PO2"]
	};

	var ONLY_ALLOW_SETS =
	{
		DKM : ["ICE", "ALL"],
		RQS : ["4ED"]
	};

	tiptoe(
		function loadAllSets()
		{
			var validSets = C.SETS.filter(function(SET) { return !C.SETS_NOT_ON_GATHERER.contains(SET.code); });
			if(ONLY_ALLOW_SETS.hasOwnProperty(targetSetCode))
				validSets = C.SETS.filter(function(SET) { return ONLY_ALLOW_SETS[targetSetCode].contains(SET.code); });
			else
				validSets = C.SETS.filter(function(SET) { return (moment(SET.releaseDate, "YYYY-MM-DD").unix()<moment(targetSet.releaseDate, "YYYY-MM-DD").unix()) || (EXTRA_SETS_TO_ALLOW.hasOwnProperty(targetSetCode) && EXTRA_SETS_TO_ALLOW[targetSetCode].contains(SET.code)); });

			validSets = validSets.reverse();
			
			var coreSets = validSets.filter(function(SET) { return SET.type==="core"; });
			var nonCoreSets = validSets.filter(function(SET) { return SET.type!=="core"; });
			coreSets.concat(nonCoreSets).map(function(SET) { return SET.code; }).serialForEach(loadSetCards, this);
		},
		function getMultiverseids(err)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var allCards = Array.prototype.slice.apply(arguments).flatten().flatten();
			var cardsToGet = base.clone(C.EXTRA_SET_CARD_PRINTINGS[targetSet.code]);

			var multiverseids = [];
			allCards.forEach(function(card)
			{
				if(!card)
					return;

				if(cardsToGet.contains(card.name) && (!SPECIFIC_CARD_MULTIVERSEIDS.hasOwnProperty(targetSetCode) || !SPECIFIC_CARD_MULTIVERSEIDS[targetSetCode].hasOwnProperty(card.name) || SPECIFIC_CARD_MULTIVERSEIDS[targetSetCode][card.name]===card.multiverseid))
				{
					cardsToGet.remove(card.name);
					multiverseids.push(card.multiverseid);
				}
			});

			return setImmediate(function() { cb(undefined, multiverseids); });
		}
	);
}

function loadSetCards(setCode, cb)
{
	tiptoe(
		function loadSetJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function processSetJSON(err, setRaw)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			setImmediate(function() { cb(undefined, JSON.parse(setRaw).cards); });
		}
	);
}
