"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	url = require("url"),
	hash = require("mhash").hash,
	fileUtil = require("xutil").file,
	path = require("path"),
	tiptoe = require("tiptoe");

if(process.argv.length<4)
{
	base.error("Usage: node %s <oracle|original|languages> <set codes>", process.argv[1]);
	process.exit(1);
}

var cacheType = process.argv[2];
if(cacheType!=="oracle" && cacheType!=="original" && cacheType!=="languages")
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
		function clearCacheFiles(setRaw)
		{
			var urls = [];
			var set = JSON.parse(setRaw);
			set.cards.forEach(function(card)
			{
				if(cacheType==="oracle")
				{
					urls.push(buildMultiverseURL(card.multiverseid));
					if(card.layout==="split")
					{
						urls.push(buildMultiverseURL(card.multiverseid, card.names[0]));
						urls.push(buildMultiverseURL(card.multiverseid, card.names[1]));
					}
				}
				else if(cacheType==="languages")
				{
					urls.push(buildMultiverseLanguagesURL(card.multiverseid));
				}
				//urlUtil.setQueryParam(buildMultiverseURL(multiverseid), "printed", "true")
			});

			urls.serialForEach(clearCacheFile, this);
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