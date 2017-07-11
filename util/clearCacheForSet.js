"use strict";
/*global setImmediate: true*/

var base = require('@sembiance/xbase'),
	C = require('../shared/C'),
	fs = require("fs"),
	shared = require('../shared/shared'),
	path = require("path"),
	async = require('async'),
	tiptoe = require("tiptoe");

var VALID_TYPES = [ "oracle", "original", "languages", "printings", "legalities", "mcilist", "listings" ];

// If we're being called as a script, run as script, if not, behave as a module.
if (module.parent === null) {
	if (process.argv.length < 4) {
		base.error("Usage: node %s <cacheType> <set codes>", process.argv[1]);
		base.error("Valid types are:");
		base.error('* all');
		base.error('* oracle');
		base.error('* original');
		base.error('* languages');
		base.error('* printings');
		base.error('* legalities');
		base.error('* mcilist');
		base.error('* listings');
		base.error("You can specify multiple types at once using a single comma (',') between the types (no spaces).");
		process.exit(1);
	}

	var cacheTypes = process.argv[2].toLowerCase() === 'all' ? VALID_TYPES : process.argv[2].toLowerCase().split(',');

	async.eachSeries(
		shared.getSetsToDo(3),
		function(code, cb) {
			clearCacheForSet(code, cacheTypes, cb);
		},
		function(err) {
			if (err) throw(err);
		}
	);
}

/**
 * Calls the callback with a list MCI urls for the given set
 * @param setInfo object with set description
 * @param set object with set contents
 * @param callback function to call upon finish with format function(err, urls)
 */
function getURLSForMcilistCache(setInfo, set, callback) {
	if (!set.isMCISet) {
		if (!set.magicCardsInfoCode) {
			return(setImmediate(callback));
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
				}
			);
		},
		function(err) {
			// FIX Urls
			var ret = [];

			if (err)
				return(setImmediate(callback, err));

			async.eachSeries(
				urls,
				function(url, cb) {
					if (Array.isArray(url)) {
						url.forEach(function(x) { ret.push(x); });
					}
					else
						ret.push(url);

					setImmediate(cb);
				},
				function(err) {
					setImmediate(callback, err, ret);
				}
			);
		}
	);
}

/**
 * Loads a given set and clears all the cached information regarding its cards.
 * @param code string Set three or four letter code.
 * @param cacheTypes array|string with types of cache to be cleared.
 * @param cb function callback to call when done with an optional error parameter.
 */
function clearCacheForSet(code, cacheTypes, cb) {
	var setInfo = C.SETS.mutateOnce(
		function(SET) {
			if (SET.code.toLowerCase() === code.toLowerCase()) {
				return SET;
			}
		}
	);
	var setName = setInfo.name;

	if (typeof(cacheTypes) === 'string') {
		cacheTypes = [ cacheTypes ];
	}

	if (!Array.isArray(cacheTypes)) {
		return(setImmediate(cb, new Error('Invalid cacheTypes format.')));
	}

	cacheTypes = cacheTypes.filter(function(cacheType) {
		if (VALID_TYPES.indexOf(cacheType.toLowerCase()) < 0) {
			base.error('Invalid cacheType: %s', cacheType);
			return(false);
		}
		return(true);
	});

	tiptoe(
		function loadSetJSON() {
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), { encoding : "utf8" }, this);
		},
		function getCacheURLS(setRaw) {
			var set = JSON.parse(setRaw);
			base.info("%s: %d cards found.", set.code, set.cards.length);

			var eachCb = this;
			async.each(
				cacheTypes,
				function(cacheType) {
					base.info("Clearing cache type: %s", cacheType);

					if (cacheType === "mcilist") {
						getURLSForMcilistCache(setInfo, set, eachCb);
					}
					else if (cacheType === "listings") {
						shared.buildMultiverseListingURLs(setName, eachCb);
					}
					else {
						getURLSForCacheType(setInfo, set, cacheType, eachCb);
					}
				},
				this
			);
		},
		function clearCacheFiles() {
			var urls = [].concat(Array.prototype.slice.call(arguments));

			if (!urls)
				return(setImmediate(this, new Error("No urls for clearCacheFiles().")));
			urls = urls.flatten().uniqueBySort().filter(function (url) { return(url !== null && url !== undefined && url !== ''); });

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

module.exports = clearCacheForSet;
