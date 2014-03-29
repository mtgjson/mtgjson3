"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	path = require("path"),
	fs = require("fs"),
	shared = require("shared"),
	tiptoe = require("tiptoe");

var MULTIVERSE_IDS = [3586, 8410, 2751, 5805, 1703, 5803, 4374, 4571, 1973, 3712, 1985, 3716, 2706, 5729, 268, 270, 274, 5274, 4751, 1765, 945, 154, 3143, 166, 6155, 1777, 2981, 2603, 4914, 233, 249, 3507, 6044, 271, 3731, 4777, 153, 2573, 1010, 2909, 3577, 2743, 1077, 5804, 5808, 201, 4055, 4056, 202, 6596, 2624, 3687, 2627, 3451, 4551, 4832, 5100, 4833, 6106, 228, 3472, 3826, 914, 68, 2925, 2462, 1667, 3041, 197, 1951, 8818, 1959, 209, 3180, 1587, 2919, 1849, 86, 87, 37];

var newSet = base.clone(C.SETS.mutateOnce(function(SET) { if(SET.code==="ATH") { return SET; } }));
newSet.cards = [];

C.SETS.map(function(SET) { return SET.code; }).serialForEach(processSet, function(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	newSet.cards = newSet.cards.sort(shared.cardComparator);

	//base.info(newSet.cards.map(function(card) { return card.printings; }).flatten().uniqueBySort().map(function(setName) { return C.SETS.mutateOnce(function(SET) { if(SET.name===setName) { return SET.code; }}); }).join(" "));

	fs.writeFileSync(path.join(__dirname, "..", "json", "ATH.json"), JSON.stringify(newSet), {encoding : "utf8"});

	process.exit(0);
});

function processSet(setCode, cb)
{
	if(setCode==="ATH")
		return setImmediate(cb);

	tiptoe(
		function loadSetJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function getCacheURLS(err, setRaw)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var set = JSON.parse(setRaw);
			set.cards.forEach(function(card)
			{
				if(card.multiverseid && MULTIVERSE_IDS.contains(card.multiverseid))
				{
					var newCard = base.clone(card, true);
					delete newCard.multiverseid;
					delete newCard.variations;
					delete newCard.number;
					delete newCard.border;
					newCard.imageName = newCard.imageName.trim("0123456789 .");

					if(newCard.rarity==="Basic Land")
						newCard.imageName = newCard.imageName + "1";
					else
						newCard.rarity = "Special";

					newSet.cards.push(newCard);
				}
			});

			return setImmediate(cb);
		}
	);
}