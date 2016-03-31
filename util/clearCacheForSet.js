"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	shared = require("shared"),
	path = require("path"),
	async = require('async'),
	tiptoe = require("tiptoe");

if (process.argv.length < 4) {
	base.error("Usage: node %s <all|oracle|original|languages|printings|legalities|mcilist|listings> <set codes>", process.argv[1]);
	process.exit(1);
}

var VALID_TYPES = ["oracle", "original", "languages", "printings", "legalities", "mcilist", "listings"];

var cacheTypes = process.argv[2].toLowerCase()==="all" ? VALID_TYPES : Array.toArray(process.argv[2]);

async.eachSeries(
	cacheTypes,
	function(cacheType, cb) {
		if (!VALID_TYPES.contains(cacheType)) {
			base.error("Invalid cacheType: %s", cacheType);
			return;
		}

		base.info("Clearing cache type: %s", cacheType);

		async.eachSeries(
			shared.getSetsToDo(3),
			function(code, subcb) {
				clearCacheForSet(code, cacheType, subcb);
			},
			cb
		);
	},
	function(err) {
		if (err) {
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

/**
 * Calls the callback with a list MCI urls for the given set
 * @param setInfo object with set description
 * @param set object with set contents
 * @param callback function to call upon finish with format function(err, urls)
 */
function getURLSForMcilistCache(setInfo, set, callback) {
	if (!set.isMCISet) {
		if (!set.magicCardsInfoCode) {
			return(setImmediate(cb));
		}
	}

	var urls = [];
	var mciListUrl = "http://magiccards.info/" + set.magicCardsInfoCode.toLowerCase() + "/en.html";
	urls.push(mciListUrl);
	if (setInfo.magicRaritiesCodes) {
		setInfo.magicRaritiesCodes.forEach(
			function(magicRaritiesCode) {
				urls.push("http://www.magiclibrarities.net/" + magicRaritiesCode + "-english-cards-index.html");
			}
		);
	}

	// Retrieve all mci info and clear it
	base.info("MCI Set code: %s", set.magicCardsInfoCode);
	tiptoe(
		function getList() {
			base.info('Getting URL Contents for: %s', mciListUrl);
			shared.getURLAsDoc(mciListUrl, this);
		},
		function getURLs(err, listDoc) {
			var mciCardLinks = Array.toArray(listDoc.querySelectorAll("table tr td a"));
			var validLinks = mciCardLinks.filter(function(link) {
				var href = link.getAttribute("href");
				return (href.indexOf(set.magicCardsInfoCode) >= 0);
			});
			validLinks.forEach(function(idx) {
				var href = idx.getAttribute("href");
				urls.push("http://magiccards.info" + href);
			});

			setImmediate(callback, err, urls);
		}
	);
}

/**
 * Calls the callback with a list MCI urls for the given set
 * @param setInfo object with set description
 * @param set object with set contents
 * @param cacheStype string with the type to get the urls from. Valid values are: 
 *                        "oracle", "original", "languages", "printings", "legalities"
 * @param callback function to call upon finish with format function(err, urls)
 */
function getURLSForCacheType(setInfo, set, cacheType, callback) {
	base.info("%s: %d cards found.", set.code, set.cards.length);
	var urls = [];
	async.eachSeries(
		set.cards.filter(
			function(card) {
				return(card.hasOwnProperty("multiverseid"));
			}
		),
		function(card, subcb) {
			shared.buildCacheFileURLs(
				card,
				cacheType,
				function(err, url) {
					urls.push(url);
					subcb();
				},
				true
			);
		},
		function(err) {
			setImmediate(callback, err, urls);
		}
	);
}

function clearCacheForSet(code, cacheType, cb) {
	var setInfo = C.SETS.mutateOnce(
		function(SET) {
			if (SET.code.toLowerCase() === code.toLowerCase()) {
				return SET;
			}
		}
	);
	var setName = setInfo.name;

	tiptoe(
		function loadSetJSON() {
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), { encoding : "utf8" }, this);
		},
		function getCacheURLS(setRaw) {
			var set = JSON.parse(setRaw);
			if (cacheType === "mcilist") {
				getURLSForMcilistCache(setInfo, set, this);
			}
			else if (cacheType === "listings") {
				shared.buildMultiverseListingURLs(setName, this);
			}
			else {
				getURLSForCacheType(setInfo, set, cacheType, this);
			}
		},
		function clearCacheFiles() {
			var urls = [].concat(Array.prototype.slice.call(arguments));

			if (!urls)
				return(setImmediate(this, new Error("No urls for clearCacheFiles().")));
			urls = urls.flatten().uniqueBySort();

			base.info("Clearing %d URLS", urls.length);
			async.eachSeries(
				urls,
				shared.clearCacheFile,
				this
			);
		},
		function finish(err) {
			setImmediate(cb, err);
		}
	);
}


