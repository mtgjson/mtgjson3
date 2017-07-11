"use strict";

var base = require("@sembiance/xbase");
var C = require("./C");
var hash = require("mhash");
var path = require("path");
var moment = require("moment");
var domino = require("domino");
var querystring = require("querystring");
var tiptoe = require("tiptoe");
var fs = require("fs");
var url = require("url");
var urlUtil = require("@sembiance/xutil").url;
var unicodeUtil = require("@sembiance/xutil").unicode;

var request = require('request');
var levelup = require('level');
exports.cache = levelup(path.join(__dirname, '..', 'cache'));

exports.getSetsToDo = function(startAt) {
	startAt = startAt || 2;
	if(process.argv.length<(startAt+1))
	{
		base.error("Usage: node %s <set code|'allsets'>", process.argv[1]);
		process.exit(1);
	}

	var setsNotToDo = [];
	var setsToDo = [];

	process.argv.slice(startAt).forEach(function(arg)
	{
		if(arg==="allsets")
		{
			setsToDo = C.SETS.map(function(SET) { return SET.code; });
		}
		else if(arg==="nongatherersets")
		{
			setsToDo = C.SETS_NOT_ON_GATHERER.slice();
		}
		else if(arg==="mcisets")
		{
			setsToDo = exports.getMCISetCodes();
		}
		else if(arg==="sincelastprintingreset")
		{
			var seenLastPrintingResetSet = false;
			C.SETS.forEach(function(SET)
			{
				if(SET.code===C.LAST_PRINTINGS_RESET)
					seenLastPrintingResetSet = true;
				else if(seenLastPrintingResetSet)
					setsToDo.push(SET.code);
			});
		}
		else if(arg.toLowerCase().startsWith("startat"))
		{
			setsToDo = C.SETS.map(function(SET) { return SET.code; });
			setsToDo = setsToDo.slice(setsToDo.indexOf(arg.substring("startat".length)));
		}
		else if(arg.toLowerCase().startsWith("not"))
		{
			setsNotToDo.push(arg);
			setsNotToDo.push(arg.substring(3));
		}
		else
		{
			setsToDo.push(arg);
		}
	});

	setsToDo.removeAll(setsNotToDo);

	return setsToDo.uniqueBySort();
};

exports.getMCISetCodes = function()
{
	return C.SETS.filter(function(SET) { return SET.isMCISet; }).map(function(SET) { return SET.code; });
};

exports.cardComparator = function(a, b)
{
	var result = unicodeUtil.unicodeToAscii(a.name).toLowerCase().localeCompare(unicodeUtil.unicodeToAscii(b.name).toLowerCase());
	if(result!==0)
		return result;

	if(a.imageName && b.imageName)
		return a.imageName.localeCompare(b.imageName);

	if(a.hasOwnProperty("number"))
		return b.number.localeCompare(a.number);

	return 0;
};

exports.buildMultiverseLanguagesURL = function(multiverseid)
{
	if(!multiverseid)
		throw new Error("Invalid multiverseid");

	var urlConfig =
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Languages.aspx",
		query    : { multiverseid : multiverseid }
	};

	return url.format(urlConfig);
};

exports.buildMultiverseURL = function(multiverseid, part)
{
	if(!multiverseid)
		throw new Error("Invalid multiverseid");

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
};

exports.buildMultiverseLegalitiesURL = function(multiverseid)
{
	if(!multiverseid)
		throw new Error("Invalid multiverseid");

	var urlConfig =
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : "0" }
	};

	return url.format(urlConfig);
};

exports.buildMultiversePrintingsURL = function(multiverseid, page)
{
	if(!multiverseid)
		throw new Error("Invalid multiverseid");

	var urlConfig =
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : ("" + (page || 0)) }
	};

	return url.format(urlConfig);
};

exports.buildListingsURL = function(setName, page)
{
	var urlConfig =
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
			set     : "[" + JSON.stringify(setName.replaceAll("&", "and")) + "]",
			page    : ("" + (page || 0))
		}
	};

	return url.format(urlConfig).replaceAll("%5C", "");
};

exports.getSetCorrections = function(setCode)
{
	var setCorrections = C.SET_CORRECTIONS["*"];
	if(C.SET_CORRECTIONS.hasOwnProperty(setCode))
		setCorrections = setCorrections.concat(C.SET_CORRECTIONS[setCode]);

	return setCorrections;
};

exports.performSetCorrections = function(setCorrections, fullSet)
{
	var cards = fullSet.cards;
    var addBasicLandWatermarks = true;
	setCorrections.forEach(function(setCorrection)
	{
        if(setCorrection==="noBasicLandWatermarks")
        {
            addBasicLandWatermarks = false;
        }
		else if(setCorrection==="numberCards")
		{
			var COLOR_ORDER = ["Blue", "Black", "Red", "Green", "White"];
			var LAND_ORDER = ["Island", "Swamp", "Mountain", "Forest", "Plains"];
			var cardNumber = 1;

			// COLORS, Golds, Artifacts, Non-Basic Lands, Lands

			cards.multiSort([function(card) {
								if(card.hasOwnProperty("colors") && card.colors.length===1)
									return COLOR_ORDER.indexOf(card.colors[0]);
								if(card.hasOwnProperty("colors") && card.colors.length>1)
									return 5;
								if(card.types.contains("Artifact"))
									return 6;
								if(card.types.contains("Land") && !card.hasOwnProperty("supertypes"))
									return 7;
								if(LAND_ORDER.contains(card.name))
									return 8+LAND_ORDER.indexOf(card.name);

								return 99999999;
							 },
							 function(card) { return card.name; },
							 function(card) { return card.multiverseid || 0; }]).forEach(function(card) { card.number = "" + (cardNumber++); });
		}
		else if(setCorrection==="sortCards")
		{
			cards = cards.sort(exports.cardComparator);
		}
		else if(setCorrection==="recalculateStandard") {
			cards.forEach(function(card) { exports.updateStandardForCard(card); });
		}
		else
		{
			var cardsToRemove = [];
			var cardsToIncrementNumber = [];
			cards.forEach(function(card)
			{
				if(setCorrection.match && (setCorrection.match==="*" || (Object.every(setCorrection.match, function(key, value)
					{
						if(Array.isArray(value))
							return value.contains(card[key]);

						if(typeof value==="string" && value.startsWith("<"))
							return (+card[key])<(+(value.substring(1)));

						if(typeof value==="string" && value.startsWith(">"))
							return (+card[key])>(+(value.substring(1)));

						return value===card[key];
					}))))
				{
					if(setCorrection.replace)
					{
						Object.forEach(setCorrection.replace, function(key, value)
							{
								if(Object.isObject(value))
								{
									if(!card.hasOwnProperty(key))
										return;

									Object.forEach(value, function(findText, replaceWith) { card[key] = card[key].replaceAll(findText, replaceWith); });
								}
								else
								{
									card[key] = value;
								}
							});
					}

					if(setCorrection.remove)
						setCorrection.remove.forEach(function(removeKey) { delete card[removeKey]; });

					if(setCorrection.flavorAddExclamation)
						card.flavor = card.flavor.replace(/([A-Za-z])"/, "$1!\"", "gm");

					if(setCorrection.addPrinting) {
						card.printings = card.printings.concat(Array.toArray(setCorrection.addPrinting));
						exports.finalizePrintings(card);
					}

					if(setCorrection.setLegality) {
						Object.forEach(setCorrection.setLegality, function(legalityType, legalityValue)
						{
							var foundExisting = false;
							if(card.hasOwnProperty("legalities"))
							{
								card.legalities.forEach(function(cardLegality)
								{
									if(cardLegality.format===legalityType)
									{
										foundExisting = true;
										cardLegality.legality = legalityValue;
									}
								});
							}
							else
							{
								card.legalities = [];
							}

							if(!foundExisting)
								card.legalities.push({format:legalityType,legality:legalityValue});
						});
					}

					if(setCorrection.deleteLegality && card.hasOwnProperty("legalities"))
						card.legalities = card.legalities.filter(function(cardLegality) { return !setCorrection.deleteLegality.contains(cardLegality.format); });

					if(setCorrection.flavorAddDash && card.flavor)
					{
						card.flavor = card.flavor.replace(/([.!?,'])(["][/]?[\n]?)(\s*)([A-Za-z])/, "$1$2$3 —$4", "gm");
						while(card.flavor.contains("  —"))
						{
							card.flavor = card.flavor.replace("  —", " —");
						}
					}

					if(setCorrection.fixFlavorNewlines && card.flavor) {
						card.flavor = card.flavor.replace(/(\s|")-\s*([^"—-]+)\s*$/, "$1—$2");

						if(card.flavor.contains("—"))
						{
							// Ensure two quotes appear before the last em-dash
							var firstQuoteIdx = card.flavor.indexOf('"');
							var secondQuoteIdx = card.flavor.substring(firstQuoteIdx+1).indexOf('"');
							if(firstQuoteIdx!==-1 && secondQuoteIdx!==-1 && secondQuoteIdx<card.flavor.lastIndexOf("—"))
								card.flavor = card.flavor.replace(/\s*—\s*([^—]+)\s*$/, "\n—$1");
						}
					}

					if(setCorrection.removeCard)
						cardsToRemove.push(card);

					if(setCorrection.incrementNumber) {
						if(cardsToIncrementNumber.contains(card.name))
							card.number = "" + ((+card.number) + cardsToIncrementNumber.count(card.name));

						cardsToIncrementNumber.push(card.name);
					}

					if(setCorrection.prefixNumber)
						card.number = setCorrection.prefixNumber + card.number;

					if (setCorrection.fixForeignNames && card.foreignNames) {
						// Put all fixes in an array
						var fixes = [];
						if (Array.isArray(setCorrection.fixForeignNames))
							fixes = setCorrection.fixForeignNames;
						else
							fixes.push(setCorrection.fixForeignNames);

						// Check each fix
						fixes.forEach(function(fix) {
							card.foreignNames.forEach(function(fn) {
								if (fn.language === fix.language) {
									if (fix.name) fn.name = fix.name;
									if (fix.multiverseid) fn.multiverseid = fix.multiverseid;
								}
							});
						});
					}
				}
			});

			if(cardsToRemove.length>0)
				cards.removeAll(cardsToRemove);

			if(setCorrection.copyCard || setCorrection.importCard || setCorrection.addCard)
			{
				var newCard;
				if(setCorrection.copyCard)
					newCard = base.clone(cards.mutateOnce(function(card) { return card.name===setCorrection.copyCard ? card : undefined; }), true);
				else if(setCorrection.importCard)
					newCard = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "json", setCorrection.importCard.set + ".json"), {encoding:"utf8"})).cards.mutateOnce(function(card) { return card.name===setCorrection.importCard.name ? card : undefined; });
				else if(setCorrection.addCard)
					newCard = base.clone(setCorrection.addCard, true);

				if(setCorrection.replace)
					Object.forEach(setCorrection.replace, function(key, value) { newCard[key] = value; });
				if(setCorrection.remove)
					setCorrection.remove.forEach(function(removeKey) { delete newCard[removeKey]; });

				cards.push(newCard);
			}
		}
	});

	// Artist corrections
	cards.forEach(function(card)
	{
		if(!card.artist)
			return;

		card.artist = card.artist.replaceAll(" and ", " & ");
		Object.forEach(C.ARTIST_CORRECTIONS, function(correctArtist, artistAliases)
		{
			if(artistAliases.contains(card.artist))
				card.artist = correctArtist;
		});

		card.artist = card.artist.replace(/^([^"]*)"([^"]*)"(.*)$/, "$1“$2”$3", "m");
	});

	// No text for basic lands and rarity of Basic Land
	cards.forEach(function(card)
	{
		if(card.supertypes && card.supertypes.contains("Basic") && card.types && card.types.contains("Land"))
		{
            if(card.name!=="Wastes")
                delete card.text;
            if(card.name in ["Plains", "Island", "Swamp", "Mountain", "Forest"] || !(fullSet.code in ["CSP", "OGW"]))
                card.rarity = "Basic Land";
            if(addBasicLandWatermarks)
            {
                if('subtypes' in card && card.subtypes.contains("Plains"))
                    card.watermark = "White";
                else if('subtypes' in card && card.subtypes.contains("Island"))
                    card.watermark = "Blue";
                else if('subtypes' in card && card.subtypes.contains("Swamp"))
                    card.watermark = "Black";
                else if('subtypes' in card && card.subtypes.contains("Mountain"))
                    card.watermark = "Red";
                else if('subtypes' in card && card.subtypes.contains("Forest"))
                    card.watermark = "Green";
                else
                    card.watermark = "Colorless";
            }
		}
	});

	// Empty fields
	cards.forEach(function(card)
	{
		if(card.hasOwnProperty("legalities") && card.legalities.length===0)
			delete card.legalities;
	});

	// Devoid mechanic
	cards.forEach(function(card)
	{
		if(!card.text || !card.text.contains("\n"))
			return;

		card.text.split("\n").forEach(function(textLine)
		{
			if(textLine.toLowerCase().startsWith("devoid"))
				delete card.colors;
		});
	});

	// Homogenize quotes and remove extra newlines and trailing spaces
	function fixText(text) {
		var newText = text;
		newText = newText.replaceAll("“", "\"");
		newText = newText.replaceAll("”", "\"");
		newText = newText.replaceAll("＂", "\"");
		newText = newText.replaceAll("’", "'");
		newText = newText.replaceAll("‘", "'");
		while (newText.contains(" \n")) {
			newText = newText.replaceAll(" \n", "\n");
		}
		while (newText.contains("\n ")) {
			newText = newText.replaceAll("\n ", "\n");
		}
		while (newText.contains("\n\n")) {
			newText = newText.replaceAll("\n\n", "\n");
		}
		return newText;
	}

	// Card / flavor / ruling text changes
	cards.forEach(function(card)
	{
		if(card.text)
			card.text = fixText(card.text);

		if(card.flavor)
			card.flavor = fixText(card.flavor);

		if(card.hasOwnProperty("rulings") && card.rulings.length!==0) {
			card.rulings.forEach(function(ruling) {
				ruling.text = fixText(ruling.text);

				Object.forEach(C.SYMBOL_MANA, function(manaSymbol) {
					var newText = ruling.text.replaceAll("\\{" + manaSymbol.toUpperCase() + "\\]", "{" + manaSymbol.toUpperCase() + "}");
					if(newText===ruling.text)
						ruling.text.replaceAll("\\[" + manaSymbol.toUpperCase() + "\\}", "{" + manaSymbol.toUpperCase() + "}");
					if(newText===ruling.text)
						ruling.text.replaceAll("\\[" + manaSymbol.toUpperCase() + "\\]", "{" + manaSymbol.toUpperCase() + "}");

					if(newText!==ruling.text) {
						base.warn("Auto correcting set %s Card [%s] (%s) that has ruling with invalid symbol: %s", fullSet.code, card.name, card.multiverseid || "", ruling.text);
						ruling.text = newText;
					}
				});
			});
		}
	});

	// Final Release date validation
	cards.forEach(function(card)
	{
		if(!card.releaseDate)
			return;

		if(["YYYY-MM-DD", "YYYY-MM", "YYYY"].some(function(dateFormat) { return !moment(card.releaseDate, dateFormat).isValid(); }))
		{
			base.warn("Set [%s] and card [%s] release date format invalid: %s", fullSet.code, card.name, card.releaseDate);
			delete card.releaseDate;
		}
	});

	// Sort legalities and foreign names
	cards.forEach(function(card)
	{
		if(card.hasOwnProperty("legalities"))
			card.legalities = card.legalities.sort(function(a, b) { var al = a.format.toLowerCase().charAt(0); var bl = b.format.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });
		if(card.hasOwnProperty("foreignNames"))
			card.foreignNames = card.foreignNames.sort(function(a, b) { var al = a.language.toLowerCase().charAt(0); var bl = b.language.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });
	});

	// Finalize printings
	cards.forEach(exports.finalizePrintings);

	// Generate ID
	cards.forEach(function(card)
	{
		card.id = hash("sha1", (fullSet.code + card.name + card.imageName));
	});
};

exports.finalizePrintings = finalizePrintings;
function finalizePrintings(card)
{
	if(!card.printings)
		return;

	card.printings = card.printings.unique().multiSort([function(item) { return moment(getReleaseDateForSetCode(item), "YYYY-MM-DD").unix(); },
														function(item) { return item; }]);
}

exports.getSetCodeFromName = getSetCodeFromName;
function getSetCodeFromName(setName) {
	var setInfo = C.SETS.find(function(SET) {
		if (SET.name.toLowerCase() === setName.toLowerCase())
			return(true);
		if (SET.alternativeNames) {
			var i;
			for (i = 0; i < SET.alternativeNames.length; i++)
				if (SET.alternativeNames[i].toLowerCase() === setName.toLowerCase())
					return(true);
		}
		return(false);
	});

	if (!setInfo) {
		console.trace();
		base.error("Failed to get set code for '%s'; please add the set to shared/C.js", setName);
		process.exit(1);
	}
	return(setInfo.code);
}

exports.getReleaseDateForSetName = getReleaseDateForSetName;
function getReleaseDateForSetName(setName)
{
	return C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET.releaseDate : undefined; }) || moment().format("YYYY-MM-DD");
}

exports.getReleaseDateForSetCode = getReleaseDateForSetCode;
function getReleaseDateForSetCode(setCode)
{
	return C.SETS.mutateOnce(function(SET) { return SET.code===setCode ? SET.releaseDate : undefined; }) || moment().format("YYYY-MM-DD");
}

exports.clearCacheFile = function(targetUrl, cb) {
    base.info('Clearing from cache: %s', targetUrl);
	exports.cache.del(targetUrl, {}, cb);
};

exports.buildCacheFileURLs = function(card, cacheType, cb) {
	if (cacheType==="printings")
		return exports.buildMultiverseAllPrintingsURLs(card.multiverseid, cb);

	var urls = [];
	if (cacheType==="oracle") {
		urls.push(exports.buildMultiverseURL(card.multiverseid));
		if(card.layout==="split") {
			urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[0]));
			urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[1]));
		}
	}
	else if (cacheType==="original") {
		urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid), "printed", "true"));
		if (card.layout==="split") {
			urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid, card.names[0]), "printed", "true"));
			urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid, card.names[1]), "printed", "true"));
		}
	}
	else if (cacheType==="languages") {
		urls.push(exports.buildMultiverseLanguagesURL(card.multiverseid));
	}
	else if (cacheType==="legalities") {
		urls.push(exports.buildMultiverseLegalitiesURL(card.multiverseid));
	}

	if(!urls || !urls.length)
		throw new Error("No URLs for: %s %s", cacheType, card.multiverseid);

	if(urls.some(function(url) { return url.length === 0; }))
		throw new Error("Invalid urls for: %s %s [%s]", cacheType, card.multiverseid, urls.join(", "));

	return(setImmediate(cb, null, urls));
};

exports.buildMultiverseListingURLs = function(setName, cb) {
	base.info("building multiverse listing url for " + setName);
	tiptoe(
		function getFirstListingsPage() {
			exports.getURLAsDoc(exports.buildListingsURL(setName, 0), this);
		},
		function getOtherListingsPages(err, firstPageListDoc) {
			var numPages = exports.getPagingNumPages(firstPageListDoc, "listings");
			var urls = [];

			for(var i = 0; i < numPages; i++)
				urls.push(exports.buildListingsURL(setName, i));

			return(setImmediate(cb, err, urls));
		}
	);
};

exports.getURLAsDoc = function(targetURL, getCb) {
    var downloadHTML = function(dlCb) {
        var options = {
            url: targetURL,
            headers: { 'User-Agent': 'mtgjson.com/1.0' }
        };
        base.info('Requesting from web: %s', targetURL);
    	request(options, function(err, response, body) {
    		if (err) {
                base.error('Error downloading: ' + targetURL);
                base.error(err);
                return dlCb(err);
            }
    		if (response && response.statusCode !== 200) {
                base.error('Server responded with statusCode: '+ response.statusCode);
                return dlCb(response.statusCode);
            }
    		if (!body || body.length === 0) {
    			base.error('No page contents');
                return dlCb('No page contents');
            }
    		return dlCb(null, body);
    	});
    };

    exports.cache.get(targetURL, function(err, doc) {
        if (err) {
            if (err.notFound) {
                downloadHTML(function(err, body) {
                    if (err) return getCb(err);
                    exports.cache.put(targetURL, body);
                    return getCb(null, domino.createWindow(body).document);
                });
            } else {
                return getCb(err);
            }
        } else {
            base.info('Found in cache: %s', targetURL);
            return getCb(null, domino.createWindow(doc).document);
        }
    });
};

exports.buildMultiverseAllPrintingsURLs = function(multiverseid, cb) {
	tiptoe(
		function getFirstPage() {
			var targetURL = exports.buildMultiversePrintingsURL(multiverseid, 0);
            exports.getURLAsDoc(targetURL, this);
		},
		function getAllPages(err, doc) {
			if(err) {
				base.error(exports.buildMultiversePrintingsURL(multiverseid, 0));
				base.error(err);
				return setImmediate(function() { cb(err); });
			}

			var urls = [];

			var numPages = exports.getPagingNumPages(doc, "printings");
			for(var i = 0; i < numPages; i++) {
				urls.push(exports.buildMultiversePrintingsURL(multiverseid, i));
			}
			return setImmediate(cb, undefined, urls);
		}
	);
};

exports.getPagingNumPages = function(doc, type)
{
	var pageControlsContainer = (type==="printings" ? "SubContent_PrintingsList_pagingControlsContainer" : "bottomPagingControlsContainer");
	var pageLinks = Array.toArray(doc.querySelectorAll("#ctl00_ctl00_ctl00_MainContent_SubContent_" + pageControlsContainer + " a"));

	var numPages = 1;
	if(pageLinks.length>0)
	{
		if(type==="printings")
		{
			var lastPageHREF = pageLinks.last().getAttribute("href");
			numPages += +querystring.parse(lastPageHREF.substring(lastPageHREF.indexOf("?")+1)).page;
		}
		else
		{
			var highestPageNum = 0;
			pageLinks.forEach(function(pageLink)
			{
				var pageHREF = pageLink.getAttribute("href");
				highestPageNum = Math.max(+querystring.parse(pageHREF.substring(pageHREF.indexOf("?")+1)).page, highestPageNum);
			});
			numPages = highestPageNum+1;
		}
	}

	return numPages;
};

exports.updateStandardForCard = function(card) {
	if (!card.printings)
		return; // Can't check if it's standard if we don't have printings.

	// Update standard legalities
	if (card.legalities)
		card.legalities = card.legalities.filter(function(cardLegality) { return(cardLegality.format != "Standard"); });

	var standard = false;
	card.printings.forEach(function(value) {
		if (!standard && C.STANDARD_SETS.indexOf(value) >= 0) {
			standard = true;
			//base.info("Card %s is in standard set (%s).", card.name, value);
		}
	});
	if (standard === true) {
		var legalityObject = {format:"Standard", legality: "Legal"};
		if (card.legalities === undefined)
			card.legalities = [];

		card.legalities.push(legalityObject);
	}
};

/**
 * saveSet() prepares and saves a given set to a file.
 * 1.    Each card is sorted by the following criteria:
 * 1.1   If they both have a number, they are compared and sorted accordingly.
 * 1.1.1 If the number exists and is the same, compare multiverseIDs
 * 1.2   If there are no numbers, compare the names.
 * 2.    The foreignNames array is sorted by the language name
 * 3.    The legalities are sorted by format name
 * 4.    Each key value of the card is sorted.
 *
 * 99. Finally, the file is saved to the <ROOT>/json/<SETNAME>.json file.
 */
exports.saveSet = function(set, callback) {
	// 1. Sort cards
	set.cards.sort(function(a, b) {
		var ret = 0;
		if (a.number && b.number) {
			ret = exports.alphanum(a.number, b.number);
			if (ret === 0)
				ret = (a.multiverseid > b.multiverseid)?1:-1;
		}

		if (ret === 0)
			ret = a.name.localeCompare(b.name);

		if (ret === 0)
			ret = (a.multiverseid > b.multiverseid)?1:-1;

		return(ret);
	});

	// Sort internal card stuff
	set.cards.forEach(function(card) {
		// 2. Foreign Names
		if (card.foreignNames)
			card.foreignNames.sort(function(a, b){
			    var ret = a.language.localeCompare(b.language);
			    if (ret === 0 && a.multiverseid != b.multiverseid) {
				ret = (a.multiverseid > b.multiverseid)?1:-1;
			    }
			    return(ret);
			});

		// 3. Legalities
		if (card.legalities)
			card.legalities.sort(function(a, b){
				return(a.format.localeCompare(b.format));
			});

		// 4. Sort card properties
		Object.keys(card).sort().forEach(function(key) {
			var value = card[key];
			delete card[key];
			card[key] = value;
		});
	});

	var fn = set.code;
	if (set.language)
		fn += '.' + set.language;
	fn += '.json';

	// 99. Save the file on the proper path
	fs.writeFile(path.join(__dirname, "..", "json", fn), JSON.stringify(set, null, '  '), {encoding:"utf8"}, callback);
};

// Natural sort implementation, for getting those card numbers in a human-readable format.
// Thanks to Brian Huisman at http://web.archive.org/web/20130826203933/http://my.opera.com/GreyWyvern/blog/show.dml/1671288 and http://www.davekoelle.com/alphanum.html
exports.alphanum = function(a, b) {
  function chunkify(t) {
    var tz = [];
    var x = 0, y = -1, n = 0, i, j;

      while ((i = (j = t.charAt(x++)).charCodeAt(0))) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);
  var x = 0;

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
};

/**
 * Execute a function on a given set and saves the returned data (if any)
 * @param setCode String with the name of the set we want to update
 * @param processFunction function to modify the set data. If data is returned, this data considered the new set data.
 * @param callback Function with the callback to pass the error or pass no parameter
 */
exports.processSet = function(setCode, processFunction, callback) {
	tiptoe(
		function getJSON() {
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function updateData(rawSet) {
			var set = JSON.parse(rawSet);

			var newSet = processFunction(set);

			if (newSet)
				exports.saveSet(newSet, this);	// Save set if the function returned anything
			else
				this();
		},
		function finish(err) {
			if (err)
				throw(err);

			if (callback)
				callback();
		}
	);
};
