"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	hash = require("mhash").hash,
	path = require("path"),
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
				if(setCorrection.match && Object.every(setCorrection.match, function(key, value) { return card[key]===value; }))
				{
					if(setCorrection.replace)
						Object.forEach(setCorrection.replace, function(key, value) { card[key] = value; });
					if(setCorrection.remove)
						setCorrection.remove.forEach(function(removeKey) { delete card[removeKey]; });
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
	});
};

exports.clearCacheFile = function(targetUrl, cb)
{
	var urlHash = hash("whirlpool", targetUrl);
	var cachePath = path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);
	if(!fs.existsSync(cachePath))
		return setImmediate(cb);

	base.info("Clearing: %s for %s", urlHash, targetUrl);

	fs.unlink(cachePath, cb);
};
