"use strict";
/*global setImmediate: true*/

var C = require('../shared/C'),
	fs = require("fs"),
	shared = require('../shared/shared'),
	path = require("path"),
	async = require('async'),
	tiptoe = require("tiptoe"),
	winston = require("winston");

var VALID_TYPES = [ "oracle", "original", "languages", "printings", "legalities", "mcilist", "listings" ];

// If we're being called as a script, run as script, if not, behave as a module.
if (module.parent === null) {
	if (process.argv.length < 4) {
		winston.error("Usage: node %s <cacheType> <set codes>", process.argv[1]);
		winston.error("Valid types are:");
		winston.error('* all');
		winston.error('* oracle');
		winston.error('* original');
		winston.error('* languages');
		winston.error('* printings');
		winston.error('* legalities');
		winston.error('* mcilist');
		winston.error('* listings');
		winston.error("You can specify multiple types at once using a single comma (',') between the types (no spaces).");
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
	winston.info("MCI Set code: %s", set.magicCardsInfoCode);
	tiptoe(
		function getList() {
			winston.info('Getting URL Contents for: %s', mciListUrl);
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
    if (cacheType === 'mcilist')
        return getURLSForMcilistCache(setInfo, set, callback);
    if (cacheType === 'listings')
        return shared.buildMultiverseListingURLs(setInfo.name, callback);

    var urls = [];
    var cards = set.cards.filter(function(card) {
        return card.hasOwnProperty('multiverseid');
    });

    function cardURL(card, cardCb) {
        shared.buildCacheFileURLs(card, cacheType, function(err, url) {
            if (err) return cardCb(err);
            urls.push(url);
            cardCb();
        });
    }

    function done(err) {
        if (err) return callback(err);
        var ret = [];
        async.each(
            urls,
            function(url, cb) {
                if (Array.isArray(url))
                    url.forEach(function(x) { ret.push(x); });
                else
                    ret.push(url);
                cb();
            },
            function(err) {
                callback(err, ret);
            }
        );
    }

    async.each(cards, cardURL, done);
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

	if (typeof(cacheTypes) === 'string') {
		cacheTypes = [ cacheTypes ];
	}

	if (!Array.isArray(cacheTypes)) {
		return(setImmediate(cb, new Error('Invalid cacheTypes format.')));
	}

	cacheTypes = cacheTypes.filter(function(cacheType) {
		if (VALID_TYPES.indexOf(cacheType.toLowerCase()) < 0) {
			winston.error('Invalid cacheType: %s', cacheType);
			return(false);
		}
		return(true);
	});

    function clearCb(err, cacheType, urls, cb) {
        winston.info('Clearing cache type: %s', cacheType);
        if (!err && !urls) err = new Error('No urls for clearCacheFiles().');
        if (err) return cb(err);

        urls = urls.flatten().uniqueBySort().filter(function (url) { return(url !== null && url !== undefined && url !== ''); });
        winston.info("Clearing %d URLs", urls.length);
        async.each(urls, shared.clearCacheFile, cb);
    }

    function rawSetCb(err, setRaw) {
        if (err) return cb(err);
        var set = JSON.parse(setRaw);
        winston.info('%s: %d cards found.', set.code, set.cards.length);
        async.eachSeries(
            cacheTypes,
            function(cacheType, cb) {
                function getUrlCb(err, urls) {
                    clearCb(err, cacheType, urls, cb);
                }
                getURLSForCacheType(setInfo, set, cacheType, getUrlCb);
            },
            cb
        );
    }

    fs.readFile(path.join(__dirname, '..', 'json', code + '.json'), { encoding :'utf8'}, rawSetCb);
}

module.exports = clearCacheForSet;
