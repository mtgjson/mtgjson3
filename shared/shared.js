"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	hash = require("mhash"),
	path = require("path"),
	moment = require("moment"),
	domino = require("domino"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe"),
	httpUtil = require("xutil").http,
	fs = require("fs"),
	urlUtil = require("xutil").url,
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
		else if(setCorrection==="sortCards")
		{
			cards = cards.sort(exports.cardComparator);
		}
		else
		{
			var cardsToRemove = [];
			var cardsToIncrementNumber = [];
			cards.forEach(function(card)
			{
				if(setCorrection.match && (setCorrection.match==="*" || (Object.every(setCorrection.match, function(key, value) { return Array.isArray(value) ? value.contains(card[key]) : value===card[key]; }))))
				{
					if(setCorrection.replace)
						Object.forEach(setCorrection.replace, function(key, value)
							{ 
								if(Object.isObject(value))
									Object.forEach(value, function(findText, replaceWith) { card[key] = card[key].replaceAll(findText, replaceWith); });
								else
									card[key] = value; 
							});
					
					if(setCorrection.remove)
						setCorrection.remove.forEach(function(removeKey) { delete card[removeKey]; });

					if(setCorrection.flavorAddExclamation)
						card.flavor = card.flavor.replace(/([A-Za-z])"/, "$1!\"", "gm");

					if(setCorrection.addPrinting)
						card.printings = sortPrintings(card.printings.concat(Array.toArray(setCorrection.addPrinting)));

					if(setCorrection.setLegality)
						Object.forEach(setCorrection.setLegality, function(legalityType, legalityValue) { card.legalities[legalityType] = legalityValue; });

					if(setCorrection.flavorAddDash && card.flavor)
					{
						card.flavor = card.flavor.replace(/([.!?,'])(["][/]?[\n]?)(\s*)([A-Za-z])/, "$1$2$3 —$4", "gm");
						while(card.flavor.contains("  —"))
						{
							card.flavor = card.flavor.replace("  —", " —");
						}
					}

					if(setCorrection.fixFlavorNewlines && card.flavor)
					{
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

					if(setCorrection.incrementNumber)
					{
						if(cardsToIncrementNumber.contains(card.name))
							card.number = "" + ((+card.number) + cardsToIncrementNumber.count(card.name));

						cardsToIncrementNumber.push(card.name);
					}

					if(setCorrection.prefixNumber)
						card.number = setCorrection.prefixNumber + card.number;
				}

				if(cardsToRemove.length>0)
					cards.removeAll(cardsToRemove);
			});

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

	// Printings corrections
	cards.forEach(function(card)
	{
		if(card.printings)
			card.printings.remove("Promo set for Gatherer");
	});

	// No text for basic lands and rarity of Basic Land
	cards.forEach(function(card)
	{
		if(card.supertypes && card.supertypes.contains("Basic") && card.types && card.types.contains("Land"))
		{
			delete card.text;
			card.rarity = "Basic Land";
		}
	});

	// Empty fields
	cards.forEach(function(card)
	{
		if(card.hasOwnProperty("legalities") && Object.keys(card.legalities).length===0)
			delete card.legalities;
	});

	// Flavor text changes
	cards.forEach(function(card)
	{
		if(!card.flavor)
			return;

		card.flavor = card.flavor.replaceAll("“", "\"");
		card.flavor = card.flavor.replaceAll("”", "\"");
		card.flavor = card.flavor.replaceAll("＂", "\"");

		while(card.flavor.contains(" \n"))
		{
			card.flavor = card.flavor.replaceAll(" \n", "\n");
		}
	});

	// Legality corrections
	cards.forEach(function(card)
	{
		if(card.layout==="token" || card.border==="silver" || (fullSet.border==="silver" && !card.hasOwnProperty("border")))
			return;

		if(!card.hasOwnProperty("legalities"))
			card["legalities"] = {};

		//if(!card.legalities.hasOwnProperty("Vintage") && moment(fullSet.releaseDate, "YYYY-MM-DD").unix()<=moment().unix())
		//if(!card.legalities.hasOwnProperty("Vintage"))
		//	card.legalities["Vintage"] = C.VINTAGE_BANNED.contains(card.name) ? "Banned" : (C.VINTAGE_RESTRICTED.contains(card.name) ? "Restricted" : "Legal");
	});

	// Rulings corrections
	cards.forEach(function(card)
	{
		if(!card.hasOwnProperty("rulings") || card.rulings.length===0)
			return;

		card.rulings.forEach(function(ruling)
		{
			Object.forEach(C.SYMBOL_MANA, function(manaSymbol)
			{
				var newText = ruling.text.replaceAll("\\{" + manaSymbol.toUpperCase() + "\\]", "{" + manaSymbol.toUpperCase() + "}");
				if(newText===ruling.text)
					ruling.text.replaceAll("\\[" + manaSymbol.toUpperCase() + "\\}", "{" + manaSymbol.toUpperCase() + "}");
				if(newText===ruling.text)
					ruling.text.replaceAll("\\[" + manaSymbol.toUpperCase() + "\\]", "{" + manaSymbol.toUpperCase() + "}");

				if(newText!==ruling.text)
				{
					base.warn("Auto correcting set %s Card [%s] (%s) that has ruling with invalid symbol: %s", fullSet.code, card.name, card.multiverseid || "", ruling.text);
					ruling.text = newText;
				}
			});
		});
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

	// Set renames
	Object.forEach(C.GATHERER_SET_RENAMES, function(oldName, newName)
	{
		if(fullSet.name===oldName)
			fullSet.name = newName;

		cards.forEach(function(card)
		{
			if(card.printings && card.printings.contains(oldName))
				card.printings = card.printings.replaceAll(oldName, newName);
		});
	});

	cards.forEach(function(card)
	{
		if(card.printings)
			card.printings = card.printings.unique();
	});

	// Printing codes
	cards.forEach(function(card)
	{
		if(card.printings)
			card.printingCodes = card.printings.map(function(printing) { return exports.getSetCodeFromName(printing); });
	});
};

exports.generateCacheFilePath = generateCacheFilePath;
function generateCacheFilePath(targetUrl)
{
	var urlHash = hash("whirlpool", targetUrl);
	return  path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);
}

exports.sortPrintings = sortPrintings;
function sortPrintings(printings)
{
	return printings.unique().sort(function(a, b) { return moment(getReleaseDateForSetName(a), "YYYY-MM-DD").unix()-moment(getReleaseDateForSetName(b), "YYYY-MM-DD").unix(); });
}

exports.sortPrintingCodes = sortPrintingCodes;
function sortPrintingCodes(printingCodes)
{
	return printingCodes.unique().sort(function(a, b) { return moment(getReleaseDateForSetCode(a), "YYYY-MM-DD").unix()-moment(getReleaseDateForSetCode(b), "YYYY-MM-DD").unix(); });
}

exports.getSetCodeFromName = getSetCodeFromName;
function getSetCodeFromName(setName)
{
	var setCode = C.SETS.mutateOnce(function(SET) { return SET.name.toLowerCase()===setName.toLowerCase() ? SET.code : undefined; });
	if(!setCode)
	{
		base.error("FAILED TO GET SET CODE FOR NAME: %s", setName);
		process.exit(1);
	}
	return setCode;
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

exports.clearCacheFile = function(targetUrl, cb)
{
	var cachePath = generateCacheFilePath(targetUrl);
	if(!fs.existsSync(cachePath))
		return setImmediate(cb);

	//base.info("Clearing: %s for %s", cachePath, targetUrl);

	fs.unlink(cachePath, cb);
};

exports.buildCacheFileURLs = function(card, cacheType, cb, fromCache)
{
	tiptoe(
		function getCacheURLs()
		{
			if(cacheType==="printings")
				return exports.buildMultiverseAllPrintingsURLs(card.multiverseid, this, fromCache);

			var urls = [];
			if(cacheType==="oracle")
			{
				urls.push(exports.buildMultiverseURL(card.multiverseid));
				if(card.layout==="split")
				{
					urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[0]));
					urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[1]));
				}
			}
			else if(cacheType==="original")
			{
				urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid), "printed", "true"));
				if(card.layout==="split")
				{
					urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid, card.names[0]), "printed", "true"));
					urls.push(urlUtil.setQueryParam(exports.buildMultiverseURL(card.multiverseid, card.names[1]), "printed", "true"));
				}
			}
			else if(cacheType==="languages")
			{
				urls.push(exports.buildMultiverseLanguagesURL(card.multiverseid));
			}
			else if(cacheType==="legalities")
			{
				urls.push(exports.buildMultiverseLegalitiesURL(card.multiverseid));
			}

			this(undefined, urls);
		},
		function returnCacheURLs(err, urls)
		{
			if(err)
				throw err;
			
			if(!urls || !urls.length)
				throw new Error("No URLs for: %s %s", cacheType, card.multiverseid);
			
			if(urls.some(function(url) { return url.length===0; }))
				throw new Error("Invalid urls for: %s %s [%s]", cacheType, card.multiverseid, urls.join(", "));

			return setImmediate(function() { cb(err, urls); });
		}
	);
};

exports.buildMultiverseAllPrintingsURLs = function(multiverseid, cb, fromCache)
{
	tiptoe(
		function getFirstPage()
		{
			var targetURL = exports.buildMultiversePrintingsURL(multiverseid, 0);
			if(fromCache && fs.existsSync(generateCacheFilePath(targetURL)))
				fs.readFile(generateCacheFilePath(targetURL), {encoding:"utf8"}, this);
			else
				httpUtil.get(targetURL, this);
		},
		function getAllPages(err, rawHTML)
		{
			if(err)
			{
				base.error(exports.buildMultiversePrintingsURL(multiverseid, 0));
				base.error(err);
				return setImmediate(function() { cb(err); });
			}

			var urls = [];

			var numPages = exports.getPagingNumPages(domino.createWindow(rawHTML).document, "printings");
			for(var i=0;i<numPages;i++)
			{
				urls.push(exports.buildMultiversePrintingsURL(multiverseid, i));
			}
			return setImmediate(function() { cb(undefined, urls); });
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
