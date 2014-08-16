"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	hash = require("mhash").hash,
	path = require("path"),
	querystring = require("querystring"),
	fs = require("fs"),
	url = require("url"),
	unicodeUtil = require("xutil").unicode;

exports.getSetsToDo = function(startAt)
{
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
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : ("" + (page || 0)) }
	};

	return url.format(urlConfig);
};

exports.getSetCorrections = function(setCode)
{
	var setCorrections = C.SET_CORRECTIONS["*"];
	if(C.SET_CORRECTIONS.hasOwnProperty(setCode))
		setCorrections = setCorrections.concat(C.SET_CORRECTIONS[setCode]);

	return setCorrections;
};

exports.performSetCorrections = function(setCorrections, cards)
{
	setCorrections.forEach(function(setCorrection)
	{
		if(setCorrection==="numberCards")
		{
			var COLOR_ORDER = ["Blue", "Black", "Red", "Green", "White"];
			var LAND_ORDER = ["Island", "Swamp", "Mountain", "Forest", "Plains"];
			var cardNumber = 1;
			cards.multiSort([function(card) { return (card.hasOwnProperty("colors") ? COLOR_ORDER.indexOf(card.colors[0]) : 999); },
									function(card) { return (card.types.contains("Artifact") ? -1 : 1); },
									function(card) { return card.name; }]).forEach(function(card) { card.number = "" + (cardNumber++); });
		}
		else
		{
			cards.forEach(function(card)
			{
				if(setCorrection.match && (setCorrection.match==="*" || (Object.every(setCorrection.match, function(key, value) { return Array.isArray(value) ? value.contains(card[key]) : value===card[key]; }))))
				{
					if(setCorrection.replace)
						Object.forEach(setCorrection.replace, function(key, value) { card[key] = value; });
					
					if(setCorrection.remove)
						setCorrection.remove.forEach(function(removeKey) { delete card[removeKey]; });

					if(setCorrection.flavorAddExclamation)
						card.flavor = card.flavor.replace(/([A-Za-z])"/, "$1!\"", "gm");

					if((setCorrection.flavorAddDash || setCorrection.flavorAddDashWithNewline) && card.flavor)
					{
						card.flavor = card.flavor.replace(/([.!?,'])(["][/]?[\n]?)(\s*)([A-Za-z])/, (setCorrection.flavorAddDashWithNewline ? "$1$2$3\n—$4" : "$1$2$3 —$4"), "gm");
						while(card.flavor.contains("  —"))
						{
							card.flavor = card.flavor.replace("  —", " —");
						}
					}
				}
			});

			if(setCorrection.copyCard)
			{
				var newCard = base.clone(cards.mutateOnce(function(card) { return card.name===setCorrection.copyCard ? card : undefined; }), true);
				if(setCorrection.replace)
					Object.forEach(setCorrection.replace, function(key, value) { newCard[key] = value; });

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

	// Printings corrections
	cards.forEach(function(card)
	{
		if(card.printings)
			card.printings.remove("Promo set for Gatherer");
	});

	// No text for basic lands
	cards.forEach(function(card)
	{
		if(card.type && card.type.startsWith("Basic Land"))
			delete card.text;
	});
};

exports.generateCacheFilePath = generateCacheFilePath;
function generateCacheFilePath(targetUrl)
{
	var urlHash = hash("whirlpool", targetUrl);
	return  path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);
}

exports.clearCacheFile = function(targetUrl, cb)
{
	var cachePath = generateCacheFilePath(targetUrl);
	if(!fs.existsSync(cachePath))
		return setImmediate(cb);

	base.info("Clearing: %s for %s", cachePath, targetUrl);

	fs.unlink(cachePath, cb);
};


exports.getPrintingsDocNumPages = function(doc)
{
	var pageLinks = Array.toArray(doc.querySelectorAll("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_PrintingsList_pagingControlsContainer a"));

	var numPages = 1;
	if(pageLinks.length>0)
	{
		var lastPageHREF = pageLinks.last().getAttribute("href");
		numPages += +querystring.parse(lastPageHREF.substring(lastPageHREF.indexOf("?")+1)).page;
	}

	return numPages;
};
