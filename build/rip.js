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
	shared = require("shared"),
	urlUtil = require("xutil").url,
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

function ripSet(setName, cb)
{
	base.info("====================================================================================================================");
	base.info("Ripping Set: %s", setName);

	tiptoe(
		function getListHTML()
		{
			base.info("Getting card list...");

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
					special : "true",
					set     : "[" + JSON.stringify(setName.replaceAll("&", "and")) + "]"
				}
			});

			listURL = listURL.replaceAll("%5C", "");

			getURLAsDoc(listURL, this);
		},
		function processFirstBatch(listDoc)
		{
			base.info("Processing first batch...");

			this.data.set = base.clone(C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET : undefined; }));

			processMultiverseids(listDoc("table.checklist tr.cardItem a.nameLink").map(function(i, itemRaw) { return +querystring.parse(url.parse(listDoc(itemRaw).attr("href")).query).multiverseid; }).unique(), this);
		},
		function processVariations(cards)
		{
			base.info("Processing variations...");

			this.data.set.cards = cards;
			processMultiverseids(cards.map(function(card) { return (card.variations && card.variations.length) ? card.variations : []; }).flatten().unique().subtract(cards.map(function(card) { return card.multiverseid; })), this);
		},
		function addAdditionalFields(cards)
		{
			base.info("Adding additional fields...");

			this.data.set.cards = this.data.set.cards.concat(cards).sort(shared.cardComparator);

			// Image Name
			var cardNameCounts = {};
			this.data.set.cards.forEach(function(card)
			{
				if(!cardNameCounts.hasOwnProperty(card.name))
					cardNameCounts[card.name] = 0;
				else
					cardNameCounts[card.name]++;
			});

			Object.forEach(cardNameCounts, function(key, val)
			{
				if(val===0)
					delete cardNameCounts[key];
				else
					cardNameCounts[key]++;
			});

			var setCorrections = shared.getSetCorrections(this.data.set.code);

			this.data.set.cards.forEach(function(card)
			{
				card.imageName = unicodeUtil.unicodeToAscii((card.layout==="split" ? card.names.join("") : card.name));

				if(cardNameCounts.hasOwnProperty(card.name))
				{
					var imageNumber = cardNameCounts[card.name]--;

					var numberOrder = setCorrections.mutateOnce(function(setCorrection) { return setCorrection.renumberImages===card.name ? setCorrection.order : undefined; });
					if(numberOrder)
						imageNumber = numberOrder.indexOf(card.multiverseid)+1;
					
					card.imageName += imageNumber;
				}

				card.imageName = card.imageName.replaceAll("/", " ");

				card.imageName = card.imageName.strip(":\"?").replaceAll(" token card", "").toLowerCase();
			});

			// Foreign Languages
			if(!fs.existsSync(path.join(__dirname, "..", "json", this.data.set.code + ".json")))
			{
				base.warn("SKIPPING foreign languages...");
				this();
			}
			else
			{
				base.info("Adding foreign languages to cards...");
				addForeignNamesToCards(this.data.set.cards, this);
			}
		},
		function addLegalities()
		{
			base.info("Adding legalities to cards...");

			addLegalitiesToCards(this.data.set.cards, this);
		},
		function addPrintings()
		{
			base.info("Adding printings to cards...");

			addPrintingsToCards(this.data.set.cards, this);
		},
		function finish(err)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			base.info("Doing set corrections...");
			shared.performSetCorrections(shared.getSetCorrections(this.data.set.code), this.data.set.cards);

			this.data.set.cards = this.data.set.cards.sort(shared.cardComparator);

			// Warn about missing fields
			this.data.set.cards.forEach(function(card)
			{
				if(!card.rarity)
					base.warn("Rarity not found for card: %s", card.name);
				if(!card.artist)
					base.warn("Artist not found for card: %s", card.name);
			});

			//base.info("Other Printings: %s", (this.data.set.cards.map(function(card) { return card.printings; }).flatten().unique().map(function(setName) { return C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET.code : undefined; }); }).remove(this.data.set.code) || []).join(" "));

			setImmediate(function() { cb(err, this.data.set); }.bind(this));
		}
	);
}
exports.ripSet = ripSet;

function processMultiverseids(multiverseids, cb)
{
	var cards = [];
	var doubleFacedCardNames = [];

	base.info("Processing %d multiverseids", multiverseids.unique().length);

	multiverseids.unique().serialForEach(function(multiverseid, subcb)
	{
		tiptoe(
			function getMultiverseUrls()
			{
				getURLsForMultiverseid(multiverseid, this);
			},
			function getMultiverseDocs(urls)
			{
				urls.forEach(function(multiverseURL)
				{
					getURLAsDoc(multiverseURL, this.parallel());
					getURLAsDoc(urlUtil.setQueryParam(multiverseURL, "printed", "true"), this.parallel());
				}.bind(this));
			},
			function processMultiverseDocs()
			{
				Array.prototype.slice.call(arguments).forEachBatch(function(multiverseDoc, printedMultiverseDoc)
				{
					var newCards = [];
					var multiverseDocCardParts = getCardParts(multiverseDoc);
					var printedMultiverseDocCardParts = getCardParts(printedMultiverseDoc);
					if(multiverseDocCardParts.length!==printedMultiverseDocCardParts.length)
					{
						throw new Error("multiverseDocCardParts length [" + multiverseDocCardParts.length + "] does not equal printedMultiverseDocCardParts length [" + printedMultiverseDocCardParts.length + "]");
					}

					multiverseDocCardParts.forEach(function(cardPart, i)
					{
						var newCard = processCardPart(multiverseDoc, cardPart, printedMultiverseDoc, printedMultiverseDocCardParts[i]);
						if(newCard.layout==="split" && i===1)
							return;

						newCards.push(newCard);
					});

					if(newCards.length===2 && newCards[0].layout==="double-faced")
					{
						var doubleFacedCardName = newCards[0].names.join(":::");
						if(!doubleFacedCardNames.contains(doubleFacedCardName))
							doubleFacedCardNames.push(doubleFacedCardName);
						else
							newCards = [];
					}

					cards = cards.concat(newCards);
				}, 2);

				this();
			},
			function finish(err) { setImmediate(function() { subcb(err); }); }
		);
	}, function(err) { return cb(err, cards); });
}

function getCardPartIDPrefix(cardPart)
{
	return "#" + cardPart.find(".rightCol").attr("id").replaceAll("_rightCol", "");
}

var POWER_TOUGHNESS_REPLACE_MAP =
{
	"{1/2}" : ".5",
	"{\\^2}"  : "²"
};

function processCardPart(doc, cardPart, printedDoc, printedCardPart)
{
	var card =
	{
		layout     : "normal",
		supertypes : [],
		type       : "",
		types      : [],
		colors     : []
	};

	var idPrefix = getCardPartIDPrefix(cardPart);

	// Multiverseid
	card.multiverseid = +querystring.parse(url.parse(cardPart.find(idPrefix + "_setRow .value a").attr("href")).query).multiverseid.trim();

	// Check for split card
	var fullCardName = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay").text().trim();
	if(fullCardName.contains(" // "))
	{
		card.layout = "split";
		card.names = fullCardName.split(" // ").filter(function(splitName) { return splitName.trim(); });
	}

	// Check for flip or double-faced card
	var cardParts = getCardParts(doc);
	if(card.layout!=="split" && cardParts.length===2)
	{
		var firstCardText = processTextBlocks(doc, cardParts[0].find(getCardPartIDPrefix(cardParts[0]) + "_textRow .value .cardtextbox")).trim().toLowerCase();
		if(firstCardText.contains("flip"))
			card.layout = "flip";
		else if(firstCardText.contains("transform"))
			card.layout = "double-faced";
		else
			base.warn("Unknown card layout for multiverseid: %s", card.multiverseid);

		card.names = [cardParts[0].find(getCardPartIDPrefix(cardParts[0]) + "_nameRow .value").text().trim(), cardParts[1].find(getCardPartIDPrefix(cardParts[1]) + "_nameRow .value").text().trim()];
	}

	// Card Name
	card.name = cardPart.find(idPrefix + "_nameRow .value").text().trim();

	if(card.name.endsWith(" token card"))
		card.layout = "token";

	//base.info("Processing card: " + card.name);

	// Card Type
	var skipped = 0;
	var rawTypeFull = cardPart.find(idPrefix + "_typeRow .value").text().trim();
	if(!rawTypeFull.contains("—") && rawTypeFull.contains(" - "))  // Some gatherer entries have a regular dash instead of a 'long dash'
	{
		base.warn("Raw type for card [%s] does not contain a long dash for type [%s] but does contain a small dash surrounded by spaces ' - '. Auto-correcting!", card.name, rawTypeFull);
		rawTypeFull = rawTypeFull.replace(" - ", "—");
	}
	var rawTypes = rawTypeFull.split(/[—]/);
	rawTypes[0].split(" ").filterEmpty().forEach(function(rawType, i)
	{
		if(rawType.trim().toLowerCase()==="(none)")
			return;

		card.type += ((i-skipped)>0 ? " " : "") + rawType;

		rawType = rawType.trim().toProperCase();
		if(C.SUPERTYPES.contains(rawType))
			card.supertypes.push(rawType);
		else if(C.TYPES.contains(rawType))
			card.types.push(rawType);
		else
			base.warn("Raw type not found [%s] for card: %s", rawType, card.name);
	});
	if(rawTypes.length>1)
	{
		card.subtypes = card.types.contains("Plane") ? [rawTypes[1].trim()] : rawTypes[1].split(" ").filterEmpty().map(function(subtype) { return subtype.trim(); });	// 205.3b Planes have just a single subtype
		card.type += " — " + card.subtypes.join(" ");
	}
	if(!card.supertypes.length)
		delete card.supertypes;
	if(!card.types.length)
		delete card.types;

	if(card.types)
	{
		if(card.types.contains("Plane"))
			card.layout = "plane";
		else if(card.types.contains("Scheme"))
			card.layout = "scheme";
		else if(card.types.contains("Phenomenon"))
			card.layout = "phenomenon";
		else if(card.types.contains("Vanguard") && card.name.endsWith(" Avatar"))
			card.name = card.name.substring(0, (card.name.length-" Avatar".length));
		
		if(card.types.map(function(type) { return type.toLowerCase(); }).contains("vanguard"))
			card.layout = "vanguard";
	}

	// Original type
	card.originalType = printedCardPart.find(idPrefix + "_typeRow .value").text().trim().replaceAll(" -", " —");

	// Converted Mana Cost (CMC)
	var cardCMC = cardPart.find(idPrefix + "_cmcRow .value").text().trim();
	if(cardCMC)
		card.cmc = +cardCMC;

	// Rarity
	card.rarity = cardPart.find(idPrefix + "_rarityRow .value").text().trim();

	// Artist
	card.artist = cardPart.find(idPrefix + "_artistRow .value a").text().trim();

	// Power/Toughness or Loyalty
	var powerToughnessValue = cardPart.find(idPrefix + "_ptRow .value").text().trim();
	if(powerToughnessValue)
	{
		// Loyalty
		if(card.types.contains("Planeswalker"))
		{
			card.loyalty = +powerToughnessValue.trim();
		}
		else if(card.types.contains("Vanguard"))
		{
			var handLifeParts = powerToughnessValue.trim().strip("+)(").replaceAll("Hand Modifier: ", "").replaceAll("Life Modifier: ", "").split(",").map(function(a) { return a.trim(); });
			if(handLifeParts.length!==2)
			{
				base.warn("Power toughness invalid [%s] for card: %s", cardPart.find(idPrefix + "_ptRow .value").text().trim(), card.name);
			}
			else
			{
				card.hand = parseInt(handLifeParts[0], 10);
				card.life = parseInt(handLifeParts[1], 10);
			}
		}
		else
		{
			// Power/Toughness
			Object.forEach(POWER_TOUGHNESS_REPLACE_MAP, function(find, replace)
			{
				powerToughnessValue = powerToughnessValue.replaceAll(find, replace);
			});

			var powerToughnessParts = powerToughnessValue.split("/");
			if(powerToughnessParts.length!==2)
			{
				base.warn("Power toughness invalid [%s] for card: %s", cardPart.find(idPrefix + "_ptRow .value").text().trim(), card.name);
			}
			else
			{
				card.power = powerToughnessParts[0].trim();
				card.toughness = powerToughnessParts[1].trim();
			}
		}
	}

	// Mana Cost
	var cardManaCosts = cardPart.find(idPrefix + "_manaRow .value img").map(function(i, item) { return doc(item); }).map(function(manaCost) { return processSymbol(manaCost.attr("alt")); });
	var cardManaCost = cardManaCosts.join("");
	if(cardManaCost)
		card.manaCost = cardManaCost;

	// Colors
	cardManaCosts.forEach(function(manaCost)
	{
		Object.forEach(COLOR_SYMBOL_TO_NAME_MAP, function(colorSymbol, colorName)
		{
			if(manaCost.contains(colorSymbol))
				card.colors.push(colorName);
		});
	});

	var cardColorIndicators = cardPart.find(idPrefix + "_colorIndicatorRow .value").text().trim().toLowerCase().split(",").map(function(cardColorIndicator) { return cardColorIndicator.trim(); }) || [];
	cardColorIndicators.forEach(function(cardColorIndicator)
	{
		if(cardColorIndicator && COLOR_ORDER.contains(cardColorIndicator))
			card.colors.push(cardColorIndicator);
	});

	card.colors = card.colors.unique().sort(function(a, b) { return COLOR_ORDER.indexOf(a)-COLOR_ORDER.indexOf(b); }).map(function(color) { return color.toProperCase(); });
	if(card.colors.length===0)
		delete card.colors;

	// Text
	var cardText = processTextBlocks(doc, cardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(cardText)
	{
		card.text = cardText;
		if(card.text.contains("{UNKNOWN}"))
			base.warn("Invalid symbol in oracle card text for card: %s", card.name);
	}

	if(cardText.toLowerCase().startsWith("level up {"))
		card.layout = "leveler";

	// Original Printed Text
	var originalCardText = processTextBlocks(printedDoc, printedCardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(originalCardText)
	{
		card.originalText = originalCardText;
		if(card.originalText.contains("{UNKNOWN}"))
			base.warn("Invalid symbol in printed card text for card: %s", card.name);
	}

	// Flavor Text
	var cardFlavor = processTextBlocks(doc, cardPart.find(idPrefix + "_flavorRow .value .cardtextbox")).trim();
	if(cardFlavor)
		card.flavor = cardFlavor;

	// Card Number
	var cardNumberValue = cardPart.find(idPrefix + "_numberRow .value").text().trim();
	if(cardNumberValue)
	{
		if(card.layout==="split")
			cardNumberValue = cardNumberValue.replace(/[^\d.]/g, "") + ["a", "b"][card.names.indexOf(card.name)];
		
		card.number = cardNumberValue;
	}

	// Watermark
	var cardWatermark = processTextBlocks(doc, cardPart.find(idPrefix + "_markRow .value .cardtextbox")).trim();
	if(cardWatermark)
		card.watermark = cardWatermark;

	// Rulings
	var rulingRows = cardPart.find(idPrefix + "_rulingsContainer table tr.post");
	if(rulingRows.length)
	{
		card.rulings = rulingRows.map(function(i, item) { return doc(item); }).map(function(rulingRow) { return { date : moment(rulingRow.find("td:first-child").text().trim(), "MM/DD/YYYY").format("YYYY-MM-DD"), text : rulingRow.find("td:last-child").text().trim()}; });
		var seenRulings = [];
		card.rulings = card.rulings.reverse().filter(function(ruling) { if(seenRulings.contains(ruling.text)) { return false; } seenRulings.push(ruling.text); return true; }).reverse();
	}

	// Variations
	if(card.layout!=="split" && card.layout!=="double-faced" && card.layout!=="flip")
	{
		var variationLinks = cardPart.find(idPrefix + "_variationLinks a.variationLink").map(function(i, item) { return doc(item); });
		if(variationLinks.length)
			card.variations = variationLinks.map(function(variationLink) { return +variationLink.attr("id").trim(); }).filter(function(variation) { return variation!==card.multiverseid; });
	}

	return card;
}

function getCardParts(doc)
{
	return doc("table.cardDetails").map(function(i, item) { return doc(item); });
}

function getURLsForMultiverseid(multiverseid, cb)
{
	tiptoe(
		function getDefaultDoc()
		{
			getURLAsDoc(shared.buildMultiverseURL(multiverseid), this.parallel());
			getURLAsDoc(urlUtil.setQueryParam(shared.buildMultiverseURL(multiverseid), "printed", "true"), this.parallel());
		},
		function processDefaultDoc(err, doc, printedDoc)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];

			var cardParts = getCardParts(doc);
			var printedCardParts = getCardParts(printedDoc);
			if(cardParts.length!==printedCardParts.length)
				throw new Error("multiverseid [" + multiverseid + "] cardParts length [" + cardParts.length + "] does not equal printedCardParts length [" + printedCardParts.length + "]");

			cardParts.forEach(function(cardPart, i)
			{
				var card = processCardPart(doc, cardPart, printedDoc, printedCardParts[i]);
				if(card.layout==="split")
				{
					urls.push(shared.buildMultiverseURL(multiverseid, card.names[0]));
					urls.push(shared.buildMultiverseURL(multiverseid, card.names[1]));
				}
				else
				{
					urls.push(shared.buildMultiverseURL(multiverseid));
				}
			});
			urls = urls.unique();

			setImmediate(function() { cb(null, urls); }.bind(this));
		}
	);
}

function getURLAsDoc(targetURL, cb)
{
	var urlHash = hash("whirlpool", targetURL);
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
				base.info("Requesting from web: %s", targetURL);
				request(targetURL, this);
			}
		},
		function createDoc(err, response, pageHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			if(!fs.existsSync(cachePath))
				fs.writeFileSync(cachePath, pageHTML, {encoding:"utf8"});

			// June 14, 2014: New gatherer has invalid HTML, this regex fixes it so cheerio can parse code correctly.
			// See difference between 373328 and 221209. In the first one, they don't have a <tr> following the cardDetails table
			// We don't save the modified HTML to disk cache, always store original HTML to disk cache
			pageHTML = pageHTML.replace(/(<table class="cardDetails"[^>]+>)[^<]+<div([^>]*)>/g, "$1<tr><div$2>");

			setImmediate(function() { cb(null, cheerio.load(pageHTML)); }.bind(this));
		}
	);
}

function addForeignNamesToCards(cards, cb)
{
	var sets = {};

	tiptoe(
		function loadJSON()
		{
			C.SETS.forEach(function(SET)
			{
				fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this.parallel());
			}.bind(this));
		},
		function processCards()
		{
			var args=arguments;

			C.SETS.forEach(function(SET, i)
			{
				sets[SET.code] = JSON.parse(args[i]);
			});

			cards.serialForEach(function(card, subcb)
			{
				getForeignNamesForCardName(sets, card.name, subcb);
			}, this);
		},
		function applyForeignLanguages(err, cardsForeignNames)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			cards.forEach(function(card, i)
			{
				delete card.foreignNames;

				if(card.layout!=="split" && card.layout!=="double-faced" && (card.layout!=="flip" || (card.layout==="flip" && card.names && card.names.length>=1 && card.names[0]===card.name)))
				{
					var cardForeignNames = cardsForeignNames[i];
					if(cardForeignNames && cardForeignNames.length)
						card.foreignNames = cardForeignNames;
				}
			});

			setImmediate(function() { cb(); });
		}
	);
}

function getForeignNamesForCardName(sets, cardName, cb)
{
	var seenLanguages = [];
	var foreignLanguages = [];
	tiptoe(
		function fetchLanguagePages()
		{
			var multiverseids = getMultiverseidsForCardName(sets, cardName);
			multiverseids.serialForEach(function(multiverseid, subcb)
			{
				getURLAsDoc(shared.buildMultiverseLanguagesURL(multiverseid), subcb);
			}, this);
		},
		function processDocs(err, docs)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			docs.forEach(function(doc)
			{
				doc("table.cardList tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var language = cardRow.find("td:nth-child(2)").text().trim();
					var foreignCardName = cardRow.find("td:nth-child(1) a").text().trim();
					if(language && foreignCardName && !seenLanguages.contains(language) && cardName!==foreignCardName)
					{
						seenLanguages.push(language);
						foreignLanguages.push({language : language, name : foreignCardName});
					}
				});
			});

			foreignLanguages = foreignLanguages.sort(function(a, b) { var al = a.language.toLowerCase().charAt(0); var bl = b.language.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });

			setImmediate(function() { cb(null, foreignLanguages); });
		}
	);
}

function addLegalitiesToCards(cards, cb)
{
	cards.serialForEach(function(card, subcb)
	{
		addLegalitiesToCard(card, subcb);
	}, cb);
}

function addLegalitiesToCard(card, cb)
{
	tiptoe(
		function getFirstPage()
		{
			getURLAsDoc(shared.buildMultiverseLegalitiesURL(card.multiverseid), this);
		},
		function processLegalities(doc)
		{
			delete card.legalities;
			card.legalities = {};

			doc("table.cardList").map(function(i, item) { return doc(item); })[1].find("tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
			{
				var format = cardRow.find("td:nth-child(1)").text().trim();
				var legality = cardRow.find("td:nth-child(2)").text().trim();
				var condition = cardRow.find("td:nth-child(3)").text().trim();
				if(format && legality)
					card.legalities[format] = legality + (condition && condition.length>0 ? (" (" + condition + ")") : "");
			});

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function addPrintingsToCards(cards, cb)
{
	cards.serialForEach(function(card, subcb)
	{
		addPrintingsToCard(card, subcb);
	}, cb);
}

function addPrintingsToCard(card, cb)
{
	tiptoe(
		function getFirstPage()
		{
			getURLAsDoc(shared.buildMultiversePrintingsURL(card.multiverseid, 0), this);
		},
		function getAllPages(doc)
		{
			var pageLinks = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_PrintingsList_pagingControlsContainer a").map(function(i, item) { return doc(item); });
			var numPages = pageLinks.length>0 ? pageLinks.length : 1;
			for(var i=0;i<numPages;i++)
			{
				getURLAsDoc(shared.buildMultiversePrintingsURL(card.multiverseid, i), this.parallel());
			}
		},
		function processPrintings()
		{
			var docs = Array.prototype.slice.apply(arguments);

			var printings = [];
			docs.forEach(function(doc)
			{
				doc("table.cardList").map(function(i, item) { return doc(item); })[0].find("tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var printing = cardRow.find("td:nth-child(3)").text().trim();
					if(printing)
						printings.push(printing);
				});
			});

			delete card.printings;

			Object.forEach(C.EXTRA_SET_CARD_PRINTINGS, function(extraSetName, extraCardNames)
			{
				if(extraCardNames.contains(card.name))
					printings.push(extraSetName);
			});

			printings = printings.unique().sort(function(a, b) { return moment(getReleaseDateForSet(a), "YYYY-MM-DD").unix()-moment(getReleaseDateForSet(b), "YYYY-MM-DD").unix(); });
			if(printings && printings.length)
				card.printings = printings;

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function getMultiverseidsForCardName(sets, cardName)
{
	var multiverseids = [];

	Object.forEach(sets, function(setCode, set)
	{
		multiverseids = multiverseids.concat(set.cards.filter(function(card) { return card.name===cardName; }).map(function(card) { return card.multiverseid; }));
	});

	return multiverseids.unique();
}


var COLOR_ORDER = ["white", "blue", "black", "red", "green"];

var COLOR_SYMBOL_TO_NAME_MAP =
{
	"W" : "white",
	"U" : "blue",
	"B" : "black",
	"R" : "red",
	"G" : "green"
};

var SYMBOL_CONVERSION_MAP =
{
	"white"              : "W",
	"blue"               : "U",
	"black"              : "B",
	"red"                : "R",
	"green"              : "G",
	"zero"               : "0",
	"one"                : "1",
	"two"                : "2",
	"three"              : "3",
	"four"               : "4",
	"five"               : "5",
	"six"                : "6",
	"seven"              : "7",
	"eight"              : "8",
	"nine"               : "9",
	"ten"                : "10",
	"eleven"             : "11",
	"twelve"             : "12",
	"thirteen"           : "13",
	"fourteen"           : "14",
	"fifteen"            : "15",
	"sixteen"            : "16",
	"0"                  : "0",
	"1"                  : "1",
	"2"                  : "2",
	"3"                  : "3",
	"4"                  : "4",
	"5"                  : "5",
	"6"                  : "6",
	"7"                  : "7",
	"8"                  : "8",
	"9"                  : "9",
	"10"                 : "10",
	"11"                 : "11",
	"12"                 : "12",
	"13"                 : "13",
	"14"                 : "14",
	"15"                 : "15",
	"16"                 : "16",
	"tap"                : "T",
	"untap"              : "Q",
	"snow"               : "S",
	"phyrexian white"    : "P/W",
	"phyrexian blue"     : "P/U",
	"phyrexian black"    : "P/B",
	"phyrexian red"      : "P/R",
	"phyrexian green"    : "P/G",
	"phyrexian"          : "P",
	"variable colorless" : "X",

	// Planechase Planes
	"chaos"              : "C",
	"[chaos]"            : "C",

	// Unglued, Unhinged
	"100"                : "100",
	"500"                : "500",
	"1000000"            : "1000000",
	"infinite"           : "∞",
	"half a red"         : "hr"
};

var TEXT_TO_SYMBOL_MAP =
{
	"ocT" : "T",
	"oW"  : "W",
	"oU"  : "U",
	"oB"  : "B",
	"oR"  : "R",
	"oG"  : "G",
	"oX"  : "X",
	"o1"  : "1",
	"o2"  : "2",
	"o3"  : "3",
	"o4"  : "4",
	"o5"  : "5",
	"o6"  : "6",
	"o7"  : "7",
	"o8"  : "8",
	"o9"  : "9"
};

function processSymbol(symbol)
{
	var symbols = symbol.toLowerCase().split(" or ").map(function(symbolPart)
	{
		symbolPart = symbolPart.trim();
		if(!SYMBOL_CONVERSION_MAP.hasOwnProperty(symbolPart))
		{
			base.warn("Invalid symbolPart [%s] with full value: %s", symbolPart, symbol);
			return "UNKNOWN";
		}

		return SYMBOL_CONVERSION_MAP[symbolPart];
	});

	return "{" + (symbols.length>1 ? symbols.join("/") : symbols[0]) + "}";
}

function processTextBlocks(doc, textBlocks)
{
	var result = "";

	textBlocks.map(function(i, item) { return doc(item); }).forEach(function(textBox, i)
	{
		if(i>0)
			result += "\n\n";

		textBox.toArray().forEach(function(child)
		{
			result += processTextBoxChildren(doc, child.children);
		});
	});

	while(result.contains("\n\n\n"))
	{
		result = result.replaceAll("\n\n\n", "\n\n");
	}

	return result;
}

function processTextBoxChildren(doc, children)
{
	var result = "";

	children.forEach(function(child)
	{
		if(child.type==="tag")
		{
			if(child.name==="img")
				result += processSymbol(doc(child).attr("alt"));
			else if(child.name==="i")
			{
				result += processTextBoxChildren(doc, child.children);
			}
			else if(child.name==="<")
			{
				result += "<";
			}
			else if(child.name===">")
			{
				result += ">";
			}
			else
				base.warn("Unsupported text child tag name %s", child.name);
		}
		else if(child.type==="text")
		{
			var childText = child.data;
			Object.forEach(TEXT_TO_SYMBOL_MAP, function(text, symbol)
			{
				childText = childText.replaceAll("o" + text, "{" + symbol + "}");
				childText = childText.replaceAll(text, "{" + symbol + "}");
			});
			
			childText = childText.replaceAll("roll chaos", "roll {C}");
			childText = childText.replaceAll("chaos roll", "{C} roll");

			result += childText;
		}
		else
		{
			base.warn("Unknown text child type: %s", child.type);
		}
	});

	return result;
}

function getReleaseDateForSet(setName)
{
	return C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET.releaseDate : undefined; }) || moment().format("YYYY-MM-DD");
}
