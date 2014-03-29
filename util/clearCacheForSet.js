"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	cheerio = require("cheerio"),
	request = require("request"),
	url = require("url"),
	hash = require("mhash").hash,
	fileUtil = require("xutil").file,
	path = require("path"),
	tiptoe = require("tiptoe");

if(process.argv.length<4)
{
	base.error("Usage: node %s <oracle|original|languages|printings|legalities> <set codes>", process.argv[1]);
	process.exit(1);
}

var VALID_TYPES = ["oracle", "original", "languages", "printings", "legalities"];

var cacheType = process.argv[2];
if(!VALID_TYPES.contains(cacheType))
{
	base.error("Invalid cacheType: %s", cacheType);
	process.exit(1);
}

var setsToDo = process.argv.slice(3);
if(setsToDo.length===1 && setsToDo[0].toLowerCase()==="allsets")
{
	setsToDo = C.SETS.map(function(SET) { return SET.code; });
}

setsToDo.serialForEach(clearCacheForSet, function(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function clearCacheForSet(code, cb)
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
					self.data.urls.push(buildMultiverseURL(card.multiverseid));
					if(card.layout==="split")
					{
						self.data.urls.push(buildMultiverseURL(card.multiverseid, card.names[0]));
						self.data.urls.push(buildMultiverseURL(card.multiverseid, card.names[1]));
					}
				}
				else if(cacheType==="languages")
				{
					self.data.urls.push(buildMultiverseLanguagesURL(card.multiverseid));
				}
				else if(cacheType==="printings")
				{
					buildMultiverseAllPrintingsURL(card.multiverseid, self.parallel());
				}
				else if(cacheType==="legalities")
				{
					self.data.urls.push(buildMultiverseLegalitiesURL(card.multiverseid));
				}
			});

			if(cacheType!=="printings")
				this();
		},
		function clearCacheFiles()
		{
			if(cacheType==="printings")
				this.data.urls = this.data.urls.concat(Array.prototype.slice.apply(arguments).flatten().uniqueBySort());

			this.data.urls.serialForEach(clearCacheFile, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}


function clearCacheFile(targetUrl, cb)
{
	var urlHash = hash("whirlpool", targetUrl);
	var cachePath = path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);
	if(!fs.existsSync(cachePath))
		return setImmediate(cb);

	base.info("Clearing: %s for %s", urlHash, targetUrl);

	fs.unlink(cachePath, cb);
}

function buildMultiverseURL(multiverseid, part)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Details.aspx",
		query    :
		{
			multiverseid : multiverseid,
			printed      : "false"
		}
	};
	if(part)
		urlConfig.query.part = part;

	return url.format(urlConfig);
}

function buildMultiverseLegalitiesURL(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : "0" }
	};

	return url.format(urlConfig);
}

function buildMultiverseLanguagesURL(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Languages.aspx",
		query    : { multiverseid : multiverseid }
	};

	return url.format(urlConfig);
}

function buildMultiverseAllPrintingsURL(multiverseid, cb)
{
	tiptoe(
		function getFirstPage()
		{
			request(buildMultiversePrintingsURL(multiverseid, 0), this);
		},
		function getAllPages(err, response, pageHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];
			var doc = cheerio.load(pageHTML);
			var pageLinks = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_PrintingsList_pagingControlsContainer a").map(function(i, item) { return doc(item); });
			var numPages = pageLinks.length>0 ? pageLinks.length : 1;
			for(var i=0;i<numPages;i++)
			{
				urls.push(buildMultiversePrintingsURL(multiverseid, i));
			}

			return setImmediate(function() { cb(undefined, urls); });
		}
	);
}

function buildMultiversePrintingsURL(multiverseid, page)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : ("" + (page || 0)) }
	};

	return url.format(urlConfig);
}
