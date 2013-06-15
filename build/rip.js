"use strict";
/*global setImmediate: true*/

var base = require("node-base"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	hash = require("mhash").hash,
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

var SET_CORRECTIONS =
{
	ARN :
	[
		{ match : {name: "Bazaar of Baghdad"}, replace : {artist : "Jeff A. Menges"} },
		{ match : {name: "Library of Alexandria"}, replace : {artist : "Mark Poole"} }
	],
	LEG :
	[
		{ match : {name: "The Tabernacle at Pendrell Vale"}, replace : {artist : "Nicola Leonard"} }
	],
	FEM :
	[
		{ renumberImages : "Armor Thrull", order : [1841, 1840, 1838, 1839] },
		{ renumberImages : "Basal Thrull", order : [1842, 1844, 1843, 1845] },
		{ renumberImages : "Brassclaw Orcs", order : [1966, 1938, 1937, 1940] },
		{ renumberImages : "Combat Medic", order : [1971, 1972, 1970, 1973] },
		{ renumberImages : "Elven Fortress", order : [1905, 1904, 1906, 1907] },
		{ renumberImages : "Elvish Hunter", order : [1910, 1911, 1909] },
		{ renumberImages : "Elvish Scout", order : [1913, 1912, 1914] },
		{ renumberImages : "Goblin Chirurgeon", order : [1948, 1949, 1947] },
		{ renumberImages : "Goblin War Drums", order : [1955, 1957, 1956, 1958] },
		{ renumberImages : "High Tide", order : [1873, 1872, 1874] },
		{ renumberImages : "Homarid Warrior", order : [1882, 1881, 1883] },
		{ renumberImages : "Homarid", order : [1875, 1876, 1877, 1878] },
		{ renumberImages : "Hymn to Tourach", order : [1850, 1849, 1851, 1852] },
		{ renumberImages : "Icatian Infantry", order : [1981, 1982, 1983, 1984] },
		{ renumberImages : "Icatian Moneychanger", order : [1989, 1990, 1991] },
		{ renumberImages : "Icatian Scout", order : [1994, 1997, 1996, 1995] },
		{ renumberImages : "Initiates of the Ebon Hand", order : [1855, 1854, 1853] },
		{ renumberImages : "Merseine", order : [1884, 1885, 1887, 1886] },
		{ renumberImages : "Mindstab Thrull", order : [1857, 1856, 1858] },
		{ renumberImages : "Necrite", order : [1860, 1859, 1861] },
		{ renumberImages : "Night Soil", order : [1918, 1917, 1919] },
		{ renumberImages : "Orcish Spy", order : [1962, 1961, 1963] },
		{ renumberImages : "Orcish Veteran", order : [1967, 1965, 1939, 1964] },
		{ renumberImages : "Order of Leitbur", order : [2001, 2000, 2002] },
		{ renumberImages : "Order of the Ebon Hand", order : [1863, 1862, 1864] },
		{ renumberImages : "Spore Cloud", order : [1920, 1922, 1921] },
		{ renumberImages : "Thallid", order : [1924, 1926, 1927, 1925] },
		{ renumberImages : "Thorn Thallid", order : [1933, 1934, 1935, 1936] },
		{ renumberImages : "Tidal Flats", order : [1891, 1892, 1893] },
		{ renumberImages : "Vodalian Mage", order : [1896, 1898, 1897] },
		{ renumberImages : "Vodalian Soldiers", order : [1899, 1901, 1900, 1902] }
	],
	ICE :
	[
		{ renumberImages : "Forest", order : [2748, 2746, 2747] },
		{ renumberImages : "Island", order : [2768, 2767, 2769] },
		{ renumberImages : "Mountain", order : [2763, 2765, 2764] },
		{ renumberImages : "Plains", order : [2773, 2771, 2772] },
		{ renumberImages : "Swamp", order : [2744, 2743, 2745] }
	],
	HML :
	[
		{ renumberImages : "Abbey Matron", order : [3011, 3012] },
		{ renumberImages : "Ambush Party", order : [2989, 2988] },
		{ renumberImages : "Anaba Bodyguard", order : [2992, 2993] },
		{ renumberImages : "Anaba Shaman", order : [2995, 2994] },
		{ renumberImages : "Carapace", order : [2963, 2964] },
		{ renumberImages : "Dark Maze", order : [2940, 2939] },
		{ renumberImages : "Dwarven Trader", order : [3000, 3001] },
		{ renumberImages : "Folk of An-Havva", order : [2968, 2967] },
		{ renumberImages : "Hungry Mist", order : [2969, 2970] },
		{ renumberImages : "Mesa Falcon", order : [3022, 3021] },
		{ renumberImages : "Reef Pirates", order : [2955, 2954] },
		{ renumberImages : "Sengir Bats", order : [2930, 2929] },
		{ renumberImages : "Willow Faerie", order : [2982, 2983] }
	],
	ALL :
	[
		{ renumberImages : "Astrolabe", order : [3044, 3043] },
		{ renumberImages : "Balduvian War-Makers", order : [3162, 3163] },
		{ renumberImages : "Benthic Explorers", order : [3102, 3101] },
		{ renumberImages : "Deadly Insect", order : [3129, 3130] },
		{ renumberImages : "Enslaved Scout", order : [3169, 3170] },
		{ renumberImages : "Errand of Duty", order : [3193, 3192] },
		{ renumberImages : "False Demise", order : [3106, 3105] },
		{ renumberImages : "Foresight", order : [3108, 3109] },
		{ renumberImages : "Gift of the Woods", order : [3138, 3139] },
		{ renumberImages : "Gorilla Berserkers", order : [3140, 3141] },
		{ renumberImages : "Gorilla Chieftain", order : [3143, 3142] },
		{ renumberImages : "Gorilla War Cry", order : [3173, 3174] },
		{ renumberImages : "Kjeldoran Pride", order : [3201, 3202] },
		{ renumberImages : "Lim-Dûl's High Guard", order : [3083, 3082] },
		{ renumberImages : "Phyrexian War Beast", order : [3053, 3054] },
		{ renumberImages : "Royal Herbalist", order : [3213, 3212] },
		{ renumberImages : "Soldevi Sage", order : [3117, 3116] },
		{ renumberImages : "Soldevi Steam Beast", order : [3061, 3062] },
		{ renumberImages : "Taste of Paradise", order : [3150, 3149] },
		{ renumberImages : "Varchild's Crusader", order : [3186, 3185] },
		{ renumberImages : "Viscerid Armor", order : [3126, 3125] },
		{ renumberImages : "Whip Vine", order : [3154, 3155] },
		{ renumberImages : "Wild Aesthir", order : [3220, 3219] }
	],	
	MIR :
	[
		{ renumberImages : "Forest", order : [3569, 3567, 3568, 3566] },
		{ renumberImages : "Island", order : [3584, 3582, 3583, 3581] },
		{ renumberImages : "Mountain", order : [3580, 3578, 3579, 3577] },
		{ renumberImages : "Plains", order : [3585, 3587, 3586, 3588] },
		{ renumberImages : "Swamp", order : [3562, 3563, 3564, 3565] }
	],
	TMP :
	[
		{ renumberImages : "Plains", order : [4953, 4954, 4955, 4956] }
	],
	XYZ :
	[
		{ renumberImages : "", order : [] },
		{ renumberImages : "", order : [] },
		{ renumberImages : "", order : [] },
		{ renumberImages : "", order : [] },
		{ renumberImages : "", order : [] }
	],
	XXX :
	[
		{ renumberImages : "Forest", order : [] },
		{ renumberImages : "Island", order : [] },
		{ renumberImages : "Mountain", order : [] },
		{ renumberImages : "Plains", order : [] },
		{ renumberImages : "Swamp", order : [] }
	]
};

function cardComparator(a, b)
{
	var result = unicode_to_ascii(a.name).toLowerCase().localeCompare(unicode_to_ascii(b.name).toLowerCase());
	if(result!==0)
		return result;

	if(a.imageName && b.imageName)
		return a.imageName.localeCompare(b.imageName);

	if(a.hasOwnProperty("number"))
		return b.number.localeCompare(a.number);

	return 0;
}

function ripSet(setName, cb)
{
	base.info("================================================================");
	base.info("Ripping Set: %s", setName);

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

			this.data.set.cards = this.data.set.cards.concat(cards).sort(cardComparator);

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

			var setCorrections = SET_CORRECTIONS[this.data.set.code];

			this.data.set.cards.forEach(function(card)
			{
				card.imageName = unicode_to_ascii((card.layout==="split" ? card.names.join("") : card.name));

				if(cardNameCounts.hasOwnProperty(card.name))
				{
					var imageNumber = cardNameCounts[card.name]--;
					if(setCorrections)
					{
						var numberOrder = setCorrections.mutateOnce(function(setCorrection) { return setCorrection.renumberImages===card.name ? setCorrection.order : undefined; });
						if(numberOrder)
							imageNumber = numberOrder.indexOf(card.multiverseid)+1;
					}
					
					card.imageName += imageNumber;
				}

				card.imageName = card.imageName.strip(":").toLowerCase();
			});

			// Set Corrections
			if(setCorrections)
			{
				setCorrections.forEach(function(setCorrection)
				{
					this.data.set.cards.forEach(function(card)
					{
						if(setCorrection.match && setCorrection.replace && Object.every(setCorrection.match, function(key, value) { return card[key]===value; }))
							Object.forEach(setCorrection.replace, function(key, value) { card[key] = value; });
					});
				}.bind(this));
			}

			this.data.set.cards = this.data.set.cards.sort(cardComparator);

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
			function getMultiverseUrls()
			{
				getURLsForMultiverseid(multiverseid, this);
			},
			function getMultiverseDocs(urls)
			{
				urls.forEach(function(url)
				{
					getURLAsDoc(url, this.parallel());
				}.bind(this));
			},
			function processMultiverseDocs()
			{
				Array.prototype.slice.call(arguments).forEach(function(multiverseDoc)
				{
					getCardParts(multiverseDoc).forEach(function(cardPart) { cards.push(processCardPart(multiverseDoc, cardPart)); });
				});

				this();
			},
			function finish(err) { setImmediate(function() { subcb(err); }); }
		);
	}, function(err) { return cb(err, cards); });
}

function processCardPart(doc, cardPart)
{
	var card =
	{
		layout     : "normal",
		supertypes : [],
		type       : "",
		types      : []
	};

	var idPrefix = "#" + cardPart.find(".rightCol").attr("id").replaceAll("_rightCol", "");

	var fullCardName = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay").text().trim();
	if(fullCardName.contains(" // "))
	{
		card.layout = "split";
		card.names = fullCardName.split(" // ").filter(function(splitName) { return splitName.trim(); });
	}

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
			card.loyalty = powerToughnessValue.trim();
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
				card.power = powerToughnessParts[0].trim();
				card.toughness = powerToughnessParts[1].trim();
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
		card.number = cardNumberValue;

	// Rulings
	var rulingRows = cardPart.find(idPrefix + "_rulingsContainer table tr.post");
	if(rulingRows.length)
		card.rulings = rulingRows.map(function(i, item) { return doc(item); }).map(function(rulingRow) { return { date : moment(rulingRow.find("td:first-child").text().trim(), "MM/DD/YYYY").format("YYYY-MM-DD"), text : rulingRow.find("td:last-child").text().trim()}; });

	// Variations
	if(card.layout==="normal")
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
			getURLAsDoc(buildMultiverseURL(multiverseid), this);
		},
		function processDefaultDoc(err, doc)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];
			getCardParts(doc).forEach(function(cardPart)
			{
				var card = processCardPart(doc, cardPart);
				if(card.layout==="split")
				{
					urls.push(buildMultiverseURL(multiverseid, card.names[0]));
					urls.push(buildMultiverseURL(multiverseid, card.names[1]));
				}
				else
				{
					urls.push(buildMultiverseURL(multiverseid));
				}
			});

			setImmediate(function() { cb(null, urls); }.bind(this));
		}
	);
}

function buildMultiverseURL(multiverseid, part)
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
}

function getURLAsDoc(url, cb)
{
	var cachePath = path.join(__dirname, "..", "cache", hash("whirlpool", url));

	tiptoe(
		function get()
		{
			if(fs.existsSync(cachePath))
				fs.readFile(cachePath, {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			else
				request(url, this);
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

exports.tmp = function(cb)
{
	tiptoe(
		function step1()
		{
			getURLsForMultiverseid(process.argv[2], this);
		},
		function step2(urls)
		{
			urls.forEach(function(url)
			{
				getURLAsDoc(url, this.parallel());
			}.bind(this));
		},
		function step3()
		{
			Array.prototype.slice.call(arguments).forEach(function(doc)
			{
				getCardParts(doc).forEach(function(cardPart) { base.info(processCardPart(doc, cardPart)); });
			});

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
};

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
