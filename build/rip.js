"use strict";
/*global setImmediate: true*/

var base = require("node-base"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

var SET_CORRECTIONS =
{
	ARN :
	[
		{ match : {name: "Bazaar of Baghdad"}, replace : {artist : "Jeff A. Menges"} },
		{ match : {name: "Library of Alexandria"}, replace : {artist : "Mark Poole"} }
	]
};

function ripSet(setName, cb)
{
	tiptoe(
		function getListHTML()
		{
			var listURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Search/Default.aspx",
				query    :
				{
					output : "checklist",
					sort   : "cn+",
					set    : "[" + JSON.stringify(setName) + "]"
				}
			});

			request(listURL, this);
		},
		function processFirstBatch(response, listHTML)
		{
			var listDoc = cheerio.load(listHTML);

			this.data.set = base.clone(C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET : undefined; }));

			processMultiverseids(listDoc("table.checklist tr.cardItem a.nameLink").map(function(i, itemRaw) { return +querystring.parse(url.parse(listDoc(itemRaw).attr("href")).query).multiverseid; }).unique(), this);
		},
		function processVariations(cards)
		{
			this.data.set.cards = cards;
			processMultiverseids(cards.map(function(card) { return (card.variations && card.variations.length) ? card.variations : []; }).flatten().unique().subtract(cards.map(function(card) { return card.multiverseid; })), this);
		},
		function finish(err, cards)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			this.data.set.cards = this.data.set.cards.concat(cards).sort(function(a, b) { return a.name.localeCompare(b.name); });

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

			this.data.set.cards.forEach(function(card)
			{
				card.imageName = unicode_to_ascii(card.name);

				if(cardNameCounts.hasOwnProperty(card.name))
					card.imageName += cardNameCounts[card.name]--;

				card.imageName = card.imageName.strip(":").toLowerCase();
			});

			// Set Corrections
			if(SET_CORRECTIONS.hasOwnProperty(this.data.set.code))
			{
				SET_CORRECTIONS[this.data.set.code].forEach(function(SET_CORRECTION)
				{
					this.data.set.cards.forEach(function(card)
					{
						if(Object.every(SET_CORRECTION.match, function(key, value) { return card[key]===value; }))
							Object.forEach(SET_CORRECTION.replace, function(key, value) { card[key] = value; });
					});
				}.bind(this));
			}

			// Warn about missing fields
			this.data.set.cards.forEach(function(card)
			{
				if(!card.rarity)
					base.warn("Rarity not found for card: %s", card.name);
				if(!card.artist)
					base.warn("Artist not found for card: %s", card.name);
			});

			setImmediate(function() { cb(err, this.data.set); }.bind(this));
		}
	);
}
exports.ripSet = ripSet;

function processMultiverseids(multiverseids, cb)
{
	var cards = [];

	multiverseids.unique().serialForEach(function(multiverseid, subcb)
	{
		tiptoe(
			function getMultiverseDoc()
			{
				getDoc(multiverseid, this);
			},
			function finish(err, multiverseDoc)
			{
				if(err || !multiverseDoc)
					return setImmediate(function() { subcb(err || new Error("Invalid multiverse response")); });

				getCardParts(multiverseDoc).forEach(function(cardPart) { cards.push(processCardPart(multiverseDoc, cardPart)); });

				setImmediate(subcb);
			}
		);
	}, function(err) { return cb(err, cards); });
}

var UNICODE_CONVERSION_MAP =
{
	// latin
	'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
	'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
	'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
	'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
	'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a',
	'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
	'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
	'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
	'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
	'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
	// greek
	'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
	'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
	'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
	'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
	'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
	'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
	'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
	'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
	'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
	'Ϋ':'Y',
	// turkish
	'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I', 'ğ':'g', 'Ğ':'G',
	// russian
	'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
	'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
	'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
	'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
	'я':'ya',
	'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
	'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
	'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
	'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
	'Я':'Ya',
	// ukranian
	'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
	// czech
	'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
	'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
	'Ů':'U', 'Ž':'Z',
	// polish
	'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z',
	'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'e', 'Ł':'L', 'Ń':'N', 'Ś':'S',
	'Ź':'Z', 'Ż':'Z',
	// latvian
	'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n', 'ū':'u',
	'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'i', 'Ķ':'k', 'Ļ':'L', 'Ņ':'N', 'Ū':'u'
};

function unicode_to_ascii(text)
{
	var result = "";

	for(var i=0,len=text.length;i<len;i++)
	{
		var c = text.charAt(i);
		result += UNICODE_CONVERSION_MAP.hasOwnProperty(c) ? UNICODE_CONVERSION_MAP[c] : c;
	}

	return result;
}

var SYMBOL_CONVERSION_MAP =
{
	"white"              : "W",
	"black"              : "B",
	"red"                : "R",
	"blue"               : "U",
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
	"phyrexian white"    : "PW",
	"phyrexian black"    : "PB",
	"phyrexian red"      : "PR",
	"phyrexian blue"     : "PU",
	"phyrexian green"    : "PG",
	"variable colorless" : "X"
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

function processCardPart(doc, cardPart)
{
	var card =
	{
		supertypes : [],
		type       : "",
		types      : []
	};

	var idPrefix = "#" + cardPart.find(".rightCol").attr("id").replaceAll("_rightCol", "");

	// Multiverseid
	card.multiverseid = +querystring.parse(url.parse(doc("#aspnetForm").attr("action")).query).multiverseid.trim();

	// Card Name
	card.name = cardPart.find(idPrefix + "_nameRow .value").text().trim();

	// Card Type
	var rawTypes = cardPart.find(idPrefix + "_typeRow .value").text().trim().split("—");
	rawTypes[0].split(" ").filterEmpty().forEach(function(rawType, i)
	{
		card.type += (i>0 ? " " : "") + rawType;

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
		card.type += " - " + card.subtypes.join(" ");
	}
	if(!card.supertypes.length)
		delete card.supertypes;
	if(!card.types.length)
		delete card.types;

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
		else
		{
			// Power/Toughness
			var powerToughnessParts = powerToughnessValue.split("/");
			if(powerToughnessParts.length!==2)
			{
				base.warn("Power toughness invalid [%s] for card: %s", powerToughnessValue, card.name);
			}
			else
			{
				card.power = +powerToughnessParts[0].trim();
				card.toughness = +powerToughnessParts[1].trim();
			}
		}
	}

	// Mana Cost
	var cardManaCost = cardPart.find(idPrefix + "_manaRow .value img").map(function(i, item) { return doc(item); }).map(function(manaCost) { return processSymbol(manaCost.attr("alt")); }).join("");
	if(cardManaCost)
		card.manaCost = cardManaCost;

	// Text
	var cardText = processTextBlocks(doc, cardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(cardText)
		card.text = cardText;

	// Flavor Text
	var cardFlavor = processTextBlocks(doc, cardPart.find(idPrefix + "_flavorRow .value .cardtextbox")).trim();
	if(cardFlavor)
		card.flavor = cardFlavor;

	// Card Number
	var cardNumberValue = cardPart.find(idPrefix + "_numberRow .value").text().trim();
	if(cardNumberValue)
		card.number = +cardNumberValue;

	// Rulings
	var rulingRows = cardPart.find(idPrefix + "_rulingsContainer table tr.post");
	if(rulingRows.length)
		card.rulings = rulingRows.map(function(i, item) { return doc(item); }).map(function(rulingRow) { return { date : moment(rulingRow.find("td:first-child").text().trim(), "MM/DD/YYYY").format("YYYY-MM-DD"), text : rulingRow.find("td:last-child").text().trim()}; });

	// Variations
	var variationLinks = cardPart.find(idPrefix + "_variationLinks a.variationLink").map(function(i, item) { return doc(item); });
	if(variationLinks.length)
		card.variations = variationLinks.map(function(variationLink) { return +variationLink.attr("id").trim(); }).filter(function(variation) { return variation!==card.multiverseid; });

	return card;
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
			else
				base.warn("Unsupported text child tag name: %s", child.name);
		}
		else if(child.type==="text")
		{
			result += child.data;
		}
		else
		{
			base.warn("Unknown text child type: %s", child.type);
		}
	});

	return result;
}

function getCardParts(doc)
{
	return doc("table.cardDetails").map(function(i, item) { return doc(item); });
}

function getDoc(multiverseid, cb)
{
	tiptoe(
		function getHTML()
		{
			var pageURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Card/Details.aspx",
				query    :
				{
					multiverseid : multiverseid,
					printed      : "false"
				}
			});

			if(fs.existsSync(path.join("/", "tmp", multiverseid + ".html")))
				fs.readFile(path.join("/", "tmp", multiverseid + ".html"), {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			else
				request(pageURL, this);
		},
		function createDoc(err, response, pageHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			if(!fs.existsSync(path.join("/", "tmp", multiverseid + ".html")))
				fs.writeFileSync(path.join("/", "tmp", multiverseid + ".html"), pageHTML, {encoding:"utf8"});

			setImmediate(function() { cb(null, cheerio.load(pageHTML)); }.bind(this));
		}
	);
}

exports.tmp = function(cb)
{
	tiptoe(
		function step1()
		{
			getDoc(process.argv[2], this);
		},
		function step2(doc)
		{
			var cardParts = getCardParts(doc);
			cardParts.forEach(function(cardPart) { base.info(processCardPart(doc, cardPart)); });
			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
};
