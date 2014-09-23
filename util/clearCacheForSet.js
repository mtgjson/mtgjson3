"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	domino = require("domino"),
	request = require("request"),
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
			this.data.urls = [];
			var set = JSON.parse(setRaw);
			var self=this;
			base.info("%d cards found.", set.cards.length);
			set.cards.forEach(function(card)
			{
				if(cacheType==="oracle")
				{
					self.data.urls.push(shared.buildMultiverseURL(card.multiverseid));
					if(card.layout==="split")
					{
						self.data.urls.push(shared.buildMultiverseURL(card.multiverseid, card.names[0]));
						self.data.urls.push(shared.buildMultiverseURL(card.multiverseid, card.names[1]));
					}
				}
				else if(cacheType==="languages")
				{
					self.data.urls.push(shared.buildMultiverseLanguagesURL(card.multiverseid));
				}
				else if(cacheType==="printings")
				{
					buildMultiverseAllPrintingsURL(card.multiverseid, self.parallel());
				}
				else if(cacheType==="legalities")
				{
					self.data.urls.push(shared.buildMultiverseLegalitiesURL(card.multiverseid));
				}
			});

			if(cacheType==="mcilist")
			{
				this.data.urls.push("http://magiccards.info/" + set.magicCardsInfoCode.toLowerCase() + "/en.html");
				var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.code.toLowerCase()===set.code.toLowerCase()) { return SET; } });
				Array.toArray(targetSet.magicRaritiesCodes).forEach(function(magicRaritiesCode)
				{
					this.data.urls.push("http://www.magiclibrarities.net/" + magicRaritiesCode + "-english-cards-index.html");
				}.bind(this));				
			}

			if(cacheType!=="printings")
				this();
		},
		function clearCacheFiles()
		{
			if(cacheType==="printings")
				this.data.urls = this.data.urls.concat(Array.prototype.slice.apply(arguments).flatten().uniqueBySort());

			this.data.urls.serialForEach(shared.clearCacheFile, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function buildMultiverseAllPrintingsURL(multiverseid, cb)
{
	tiptoe(
		function getFirstPage()
		{
			request(shared.buildMultiversePrintingsURL(multiverseid, 0), this);
		},
		function getAllPages(err, response, rawHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];

			var numPages = shared.getPrintingsDocNumPages(domino.createWindow(rawHTML).document);
			for(var i=0;i<numPages;i++)
			{
				urls.push(shared.buildMultiversePrintingsURL(multiverseid, i));
			}

			return setImmediate(function() { cb(undefined, urls); });
		}
	);
}
