"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	shared = require("shared"),
	path = require("path"),
	tiptoe = require("tiptoe");

if(process.argv.length<4)
{
	base.error("Usage: node %s <all|oracle|original|languages|printings|legalities|mcilist> <set codes>", process.argv[1]);
	process.exit(1);
}

var VALID_TYPES = ["oracle", "original", "languages", "printings", "legalities", "mcilist"];

var cacheTypes = process.argv[2].toLowerCase()==="all" ? VALID_TYPES : Array.toArray(process.argv[2]);
cacheTypes.serialForEach(function(cacheType, cb)
{
	if(!VALID_TYPES.contains(cacheType))
	{
		base.error("Invalid cacheType: %s", cacheType);
		return;
	}

	base.info("Clearing cache type: %s", cacheType);

	shared.getSetsToDo(3).serialForEach(function(code, subcb) { clearCacheForSet(code, cacheType, subcb); }, cb);
}, function(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function clearCacheForSet(code, cacheType, cb)
{
	tiptoe(
		function loadSetJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function getCacheURLS(setRaw)
		{
			var set = JSON.parse(setRaw);
			var self=this;
			base.info("%d cards found.", set.cards.length);

			if(cacheType==="mcilist")
			{
				if(!set.magicCardsInfoCode)
					return this.finish();

				var urls = [];
				urls.push("http://magiccards.info/" + set.magicCardsInfoCode.toLowerCase() + "/en.html");
				var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.code.toLowerCase()===set.code.toLowerCase()) { return SET; } });
				Array.toArray(targetSet.magicRaritiesCodes).forEach(function(magicRaritiesCode)
				{
					urls.push("http://www.magiclibrarities.net/" + magicRaritiesCode + "-english-cards-index.html");
				}.bind(this));
				this(undefined, urls);
			}
			else
			{
				set.cards.serialForEach(function(card, subcb)
				{
					shared.buildCacheFileURLs(card, cacheType, subcb);
				}, this);
			}
		},
		function clearCacheFiles(urls)
		{
			urls.flatten().uniqueBySort().serialForEach(shared.clearCacheFile, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}


