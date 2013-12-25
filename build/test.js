"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	hash = require("mhash").hash,
	unicodeUtil = require("xutil").unicode,
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

var GATHERER_NAME_CHANGES =
{
	"Commander" : "Magic: The Gathering-Commander"
};

C.SETS.serialForEach(function(SET, subcb)
{
	tiptoe(
		function getHTMLS()
		{
			var listURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Search/Default.aspx",
				query    :
				{
					output  : "checklist",
					sort    : "cn+",
					action  : "advanced",
					set     : "[" + JSON.stringify((GATHERER_NAME_CHANGES[SET.name] || SET.name).replaceAll("&", "and")) + "]"
				}
			});
			getURLAsDoc(listURL.replaceAll("%5C", ""), this.parallel());

			var listSpecialURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Search/Default.aspx",
				query    :
				{
					output  : "checklist",
					sort    : "cn+",
					action  : "advanced",
					special : "true",
					set     : "[" + JSON.stringify((GATHERER_NAME_CHANGES[SET.name] || SET.name).replaceAll("&", "and")) + "]"
				}
			});
			getURLAsDoc(listSpecialURL.replaceAll("%5C", ""), this.parallel());
		},
		function processFirstBatch(listDoc, listWithSpecialDoc)
		{
			var before = +listDoc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_searchTermDisplay").text().trim().replace(/[^(]+\(([^)]+)\).*/g, "$1");
			var after = +listWithSpecialDoc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_searchTermDisplay").text().trim().replace(/[^(]+\(([^)]+)\).*/g, "$1");
			if(before!==after)
				base.info("%s %d %s",before, after, SET.name);

			this();
		},
		function finish(err)
		{
			setImmediate(function() { subcb(err); });
		}
	);
}, function(err)
{
	if(err)
	{
		base.error(err);
		process.exit(-1);
	}
	
	process.exit(0);
});

function getURLAsDoc(url, cb)
{
	var urlHash = hash("whirlpool", url);
	var cachePath = path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);

	tiptoe(
		function get()
		{
			if(fs.existsSync(cachePath))
			{
				//base.info("URL [%s] is file: %s", url, cachePath);
				fs.readFile(cachePath, {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			}
			else
			{
				base.info("Requesting from web: %s", url);
				request(url, this);
			}
		},
		function createDoc(err, response, pageHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			if(!fs.existsSync(cachePath))
				fs.writeFileSync(cachePath, pageHTML, {encoding:"utf8"});

			setImmediate(function() { cb(null, cheerio.load(pageHTML)); }.bind(this));
		}
	);
}