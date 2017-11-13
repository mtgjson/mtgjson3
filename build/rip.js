/*jslint node: true */
'use strict';

var C = require("../shared/C");
var clone = require("clone");
var flatten = require("arr-flatten");
var fs = require("fs");
var url = require("url");
var moment = require("moment");
var path = require("path");
var shared = require("../shared/shared");
var unidecode = require("unidecode");
var ansidiff = require("ansidiff");
var querystring = require("querystring");
var tiptoe = require("tiptoe");
var winston = require("winston");
var async = require('async');
var unique = require("array-unique");

(function (exports) {

var POWER_TOUGHNESS_REPLACE_MAP = {
    "{1/2}" : ".5",
    "{\\^2}"  : "²"
};

var COLOR_ORDER = ["white", "blue", "black", "red", "green"];

var COLOR_SYMBOL_TO_NAME_MAP = {
    "W" : "white",
    "U" : "blue",
    "B" : "black",
    "R" : "red",
    "G" : "green"
};

var SYMBOL_CONVERSION_MAP = {
    "white"              : "W",
    "blue"               : "U",
    "black"              : "B",
    "red"                : "R",
    "green"              : "G",
    "colorless"          : "C",
    "energy"             : "E",
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
    "phyrexian white"    : "W/P",
    "phyrexian blue"     : "U/P",
    "phyrexian black"    : "B/P",
    "phyrexian red"      : "R/P",
    "phyrexian green"    : "G/P",
    "phyrexian"          : "P",
    "variable colorless" : "X",
    "b"                  : "B",
    "u"                  : "U",
    "w"                  : "W",
    "r"                  : "R",
    "g"                  : "G",
    "x"                  : "X",
    "wp"                 : "W/P",
    "up"                 : "U/P",
    "bp"                 : "B/P",
    "rp"                 : "R/P",
    "gp"                 : "G/P",
    "white or blue"      : "W/U",
    "white or black"     : "W/B",
    "blue or red"        : "U/R",
    "blue or black"      : "U/B",
    "black or red"       : "B/R",
    "black or green"     : "B/G",
    "red or green"       : "R/G",
    "red or white"       : "R/W",
    "green or white"     : "G/W",
    "green or blue"      : "G/U",
    // Planechase Planes
    "chaos"              : "CHAOS",
    "[chaos]"            : "CHAOS",
    "planeswalk"         : "PW",
    // Unglued, Unhinged
    "100"                : "100",
    "500"                : "500",
    "1000000"            : "1000000",
    "infinite"           : "∞",
    "half a red"         : "hr"
};

var TEXT_TO_SYMBOL_MAP = {
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
    "o9"  : "9",
    "o0"  : "0",
    "{WP}" : "W/P",
    "{UP}" : "U/P",
    "{BP}" : "B/P",
    "{RP}" : "R/P",
    "{GP}" : "G/P"
};

var doubleFacedCardNames = [];

var ripSet = function(setName, cb) {
    winston.info("========================================");
    winston.info("Ripping Set: %s", setName);

    tiptoe(
        function getListHTML() {
            winston.info("Getting card lists...");

            getSetNameMultiverseIds(setName, this);
        },
        function processFirstBatch(multiverseids) {
            this.data.set = clone(C.SETS.find(function (SET) { return SET.name===setName; }));
            processMultiverseids(multiverseids, this);
        },
        function processVariations(cards) {
            winston.info("Processing variations...");

            this.data.set.cards = cards;
            var existing = cards.map(function (c) { return c.multiverseid; });
            var variations = flatten(cards.map(function (card) {
                return (card.variations && card.variations.length) ? card.variations : [];
            }));
            unique(variations);
            processMultiverseids(
                variations.filter(function (mvid) { return !existing.includes(mvid) }),
                this);
        },
        function addAdditionalFields(cards) {
            winston.info("Adding additional fields...");

            this.data.set.cards = this.data.set.cards.concat(cards).sort(shared.cardComparator);

            fillImageNames(this.data.set);

            this();
        },
        function fixCommanderIdentity() {
            winston.info("Fixing double-faced cards...");

            fixCommanderIdentityForCards(this.data.set.cards, this.parallel());
            fixCMC(this.data.set.cards, this.parallel());
        },
        function addForeignNames() {
            winston.info("Adding foreign names to cards...");

            addForeignNamesToCards(this.data.set.cards, this);
        },
        function addLegalities() {
            winston.info("Adding legalities to cards...");

            addLegalitiesToCards(this.data.set.cards, this);
        },
        function addPrintings() {
            winston.info("Adding printings to cards...");

            addPrintingsToCards(this.data.set, this);
        },
        function performCorrections() {
            winston.info("Doing set corrections...");
            shared.performSetCorrections(shared.getSetCorrections(this.data.set.code), this.data.set);

            this();
        },
        function compareToMagicCardsInfo() {
            if (!this.data.set.magicCardsInfoCode) {
                winston.warn("SKIPPING comparing to MagicCards.info (no MCI code)...");
                this();
            }
            else {
                winston.info("Comparing cards to MagicCards.info...");
                compareCardsToMCI(this.data.set, this);
            }
        },
        function compareToEssentialMagic() {
            if (!this.data.set.essentialMagicCode) {
                winston.warn("SKIPPING comparing to essentialmagic.com (no essentialMagicCode)...");
                this();
            }
            else {
                winston.info("Comparing cards to essentialmagic.com...");
                compareCardsToEssentialMagic(this.data.set, this);
            }
        },
        function finish(err) {
            if (err) {
                winston.error("Error ripping: %s (%s)", this.data.set.code, setName);
                return setImmediate(function () { cb(err); });
            }

            this.data.set.cards = this.data.set.cards.sort(shared.cardComparator);

            // Warn about missing fields
            this.data.set.cards.forEach(function (card) {
                if (!card.rarity)
                    winston.warn("Rarity not found for card: %s", card.name);
                if (!card.artist)
                    winston.warn("Artist not found for card: %s", card.name);
            });

            setImmediate(cb, err, this.data.set);
        }
    );
};

var processMultiverseDocs = function(docs, callback) {
    var cards = [];
    for(var i = 0; i < docs.length; i += 2) {
        var newCards = [];
        var multiverseDoc = docs[i];
        var printedMultiverseDoc = docs[i + 1];
        var multiverseDocCardParts = getCardParts(multiverseDoc);
        var printedMultiverseDocCardParts = getCardParts(printedMultiverseDoc);
        if (multiverseDocCardParts.length!==printedMultiverseDocCardParts.length) {
            throw new Error("multiverseDocCardParts length [" + multiverseDocCardParts.length + "] does not equal printedMultiverseDocCardParts length [" + printedMultiverseDocCardParts.length + "]");
        }

        multiverseDocCardParts.forEach(function (cardPart, i) {
            var newCard = processCardPart(multiverseDoc, cardPart, printedMultiverseDoc, printedMultiverseDocCardParts[i]);
            newCards.push(newCard);
        });

        if (newCards.length === 2 && (newCards[0].layout === "double-faced" || newCards[0].layout === "meld")) {
            var doubleFacedCardName = newCards[0].names.concat().sort().join(":::");
            if (!doubleFacedCardNames.includes(doubleFacedCardName))
                doubleFacedCardNames.push(doubleFacedCardName);
            else
                newCards = [];
        }

        cards = cards.concat(newCards);
    }
    if (callback)
        setImmediate(callback, null, cards);
};

var processMultiverseids = function (multiverseids, cb) {
    unique(multiverseids);
    var cards = [];
    doubleFacedCardNames = [];

    winston.info("Processing %d multiverseids", multiverseids.length);

    async.eachSeries(
        multiverseids,
        function (multiverseid, subcb) {
            tiptoe(
                function getMultiverseUrls() {
                    getURLsForMultiverseid(multiverseid, this);
                },
                function getMultiverseDocs(urls) {
                    urls.forEach(function (multiverseURL) {
                        shared.getURLAsDoc(multiverseURL, this.parallel());
                        shared.getURLAsDoc(multiverseURL.replace("printed=false", "printed=true"), this.parallel());
                    }.bind(this));
                },
                function () {
                    var docs = Array.prototype.slice.call(arguments);
                    processMultiverseDocs(docs, this);
                },
                function addToCards(newCards) {
                    newCards.map(function (c) {
                        if (c.multiverseid === null)
                            c.multiverseid = multiverseid;
                        cards.push(c);
                    });
                    //cards.concat(newCards); // Concat not working...?

                    this();
                },
                function finish(err) {
                    subcb(err);
                }
            );
        },
        function(err) { return setImmediate(cb, err, cards); });
};

var getCardPartIDPrefix = function(cardPart) {
    return "#" + cardPart.querySelector(".rightCol").getAttribute("id").replace(new RegExp("_rightCol", "g"), "");
};

var processCardPart = function(doc, cardPart, printedDoc, printedCardPart) {
    var card = {
        layout     : "normal",
        supertypes : [],
        type       : "",
        types      : [],
        colors     : []
    };

    var idPrefix = getCardPartIDPrefix(cardPart);
    var idPrefixPrinted = getCardPartIDPrefix(printedCardPart);

    // Multiverseid
    //console.log(idPrefix);
    var href_multiverseid = +querystring.parse(url.parse(cardPart.querySelector(idPrefix + "_setRow .value a").getAttribute("href")).query).multiverseid;
    if (href_multiverseid) {
        if (typeof(href_multiverseid) === 'string')
            href_multiverseid = href_multiverseid.trim();
        card.multiverseid = href_multiverseid;
    }
    else {
        card.multiverseid = null;
    }

    // Check for split card
    var fullCardName = getTextContent(doc.querySelector("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay")).trim();
    if (fullCardName.includes(" // ")) {
        card.layout = "split";
        card.names = fullCardName.split(" // ").filter(function (splitName) { return splitName.trim(); });
    }

    // Text
    var cardText = processTextBlocks(cardPart.querySelectorAll(idPrefix + "_textRow .value .cardtextbox")).trim();
    if (cardText && !card.type.toLowerCase().startsWith("basic land")) {
        card.text = cardText;
        if (card.text.includes("{UNKNOWN}"))
            winston.warn("Invalid symbol in oracle card text for card: %s", card.name);
    }

    if (cardText && cardText.toLowerCase().startsWith("level up {"))
        card.layout = "leveler";

    // Check for flip or double-faced card
    var cardParts = getCardParts(doc);
    if (cardParts.length === 2) {
        var firstCardText = processTextBlocks(cardParts[0].querySelectorAll(getCardPartIDPrefix(cardParts[0]) + "_textRow .value .cardtextbox")).trim().toLowerCase();
        var secondCardText = processTextBlocks(cardParts[1].querySelectorAll(getCardPartIDPrefix(cardParts[1]) + "_textRow .value .cardtextbox")).trim().toLowerCase();

        if (card.layout === 'split') {
            if (secondCardText.includes('aftermath')) card.layout = 'aftermath';
        }
        else {
            if (firstCardText.includes("flip"))
                card.layout = "flip";
            else if (firstCardText.includes("transform"))
                card.layout = "double-faced";
            else if (firstCardText.includes("meld"))
                card.layout = "meld";
            else {
                // Can't find a suitable match on the first card text. Let's search on the second...
                // TODO: This bunch of code needs to be optimized.
                if (secondCardText.includes("flip"))
                    card.layout = "flip";
                else if (secondCardText.includes("transform"))
                    card.layout = "double-faced";
                else {
                    winston.warn("Unknown card layout for multiverseid: %s", card.multiverseid);
                    winston.warn("card0 text: %s", firstCardText);
                    winston.warn("card1 text: %s", secondCardText);
                }
            }

            card.names = [
                getTextContent(cardParts[0].querySelector(getCardPartIDPrefix(cardParts[0]) + "_nameRow .value")).trim(),
                getTextContent(cardParts[1].querySelector(getCardPartIDPrefix(cardParts[1]) + "_nameRow .value")).trim()
            ];
        }
    }


    // Card Name
    //card.name = getTextContent(printedCardPart.querySelector(idPrefix + "_nameRow .value")).trim();
    card.name = getTextContent(cardPart.querySelector(idPrefix + "_nameRow .value")).trim();

    if (card.name.endsWith(" token card"))
        card.layout = "token";

    // Card Type
    var rawTypeFull = getTextContent(cardPart.querySelector(idPrefix + "_typeRow .value")).trim();
    if (rawTypeFull.trim().toLowerCase().startsWith("token "))
        card.layout = "token";
    fillCardTypes(card, rawTypeFull);

    // Original type
    card.originalType = getTextContent(printedCardPart.querySelector(idPrefixPrinted + "_typeRow .value")).trim().replace(new RegExp(" -", "g"), " —");

    if (card.originalType && card.originalType.toLowerCase().startsWith("token "))
        card.layout = "token";

    // Converted Mana Cost (CMC)
    var cardCMC = getTextContent(cardPart.querySelector(idPrefix + "_cmcRow .value")).trim();
    if (cardCMC)
        card.cmc = +cardCMC;

    // Rarity
    card.rarity = getTextContent(cardPart.querySelector(idPrefix + "_rarityRow .value")).trim();
    if (card.rarity==="Bonus")
        card.rarity = "Special";

    // Artist
    card.artist = getTextContent(cardPart.querySelector(idPrefix + "_artistRow .value a")).trim();

    // Power/Toughness or Loyalty
    var powerToughnessValue = getTextContent(cardPart.querySelector(idPrefix + "_ptRow .value")).trim();
    if (powerToughnessValue) {
        // Loyalty
        if (card.types.includes("Planeswalker")) {
            card.loyalty = +powerToughnessValue.trim();
        }
        else if (card.types.includes("Vanguard")) {
            var handLifeParts = powerToughnessValue.trim().strip("+)(").replace(new RegExp("Hand Modifier: ", "g"), "").replace(new RegExp("Life Modifier: ", "g"), "").split(",").map(function (a) { return a.trim(); });
            if (handLifeParts.length!==2) {
                winston.warn("Power toughness invalid [%s] for card: %s", getTextContent(cardPart.querySelector(idPrefix + "_ptRow .value")).trim(), card.name);
            }
            else {
                card.hand = parseInt(handLifeParts[0], 10);
                card.life = parseInt(handLifeParts[1], 10);
            }
        }
        else {
            // Power/Toughness
            Object.forEach(POWER_TOUGHNESS_REPLACE_MAP, function(find, replace) {
                powerToughnessValue = powerToughnessValue.replace(new RegExp(find, "g"), replace);
            });

            var powerToughnessParts = powerToughnessValue.split("/");
            if (powerToughnessParts.length!==2) {
                winston.warn("Power toughness invalid [%s] for card: %s", getTextContent(cardPart.querySelector(idPrefix + "_ptRow .value")).trim(), card.name);
            }
            else {
                card.power = powerToughnessParts[0].trim();
                card.toughness = powerToughnessParts[1].trim();
            }
        }
    }

    // Mana Cost
    var cardManaCosts = Array.from(cardPart.querySelectorAll(idPrefix + "_manaRow .value img")).map(function (o) { return processSymbol(o.getAttribute("alt")); });
    var cardManaCost = cardManaCosts.join("");
    if (cardManaCost)
        card.manaCost = cardManaCost;

    // Colors
    fillCardColors(card);

    var cardColorIndicators = getTextContent(cardPart.querySelector(idPrefix + "_colorIndicatorRow .value")).trim().toLowerCase().split(",").map(function (cardColorIndicator) { return cardColorIndicator.trim(); }) || [];
    cardColorIndicators.forEach(function (cardColorIndicator) {
        if (cardColorIndicator && COLOR_ORDER.includes(cardColorIndicator))
            card.colors.push(cardColorIndicator);
    });

    sortCardColors(card);

    // Original Printed Text
    var originalCardText = processTextBlocks(printedCardPart.querySelectorAll(idPrefixPrinted + "_textRow .value .cardtextbox")).trim();
    if (originalCardText) {
        card.originalText = originalCardText;
        if (card.originalText.includes("{UNKNOWN}"))
            winston.warn("Invalid symbol in printed card text for card: %s", card.name);
    }

    // Flavor Text
    var cardFlavor = processTextBlocks(cardPart.querySelectorAll(idPrefix + "_flavorRow .value .flavortextbox")).trim();
    if (!cardFlavor)
        cardFlavor = processTextBlocks(cardPart.querySelectorAll(idPrefix + "_flavorRow .value .cardtextbox")).trim();

    if (cardFlavor)
        card.flavor = cardFlavor;

    // Card Number
    var cardNumberValue = getTextContent(cardPart.querySelector(idPrefix + "_numberRow .value")).trim();
    if (cardNumberValue) {
        if (card.layout === "split")
            cardNumberValue = cardNumberValue.replace(/[^\d.]/g, "") + ["a", "b"][card.names.indexOf(card.name)];

        card.number = cardNumberValue;
    }

    // Watermark
    var cardWatermark = processTextBlocks(cardPart.querySelectorAll(idPrefix + "_markRow .value .cardtextbox")).trim();
    if (cardWatermark)
        card.watermark = cardWatermark;

    // Rulings
    var rulingRows = cardPart.querySelectorAll(idPrefix + "_rulingsContainer table tr.post");
    if (rulingRows.length) {
        card.rulings = Array.from(rulingRows).map(function (rulingRow) {
            return({
                date : moment(getTextContent(rulingRow.querySelector("td:first-child")).trim(), "MM/DD/YYYY").format("YYYY-MM-DD"),
                text : getTextContent(rulingRow.querySelector("td:last-child")).innerTrim().trim()
            });
        });

        var seenRulings = [];
        card.rulings = card.rulings.reverse().filter(function (ruling) {
            if (seenRulings.includes(ruling.text)) { return false; }
            seenRulings.push(ruling.text);
            return true;
        }).reverse();
    }

    // Variations
    if (card.layout !== "split" && card.layout !== "double-faced" && card.layout !== "flip" && card.layout !== "meld") {
        var variationLinks = cardPart.querySelectorAll(idPrefix + "_variationLinks a.variationLink");
        if (variationLinks.length)
            card.variations = Array.from(variationLinks).map(function (variationLink) { return +variationLink.getAttribute("id").trim(); }).filter(function (variation) { return variation!==card.multiverseid; });
    }

    return card;
};

var getCardParts = function (doc) {
    return Array.from(doc.querySelectorAll("table.cardDetails"));
};

var getURLsForMultiverseid = function (multiverseid, cb) {
    var docUrl = shared.buildMultiverseURL(multiverseid);
    var printedUrl = docUrl.replace("printed=false", "printed=true");

    tiptoe(
        function getDefaultDoc() {
            shared.getURLAsDoc(docUrl, this.parallel());
            shared.getURLAsDoc(printedUrl, this.parallel());
        },
        function processDefaultDoc(err, doc, printedDoc) {
            if (err)
                return setImmediate(cb, err);

            var urls = [];

            var cardParts = getCardParts(doc);
            var printedCardParts = getCardParts(printedDoc);
            if (cardParts.length !== printedCardParts.length) {
                var errorString = "multiverseid [" + multiverseid + "] cardParts length [" + cardParts.length + "] does not equal printedCardParts length [" + printedCardParts.length + "]";
                errorString += '\noracle url: ' + docUrl;
                errorString += '\nprinted url: ' + printedUrl;
                throw new Error(errorString);
            }

            urls.push(shared.buildMultiverseURL(multiverseid));
            unique(urls);

            setImmediate(cb, null, urls);
        }
    );
};

var addForeignNamesToCards = function (cards, cb) {
    async.each(
        cards,
        function(card, subcb) {
            addForeignNamesToCard(card, subcb);
        },
        cb);
};

var addForeignNamesToCard = function (card, cb) {
    if (!card.multiverseid)
        return setImmediate(cb);

    tiptoe(
        function fetchLanguagePage() {
            shared.getURLAsDoc(shared.buildMultiverseLanguagesURL(card.multiverseid), this);
        },
        function processLanguages(doc) {
            delete card.foreignNames;
            card.foreignNames = [];

            Array.from(doc.querySelectorAll("table.cardList tr.cardItem")).forEach(function (cardRow) {
                var language = getTextContent(cardRow.querySelector("td:nth-child(2)")).trim();
                var foreignCardName = getTextContent(cardRow.querySelector("td:nth-child(1) a")).innerTrim().trim();
                if (foreignCardName.startsWith("XX"))
                    foreignCardName = foreignCardName.substring(2);

                if (foreignCardName.includes("//")) {
                    if (!card.hasOwnProperty("names")) {
                        winston.error("Card [%s] (%d) has foreignCardName [%s] but has no 'names' property.", card.name, card.multiverseid, foreignCardName);
                        process.exit(0);
                    }

                    foreignCardName = foreignCardName.split("//").map(function (part) { return part.trim(); })[card.names.indexOf(card.name)];
                }

                if (language && foreignCardName) {
                    var languageHref = cardRow.querySelector("td:nth-child(1) a").getAttribute("href");
                    var foreignMultiverseid = querystring.parse(languageHref.substring(languageHref.indexOf("?")+1)).multiverseid;
                    card.foreignNames.push({language : language, name : foreignCardName, multiverseid : +foreignMultiverseid});
                }
            });

            if (card.foreignNames.length === 0)
                delete card.foreignNames;

            this();
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var addLegalitiesToCards = function (cards, cb) {
    async.each(
        cards,
        function(card, subcb) {
            addLegalitiesToCard(card, subcb);
        },
        cb);
};

var addLegalitiesToCard = function (card, cb) {
    tiptoe(
        function getFirstPage() {
            shared.getURLAsDoc(shared.buildMultiverseLegalitiesURL(card.multiverseid), this);
        },
        function processLegalities(doc) {
            delete card.legalities;
            card.legalities = [];

            if (typeof doc.querySelectorAll("table.cardList")[1] === "undefined") {
                console.log("invalid printings for " + card.multiverseid);
            }
            Array.from(doc.querySelectorAll("table.cardList")[1].querySelectorAll("tr.cardItem")).forEach(function (cardRow) {
                var format = getTextContent(cardRow.querySelector("td:nth-child(1)")).trim();
                var legality = getTextContent(cardRow.querySelector("td:nth-child(2)")).trim();
                var condition = getTextContent(cardRow.querySelector("td:nth-child(3)")).trim();
                if (format && legality) {
                    var legalityObject = {format:format, legality:legality};
                    if (condition && condition.length>0)
                        legalityObject.condition = condition;

                    card.legalities.push(legalityObject);
                }
            });

            if (card.legalities.length===0)
                delete card.legalities;

            this();
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var addPrintingsToCards = function (set, cb) {
    tiptoe(
        function loadNonGathererJSON() {
            var setCodes = C.SETS.map(function (SET) { return SET.code; });
            // Adds non-gatherer sets and promo MCI sets and sets released since last printing to the current set
            var nonGathererSets = unique(C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes()).concat(setCodes.slice(setCodes.indexOf(C.LAST_PRINTINGS_RESET)+1)));
            nonGathererSets.remove(set.code);
            async.mapSeries(
                nonGathererSets,
                function (code, subcb) {
                    fs.readFile(path.join(__dirname, "..", "json", code + ".json"), "utf8", subcb);
                },
                this);
        },
        function addPrintings(nonGathererSetsJSONRaw) {
            var nonGathererSets = nonGathererSetsJSONRaw.map(function (nonGathererSetJSONRaw) { return JSON.parse(nonGathererSetJSONRaw); });

            async.eachSeries(
                set.cards,
                function (card, subcb) {
                    addPrintingsToCard(nonGathererSets, card, subcb);
                },
                this);
        },
        function finish(err) {
            setImmediate(function () { cb(err); });
        }
    );
};

var addPrintingsToCard = function (nonGathererSets, card, cb) {
    tiptoe(
        function getFirstPage() {
            shared.getURLAsDoc(shared.buildMultiversePrintingsURL(card.multiverseid, 0), this);
        },
        function getAllPages(doc) {
            var numPages = shared.getPagingNumPages(doc, "printings");
            for (var i = 0; i < numPages; i++) {
                shared.getURLAsDoc(shared.buildMultiversePrintingsURL(card.multiverseid, i), this.parallel());
            }
        },
        function processPrintings() {
            var docs = Array.prototype.slice.apply(arguments);

            var printings = [];
            docs.forEach(function (doc) {
                if (typeof doc.querySelectorAll("table.cardList")[0] === "undefined") {
                    console.log("invalid printings for " + card.multiverseid);
                }
                Array.from(doc.querySelectorAll("table.cardList")[0].querySelectorAll("tr.cardItem")).forEach(function (cardRow) {
                    var printing = getTextContent(cardRow.querySelector("td:nth-child(3)")).trim();
                    if (printing && !C.IGNORE_GATHERER_PRINTINGS.includes(printing))
                        printings.push(shared.getSetCodeFromName(printing));
                });
            });

            delete card.printings;

            nonGathererSets.forEach(function (nonGathererSet) {
                if (nonGathererSet.cards.map(function (extraSetCard) { return extraSetCard.name; }).includes(card.name))
                    printings.push(nonGathererSet.code);
            });

            card.printings = printings;

            this();
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var fillCardTypes = function (card, rawTypeFull) {
    // Some gatherer entries have a regular dash instead of a 'long dash'
    if (!rawTypeFull.includes("—") && rawTypeFull.includes(" - "))  {
        winston.warn("Raw type for card [%s] does not contain a long dash for type [%s] but does contain a small dash surrounded by spaces ' - '. Auto-correcting!", card.name, rawTypeFull);
        rawTypeFull = rawTypeFull.replace(" - ", "—");
    }
    var rawTypes = rawTypeFull.split(/[—]/);
    rawTypes[0].split(" ").filter(Boolean).forEach(function (rawType, i) {
        if (rawType.trim().toLowerCase()==="(none)" || rawType.trim().toLowerCase()==="token")
            return;

        card.type += (i>0 ? " " : "") + rawType;

        if (rawType==="Summon")
            rawType = "Creature";

        rawType = rawType.trim().toProperCase();
        if (C.SUPERTYPES.includes(rawType))
            card.supertypes.push(rawType);
        else if (C.TYPES.includes(rawType))
            card.types.push(rawType);
        else
            winston.warn("Raw type not found [%s] for card: %s", rawType, card.name);
    });
    if (rawTypes.length>1) {
        card.subtypes = card.types.includes("Plane") ? [rawTypes[1].trim()] : rawTypes[1].split(" ").filter(Boolean).map(function (subtype) { return subtype.trim(); });    // 205.3b Planes have just a single subtype
        card.type += " — " + card.subtypes.join(" ");
    }
    if (!card.supertypes.length)
        delete card.supertypes;
    if (!card.types.length)
        delete card.types;

    if (card.types) {
        if (card.types.includes("Plane"))
            card.layout = "plane";
        else if (card.types.includes("Scheme"))
            card.layout = "scheme";
        else if (card.types.includes("Phenomenon"))
            card.layout = "phenomenon";

        if (card.types.map(function (type) { return type.toLowerCase(); }).includes("vanguard"))
            card.layout = "vanguard";
    }
};

var fillCardColors = function (card) {
    if (!card.manaCost)
        return;

    card.manaCost.split("").forEach(function (manaCost) {
        Object.forEach(COLOR_SYMBOL_TO_NAME_MAP, function (colorSymbol, colorName) {
            if (manaCost.includes(colorSymbol))
                card.colors.push(colorName);
        });
    });
};

var fillImageNames = function (set) {
    // Image Name
    var cardNameCounts = {};
    set.cards.forEach(function (card) {
        if (!cardNameCounts.hasOwnProperty(card.name))
            cardNameCounts[card.name] = 0;
        else
            cardNameCounts[card.name]++;
    });

    Object.forEach(cardNameCounts, function (key, val) {
        if (val===0)
            delete cardNameCounts[key];
        else
            cardNameCounts[key]++;
    });

    var setCorrections = shared.getSetCorrections(set.code);

    set.cards.forEach(function (card) {
        card.imageName = unidecode((card.layout==="split" ? card.names.join("") : card.name));

        if (cardNameCounts.hasOwnProperty(card.name)) {
            var imageNumber = cardNameCounts[card.name]--;

            var numberOrderCorrection = setCorrections.find(function(setCorrection) {
                return setCorrection.renumberImages===card.name
            });
            if (numberOrderCorrection)
                imageNumber = numberOrderCorrection.order.indexOf(card.multiverseid)+1;

            card.imageName += imageNumber;
        }

        card.imageName = card.imageName.replace(new RegExp("/", "g"), " ");

        card.imageName = card.imageName.strip(":\"?").replace(new RegExp(" token card", "g"), "").toLowerCase();
    });
};

var sortCardColors = function (card) {
    card.colors = unique(card.colors).sort(function (a, b) { return COLOR_ORDER.indexOf(a)-COLOR_ORDER.indexOf(b); }).map(function (color) { return color.toProperCase(); });
    if (card.colors.length===0)
        delete card.colors;
};

var compareCardsToMCI = function(set, cb) {
    tiptoe(
        function getSetCardList() {
            shared.getURLAsDoc("http://magiccards.info/" + set.magicCardsInfoCode.toLowerCase() + "/en.html", this);
        },
        function processSetCardList(listDoc) {
            var mciCardLinks = Array.from(listDoc.querySelectorAll("table tr td a"));
            async.each(set.cards, function (card, subcb) {
                if (card.variations) {
                    winston.warn("VARIATIONS: Could not find MagicCards.info match for card: %s", card.name);
                    return setImmediate(subcb);
                }
                if (card.layout==="token") {
                    winston.warn("TOKEN: Cannot match MagicCards.info for token: %s", card.name);
                    return setImmediate(subcb);
                }

                var mciCardLink = mciCardLinks.filter(function (link) {
                    var name = link.textContent.trim();
                    name = name.replace(new RegExp("Æ", "g"), "Ae").replace(new RegExp("“", "g"), "\"").replace(new RegExp("”", "g"), "\"");
                    return name.toLowerCase() === createMCICardName(card).toLowerCase();
                });
                if (card.layout==="meld")
                    mciCardLink = mciCardLinks.filter(function (link) { return link.getAttribute("href").indexOf('/' + card.number) !== -1; });
                if (mciCardLink.length!==1) {
                    winston.warn("MISSING: Could not find MagicCards.info match for card: %s", card.name);
                    return setImmediate(subcb);
                }

                compareCardToMCI(set, card, mciCardLink[0].getAttribute("href"), subcb);
            }, this);
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var createMCICardName = function(card) {
    if (card.layout==="split")
        return card.name + " (" + card.names.join("/") + ")";

    return card.name;
};

var normalizeFlavor = function(flavor) {
    flavor = unidecode(flavor).trim().replace(new RegExp("\n", "g"), " ").innerTrim().replace(new RegExp(" —", "g"), "—");
    while (flavor.includes(". .")) { flavor = flavor.replace(new RegExp("[.] [.]", "g"), ".."); }
    while (flavor.includes(" .")) { flavor = flavor.replace(new RegExp(" [.]", "g"), "."); }
    while (flavor.includes(". ")) { flavor = flavor.replace(new RegExp("[.] ", "g"), "."); }

    return flavor;
};

var getMCINumber = function(mciCardURL) {
    return mciCardURL.replace(/.*\/([1-9][0-9]*[a-z]?)\.html/, '$1');
};

var compareCardToMCI = function(set, card, mciCardURL, cb) {
    var cardCorrection = null;
    if (C.SET_CORRECTIONS.hasOwnProperty(set.code)) {
        C.SET_CORRECTIONS[set.code].forEach(function (setCorrection) {
            if (!setCorrection.hasOwnProperty("match") || !setCorrection.match.hasOwnProperty("name"))
                return;

            if ((typeof setCorrection.match.name==="string" && setCorrection.match.name===card.name) || (Array.isArray(setCorrection.match.name) && setCorrection.match.name.includes(card.name)))
                cardCorrection = setCorrection;
        });
    }

    var hasFlavorCorrection = false;
    if (cardCorrection && ((cardCorrection.replace && cardCorrection.replace.flavor) || cardCorrection.fixFlavorNewlines || cardCorrection.flavorAddDash || cardCorrection.flavorAddExclamation))
        hasFlavorCorrection = true;

    var hasArtistCorrection = false;
    if (cardCorrection && cardCorrection.replace && cardCorrection.replace.artist)
        hasArtistCorrection = true;

    var mciNumber = getMCINumber(mciCardURL);
    var mciURL = "http://magiccards.info" + mciCardURL;

    tiptoe(
        function getMCICardDoc() {
            shared.getURLAsDoc(mciURL, this);
        },
        function compareProperties(mciCardDoc) {
            card.mciNumber = mciNumber;
            // Compare flavor
            if (!hasFlavorCorrection) {
                if (!C.SET_CORRECTIONS.hasOwnProperty(set.code) || C.SET_CORRECTIONS[set.code]) {
                    var cardFlavor = normalizeFlavor(card.flavor || "");
                    var mciFlavor;
                    if (mciCardDoc)
                        mciFlavor = normalizeFlavor(processTextBlocks([mciCardDoc.querySelector("table tr td p i")]));
                    if (!mciFlavor && cardFlavor)
                        winston.warn("FLAVOR: %s (%s) has flavor but MagicCardsInfo (%s) does not.", card.name, card.multiverseid, mciCardURL);
                    else if (mciFlavor && !cardFlavor)
                        winston.warn("FLAVOR: %s (%s) does not have flavor but MagicCardsInfo (%s) does.", card.name, card.multiverseid, mciCardURL);
                    else if (mciFlavor!==cardFlavor)
                        winston.warn("FLAVOR: %s (%s) flavor does not match MagicCardsInfo (%s).\n%s", card.name, card.multiverseid, mciCardURL, ansidiff.words(cardFlavor, mciFlavor));
                }
            }

            // Compare artist
            if (!hasArtistCorrection) {
                var mciArtist;
                if (mciCardDoc) {
                    mciArtist = mciCardDoc.querySelectorAll("table tr td p").filter(
                        function (p) {
                            return p.textContent.startsWith("Illus.");
                        }
                    );
                    if (mciArtist.length === 0) {
                        winston.error('no MCIArtist! for url %s (cache: %s)', mciCardURL, shared.cache.cachname(mciURL));
                        shared.cache.delete(mciURL);
                        mciArtist = null;
                    }
                    else {
                        mciArtist = mciArtist[0].textContent.substring(7).trim().replace(new RegExp("\n", "g"), " ").replace(new RegExp(" and ", "g"), " & ").innerTrim();
                    }
                }
                var cardArtist = (card.artist || "").trim().replace(new RegExp("\n", "g"), " ").innerTrim();
                if (!mciArtist && cardArtist)
                    winston.warn("ARTIST: %s (%s) has artist but MagicCardsInfo (%s) does not.", card.name, card.multiverseid, mciCardURL);
                else if (mciArtist && !cardArtist)
                    winston.warn("ARTIST: %s (%s) does not have artist but MagicCardsInfo (%s) does.", card.name, card.multiverseid, mciCardURL);
                else if (mciArtist!==cardArtist && !C.ARTIST_CORRECTIONS.hasOwnProperty(cardArtist))
                    winston.warn("ARTIST: %s (%s) artist does not match MagicCardsInfo (%s).\n%s", card.name, card.multiverseid, mciCardURL, ansidiff.words(cardArtist, mciArtist));
            }

            this();
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var compareCardsToEssentialMagic = function(set, cb) {
    tiptoe(
        function getSetCardList() {
            shared.getURLAsDoc("http://www.essentialmagic.com/cardsets/Spoiler.asp?ID=" + set.essentialMagicCode, this);
        },
        function processSetCardList(listDoc) {
            var nameToEssentialFlavor = {};
            Array.from(listDoc.querySelectorAll("table td#contentarea div#main table tr")).forEach(function (cardRow) {
                var cardName = processTextBlocks([cardRow.querySelector("td:nth-child(2) b a")]).innerTrim().trim();
                if (!cardName) {
                    winston.warn("Missing card name: %s", cardRow.innerHTML);
                    return;
                }
                nameToEssentialFlavor[cardName] = normalizeFlavor(processTextBlocks(cardRow.querySelectorAll("td:nth-child(2) i")));
            });
            this(null, nameToEssentialFlavor);
        },
        function compareSetCardList(nameToEssentialFlavor) {
            set.cards.forEach(function(card) {
                var cardCorrection = null;
                if (C.SET_CORRECTIONS.hasOwnProperty(set.code)) {
                    C.SET_CORRECTIONS[set.code].forEach(function (setCorrection) {
                        if (!setCorrection.hasOwnProperty("match") || !setCorrection.match.hasOwnProperty("name"))
                            return;

                        if ((typeof setCorrection.match.name === "string" && setCorrection.match.name === card.name) || (Array.isArray(setCorrection.match.name) && setCorrection.match.name.includes(card.name)))
                            cardCorrection = setCorrection;
                    });
                }

                var hasFlavorCorrection = false;
                if (cardCorrection && ((cardCorrection.replace && cardCorrection.replace.flavor) || cardCorrection.fixFlavorNewlines || cardCorrection.flavorAddDash || cardCorrection.flavorAddExclamation))
                    hasFlavorCorrection = true;

                // Compare flavor
                if (!hasFlavorCorrection) {
                    if (C.ALLOW_ESSENTIAL_FLAVOR_MISMATCH.hasOwnProperty(set.code) && (C.ALLOW_ESSENTIAL_FLAVOR_MISMATCH[set.code].includes(card.multiverseid) || C.ALLOW_ESSENTIAL_FLAVOR_MISMATCH[set.code].includes(card.name)))
                        return;

                    var cardFlavor = normalizeFlavor(card.flavor || "");
                    var essentialFlavor = nameToEssentialFlavor[card.name];
                    if (!essentialFlavor && cardFlavor)
                        winston.warn("FLAVOR: %s (%s) has flavor but essentialMagic does not.", card.name, card.multiverseid);
                    else if (essentialFlavor && !cardFlavor)
                        winston.warn("FLAVOR: %s (%s) does not have flavor but essentialMagic does.", card.name, card.multiverseid);
                    else if (essentialFlavor !== cardFlavor)
                        winston.warn("FLAVOR: %s (%s) flavor does not match essentialMagic.\n%s", card.name, card.multiverseid, ansidiff.words(cardFlavor, essentialFlavor));
                }
            });
            this();
        },
        function finish(err) {
            setImmediate(cb, err);
        }
    );
};

var ripMCISet = function(set, cb) {
    winston.info("========================================");
    winston.info("Ripping set: %s (%s)", set.name, set.code);

    tiptoe(
        function getCardList() {
            shared.getURLAsDoc("http://magiccards.info/" + set.magicCardsInfoCode.toLowerCase() + "/en.html", this);
        },
        function processCardList(listDoc) {
            var mciCardLinks = Array.from(listDoc.querySelectorAll("table tr td a"));
            var cards = [];
            var self = this;

            async.each(mciCardLinks, function(mciCardLink, subcb) {
                var href = mciCardLink.getAttribute("href");
                if (!href || !href.startsWith("/" + set.magicCardsInfoCode.toLowerCase() + "/en/"))
                    return setImmediate(subcb);

                ripMCICard(set, href, function(err, card) {
                    if (err) throw(err);
                    cards.push(card);
                    subcb();
                });
            }, function(err) {
                if (err) throw(err);
                self(null, cards);
            });
        },
        function addAdditionalFields(cards) {
            winston.info("Adding additional fields...");

            set.cards = cards.filter(Boolean).sort(shared.cardComparator);
            fillImageNames(set);
            addMagicLibraritiesInfoToMCISet(set, this);
        },
        function applyLatestOracleFields() {
            winston.info("Applying latest oracle fields to MCI cards...");

            var oracleCards = {};
            var excludeSets = C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes());
            C.SETS.map(function (SET) { return SET.code; }).filter(function(set) { return !excludeSets.includes(set); }).reverse().forEach(function (SETCODE) {
                JSON.parse(fs.readFileSync(path.join(__dirname, "..", "json", SETCODE + ".json"))).cards.forEach(function (card) {
                    if (oracleCards.hasOwnProperty(card.name))
                        return;

                    oracleCards[card.name] = card;
                });
            });

            set.cards.forEach(function (card) {
                C.ORACLE_FIELDS.forEach(function (oracleField) {
                    if (!oracleCards.hasOwnProperty(card.name))
                        return;

                    if (!oracleCards[card.name].hasOwnProperty(oracleField)) {
                        delete card[oracleField];
                        return;
                    }

                    card[oracleField] = oracleCards[card.name][oracleField];
                });
            });

            this();
        },
        function fixCommanderIdentity() {
            winston.info("Fixing color identity...");

            fixCommanderIdentityForCards(set.cards, this.parallel());
            fixCMC(set.cards, this.parallel());
        },
        function performCorrections() {
            winston.info("Doing set corrections...");
            shared.performSetCorrections(shared.getSetCorrections(set.code), set);

            this();
        },
        function addPrintings() {
            if (fs.existsSync(path.join(__dirname, "..", "json", set.code + ".json"))) {
                winston.info("Updating printings...");
                addPrintingsToMCISet(set, this);
            }
            else {
                winston.warn("RUN ONE MORE TIME FOR PRINTINGS!");
                this();
            }
        },
        function finalizePrintings() {
            winston.info("Cleaning up duplicate printings.");
            set.cards.forEach(shared.finalizePrintings);
            this();
        },
        function finish(err) {
            if (err) {
                winston.error("Error ripping: %s", set.name);
                return setImmediate(function () { cb(err); });
            }

            set.cards = set.cards.sort(shared.cardComparator);

            // Warn about missing fields
            set.cards.forEach(function (card) {
                if (!card.rarity)
                    winston.warn("Rarity not found for card: %s", card.name);
                if (!card.artist)
                    winston.warn("Artist not found for card: %s", card.name);
            });

            //winston.info("Other Printings: %s", (flatten(this.data.set.cards.map(function (card) { return card.printings; })).filter(util.uniqueFilter).map(function (setName) { return C.SETS.mutateOnce(function (SET) { return SET.name===setName ? SET.code : undefined; }); }).remove(this.data.set.code) || []).join(" "));

            setImmediate(cb, err, set);
        }
    );
};

var ripMCICard = function(set, mciCardURL, cb) {
    tiptoe(
        function getMCICardDoc() {
            shared.getURLAsDoc("http://magiccards.info" + mciCardURL, this);
        },
        function compareProperties(mciCardDoc) {
            var card = {
                layout     : "normal",
                supertypes : [],
                type       : "",
                types      : [],
                colors     : []
            };

            card.mciNumber = getMCINumber(mciCardURL);

            var cardNameElement = mciCardDoc.querySelector("a[href=\"" + mciCardURL + "\"]");
            if (!cardNameElement)
                throw new Error("No valid card name element for: " + mciCardURL);
            var leftSide = cardNameElement.parentNode.parentNode;
            var rightSide = leftSide.nextElementSibling;

            // Card Name
            card.name = getTextContent(cardNameElement).trim();

            var cardNameParts = card.name.match(/^([^(]+)\(([^/]+)\/([^)]+)\)$/);
            if (cardNameParts && cardNameParts.length === 4) {
                card.name = cardNameParts[1].trim();
                card.names = cardNameParts.slice(2).map(function (name) { return name.trim(); });
                card.layout = "split";
            }

            // winston.info("Processing: %s", card.name);

            // Card Rarity
            var inEditions = false;
            var rightSideBs = Array.from(rightSide.querySelectorAll("b"));
            for (var i = 0; i < rightSideBs.length; i++) {
                var b = rightSideBs[i];
                if (b.textContent.startsWith("Editions")) {
                    inEditions = true;
                    continue;
                }
                if (inEditions) {
                    card.rarity = b.textContent.replace(/[^(]+\(([^)]+)\)/, "$1", "g");
                    break;
                }
            }

            var cardInfoRaw = getTextContent(cardNameElement.parentNode.nextElementSibling).innerTrim().trim();
            var colorIndicator = null;
            var colorIndicatorParts = cardInfoRaw.match(/\(Color Indicator: ([^)]+)\)/);
            if (colorIndicatorParts && colorIndicatorParts.length === 2) {
                colorIndicator = colorIndicatorParts[1];
                cardInfoRaw = cardInfoRaw.replace("(Color Indicator: " + colorIndicator + ")", "");
            }

            var cardInfoParts = cardInfoRaw.match(/^([^0-9*,(]+)\(?([^/:]*)\:?\/?([^,)]*)\)?, ([^(]*)\(?([^)]*)\)?$/);
            if (!cardInfoParts)
                cardInfoParts = cardInfoRaw.match(/^([^0-9*,(]+)\(?([^/:]*)\:?\/?([^,)]*)\)?,? ?([^(]*)\(?([^)]*)\)?$/);
            if (!cardInfoParts || cardInfoParts.length!==6) {
                winston.warn("Unable to get cardInfoParts from card [%s]: %s", card.name, getTextContent(cardNameElement.parentNode.nextElementSibling).innerTrim().trim());
                throw new Error("Card failed");
            }
            cardInfoParts = cardInfoParts.map(function (cardInfoPart) { return cardInfoPart.trim(); });

            // Card Type
            fillCardTypes(card, cardInfoParts[1]);

            // Power/Toughness or Loyalty
            if (cardInfoParts[2]==="Loyalty") {
                card.loyalty = +(cardInfoParts[3] || "0");
            }
            else if (cardInfoParts[2].length > 0 && cardInfoParts[3].length > 0) {
                card.power = cardInfoParts[2];
                card.toughness = cardInfoParts[3];
            }

            // Converted Mana Cost (CMC)
            if (cardInfoParts[5].trim().length>0)
                card.cmc = +cardInfoParts[5];

            // Mana Cost
            var manaRegex = /{([^}]+)}/g;
            var manaCostRaw = cardInfoParts[4];
            var manaParts = (manaCostRaw.match(manaRegex) || []).map(function (manaPart) { return manaPart.strip("{}"); });
            if (SYMBOL_CONVERSION_MAP.hasOwnProperty(manaCostRaw))
                card.manaCost = processSymbol(manaCostRaw);
            else
                card.manaCost = manaCostRaw.replace(manaRegex, ".").split("").map(function (manaSymbol) { return processSymbol(manaSymbol==="." ? manaParts.shift() : manaSymbol); }).join("");
            if (!card.manaCost)
                delete card.manaCost;

            if (!card.hasOwnProperty("cmc") && card.manaCost==="{0}")
                card.cmc = 0;

            // Colors
            fillCardColors(card);
            sortCardColors(card);

            if (colorIndicator)
                card.colors = [colorIndicator];

            // Text
            card.text = processTextBlocks(cardNameElement.parentNode.nextElementSibling.nextElementSibling);
            if (card.text) {
                if (card.text.toLowerCase().startsWith("level up {"))
                    card.layout = "leveler";
                else if (card.text.toLowerCase().includes("flip"))
                    card.layout = "flip";
                else if (card.text.toLowerCase().includes("transform"))
                    card.layout = "double-faced";
                else if (card.text.toLowerCase().includes("meld"))
                    card.layout = 'meld';
            }
            card.text.replace(new RegExp("{UP}", "g"), "{U/P}").replace(new RegExp("{BP}", "g"), "{B/P}").replace(new RegExp("{RP}", "g"), "{R/P}").replace(new RegExp("{GP}", "g"), "{G/P}").replace(new RegExp("{WP}", "g"), "{W/P}");

            // Replace MCI ascii dashes with minus sines in planeswalker abilities
            if (card.types.includes("Planeswalker"))
                card.text = card.text.split("\n").map(function (textLine) { if (textLine.startsWith("-")) { textLine = textLine.replaceCharAt(0, "−"); } return textLine; }).join("\n");

            // Flavor Text
            var cardFlavorText = processTextBlocks(cardNameElement.parentNode.nextElementSibling.nextElementSibling.nextElementSibling);
            if (cardFlavorText)
                card.flavor = cardFlavorText;

            // Artist
            var cardArtist = getTextContent(cardNameElement.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling).trim();
            if (cardArtist.startsWith("Illus."))
                card.artist = cardArtist.substring("Illus.".length+1);

            // Rulings and Legalities
            var rulingLegalityElements = Array.from(cardNameElement.parentNode.parentNode.querySelectorAll("ul"));
            if (rulingLegalityElements && rulingLegalityElements.length>=1) {
                if (rulingLegalityElements[0].querySelector("li[class=\"reserve\"]"))
                    rulingLegalityElements.shift();

                var legalityElementsContainer = rulingLegalityElements[0];
                if (rulingLegalityElements.length===2) {
                    legalityElementsContainer = rulingLegalityElements[1];

                    // Rulings
                    card.rulings = Array.from(rulingLegalityElements[0].querySelectorAll("li")).map(function (rulingElement) { var rulingDate = getTextContent(rulingElement.querySelector("b")).trim(); return { date : moment(rulingDate, "MM/DD/YYYY").format("YYYY-MM-DD"), text : processTextBlocks(rulingElement).trim().substring(rulingDate.length+2) }; });
                }

                // Legalities
                var legalityElements = legalityElementsContainer.querySelectorAll("li");
                if (legalityElements && legalityElements.length>0)
                    card.legalities = Array.from(legalityElements).map(function (legalityElement) { var legalityParts = getTextContent(legalityElement).match(/^([^ ]+) in ([^(]+).*$/); if (!legalityParts) { return null; } return {format:legalityParts[2].trim(), legality:legalityParts[1].trim()}; }).filter(Boolean);
            }

            // Number
            var cardNumber = getTextContent(rightSide.querySelector("small > b")).trim().replace(/^#([^ ]+) .*$/, "$1").trim();
            if (cardNumber)
                card.number = cardNumber;

            // Foreign Names
            var cardForeignNames = [];
            var languagesLine = Array.from(rightSide.querySelectorAll("small u b")).find(function (b) { return getTextContent(b).startsWith("Languages"); }).parentNode;
            var languageElement = languagesLine.nextElementSibling;
            var cardForeignName = {};
            do
            {
                if (languageElement.nodeName.toLowerCase()==="img") {
                    cardForeignName.language = languageElement.getAttribute("alt");
                }
                else if (languageElement.nodeName.toLowerCase()==="a") {
                    if (cardForeignName.hasOwnProperty("language")) {
                        cardForeignName.name = getTextContent(languageElement).trim();
                        cardForeignNames.push(cardForeignName);
                    }
                    cardForeignName = {};
                }

                languageElement = languageElement.nextElementSibling;
            } while(languageElement);

            if (cardForeignNames.length>0) {
                cardForeignNames.forEach(function (cardForeignName) {
                    if (C.MCI_LANGUAGE_TO_GATHERER.hasOwnProperty(cardForeignName.language))
                        cardForeignName.language = C.MCI_LANGUAGE_TO_GATHERER[cardForeignName.language];

                    if (!C.VALID_LANGUAGES.includes(cardForeignName.language)) {
                        winston.error("Invalid MCI language: %s", cardForeignName.language);
                        process.exit(0);
                    }
                });
                card.foreignNames = cardForeignNames;
            }

            // Source (comment on mci)  (NOTE: Will be overwritten if source is found on the magic rarities website)
            var commentContainer = rightSide.querySelector("p small");
            if (commentContainer) {
                var cardComment = getTextContent(commentContainer.firstChild).trim();
                if (cardComment)
                    card.source = cardComment;
            }

            this(undefined, card);
        },
        function finish(err, card) {
            setImmediate(cb, err, card);
        }
    );
};

var addPrintingsToMCISet = function(set, cb) {
    tiptoe(
        function loadJSON() {
            set.cards.forEach(function (card) { card.printings = [set.code]; });

            C.SETS.forEach(function (SET) {
                fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this.parallel());
            }.bind(this));
        },
        function checkForPrintings(err) {
            if (err)
                return setImmediate(function () { cb(err); });

            var args=arguments;

            C.SETS.forEach(function (SET, i) {
                var setWithExtras = JSON.parse(args[i+1]);
                var setCardNames = setWithExtras.cards.map(function (card) { return card.name; });
                set.cards.forEach(function (card) {
                    if (setCardNames.includes(card.name))
                        card.printings.push(setWithExtras.code);
                });
            });

            return setImmediate(cb);
        }
    );
};

var addMagicLibraritiesInfoToMCISet = function(set, cb) {
    if (!set.magicRaritiesCodes)
        return setImmediate(cb);

    var normalizeCardName = function(text) { return text.toLowerCase().replace(/[^A-Za-z0-9_ ]/, "", "g"); };
    var magicLibraritiesInfo = {};

    tiptoe(
        function getMagicRaritiesList() {
            set.magicRaritiesCodes.forEach(function (magicRaritiesCode) {
                shared.getURLAsDoc("http://www.magiclibrarities.net/" + magicRaritiesCode + "-english-cards-index.html", this.parallel());
            }.bind(this));
        },
        function populateReleaseDates() {
            flatten(Array.prototype.slice.apply(arguments).map(function (doc) { return Array.from(doc.querySelectorAll("table tr td:nth-child(5) a font")); })).forEach(function (cardNameElement) {
                // Card Names
                var cardNames = [];

                var cardNameRaw = getTextContent(cardNameElement.firstChild);
                if (cardNameRaw.includes("/")) {
                    cardNameRaw.split("/").forEach(function (cardName) { cardNames.push(normalizeCardName(cardName.trim())); });
                }
                else {
                    cardNameRaw = normalizeCardName(cardNameRaw);
                    if (cardNameRaw)
                        cardNames.push(cardNameRaw);
                }

                cardNameRaw = normalizeCardName(getTextContent(cardNameElement.querySelector("i")));
                if (cardNameRaw)
                    cardNames.push(cardNameRaw);

                if (cardNames.length<1)
                    return;

                // Source
                var sourceText = getTextContent(cardNameElement.parentNode.parentNode.nextElementSibling.nextElementSibling.firstChild).trim();
                if (sourceText==="?" || sourceText.toLowerCase()==="source unknown" || sourceText.toLowerCase()==="unknown")
                    sourceText = "";

                // Release date
                var generalYear = getTextContent(cardNameElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling).trim() || null;
                var releaseDateText = getTextContent(cardNameElement.parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.firstChild).trim();
                while(releaseDateText.includes("-?")) {
                    releaseDateText = releaseDateText.replace(new RegExp("-[?]", "g"), "");
                }

                if (/^[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]$/.test(releaseDateText))
                    releaseDateText = releaseDateText.replace(new RegExp("/", "g"), "-");

                var releaseDateRe = [
                    /^([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9])\/?.*/,
                    /^([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]?)\/[0-9]+$/,
                    /^([0-9][0-9][0-9][0-9]-[0-9][0-9])$/,
                    /^([0-9][0-9][0-9][0-9])$/
                ].find(function(re) { return re.test(releaseDateText); });

                var releaseDate = undefined;
                if (releaseDateRe)
                    releaseDate = releaseDateText.replace(releaseDateRe, "$1");

                if (!releaseDate && generalYear)
                    releaseDate = generalYear;

                // Number
                var numberText;
                if (set.useMagicRaritiesNumber) {
                    numberText = getTextContent(cardNameElement.parentNode.parentNode.previousElementSibling.previousElementSibling);
                    if (numberText.includes("/"))
                        numberText = numberText.substring(0, numberText.indexOf("/"));
                }

                if (releaseDate || sourceText || numberText) {
                    var cardInfo = {};
                    if (releaseDate)
                        cardInfo.releaseDate = releaseDate.replace(/-([0-9])$/, "-0$1");
                    if (sourceText)
                        cardInfo.source = sourceText;
                    if (numberText)
                        cardInfo.number = numberText;

                    cardNames.forEach(function (cardName) { if (!magicLibraritiesInfo.hasOwnProperty(cardName)) { magicLibraritiesInfo[cardName] = cardInfo; }});
                }
                else {
                    winston.warn("Unknown release date format: " + releaseDateText);
                }
            });

            set.cards.forEach(function (card) {
                var cardNameNormalized = normalizeCardName(card.name);
                if (!magicLibraritiesInfo.hasOwnProperty(cardNameNormalized))
                    return;

                if (magicLibraritiesInfo[cardNameNormalized].source)
                    card.source = magicLibraritiesInfo[cardNameNormalized].source.replace(new RegExp(String.fromCharCode(65533) + " ", "g"), " ");
                if (magicLibraritiesInfo[cardNameNormalized].releaseDate)
                    card.releaseDate = magicLibraritiesInfo[cardNameNormalized].releaseDate;
                if (magicLibraritiesInfo[cardNameNormalized].number)
                    card.number = magicLibraritiesInfo[cardNameNormalized].number;
            });

            this();
        },
        function finish(err) {
            return setImmediate(cb, err);
        }
    );
};

var processSymbol = function(symbol) {
    var symbols = symbol.toLowerCase().split(" or ").map(function (symbolPart) {
        symbolPart = symbolPart.trim();
        if (/.\/./.test(symbolPart))
            return symbolPart.toUpperCase();

        if (!SYMBOL_CONVERSION_MAP.hasOwnProperty(symbolPart)) {
            winston.warn("Invalid symbolPart [%s] with full value: %s", symbolPart, symbol);
            return "UNKNOWN";
        }

        return SYMBOL_CONVERSION_MAP[symbolPart];
    });

    return "{" + (symbols.length>1 ? symbols.join("/") : symbols[0]) + "}";
};

var stripUnsafeChars = function(text) {
    return text.replace(/[\x00-\x08\x0E-\x1F\x7F\x80-\x9F]/g, "");
};

var processTextBlocks = function(textBlocks) {
    var result = "";
    if (!textBlocks)
        return result;

    textBlocks.forEach(function (textBox, i) {
        if (i>0)
            result += "\n";

        result += processTextBoxChildren(Array.from(textBox.childNodes));
    });

    result = result.replace(new RegExp("\u2028", "g"), "\n");
    result = result.replace(new RegExp("&amp;", "g"), "&");

    while(result.includes("\n\n")) {
        result = result.replace(new RegExp("\n\n", "g"), "\n");
    }

    result = result.replace(new RegExp("\u00a0", "g"), " ");
    result = result.replace(new RegExp("―", "g"), "—");
    result = stripUnsafeChars(result);
    return result;
};

var processTextBoxChildren = function(children) {
    var result = "";

    children.forEach(function (child) {
        if (child.nodeType!==3) {
            var childNodeName = child.nodeName.toLowerCase();
            if (childNodeName==="img")
                result += processSymbol(child.getAttribute("alt"));
            else if (childNodeName==="i" || childNodeName==="b" || childNodeName==="u" || childNodeName==="a")
                result += processTextBoxChildren(child.childNodes);
            else if (childNodeName==="<")
                result += "<";
            else if (childNodeName===">")
                result += ">";
            else if (childNodeName==="br")
                result += "\n";
            else
                winston.warn("Unsupported text child tag name %s", childNodeName);
        }
        else if (child.nodeType===3) {
            var childText = child.data;
            Object.forEach(TEXT_TO_SYMBOL_MAP, function(text, symbol) {
                childText = childText.replace(new RegExp("o" + text, "g"), "{" + symbol + "}");
                childText = childText.replace(new RegExp(text, "g"), "{" + symbol + "}");
            });

            childText = childText.replace(new RegExp("roll chaos", "g"), "roll {C}");
            childText = childText.replace(new RegExp("chaos roll", "g"), "{C} roll");

            // fix errors of type 'N{'... For more info, see issue #48.
            childText = childText.replace(/([0-9]){/g, '{$1}{');
            // Also fix errors that the ':' is missing after the mana cost.
            // This takes all mana costs on the beggining of the line, followed by a space and adds a ':' character after it.
            childText = childText.replace(/(^|\\n)({[^ ]*}) /g, '$1$2: ');

            result += childText;
        }
        else {
            winston.warn("Unknown text child type: %s", child.nodeType);
        }
    });

    return result;
};

var getTextContent = function(item) {
    var ret = '';
    if (item) {
        ret = typeof item.innerHTML !== 'undefined' ? item.innerHTML : item.textContent;
        ret = ret
            .replace(/<img .*?alt="([^"]*)"[^>]*>/g, function(match, alt) {
                if (!SYMBOL_CONVERSION_MAP[alt.toLowerCase()]) {
                    console.log("Can't find symbol: %s", alt);
                }
                return('{' + SYMBOL_CONVERSION_MAP[alt.toLowerCase()] + '}');
            })
            .replace(/<[^>]*>/g, '');
        ret = ret
            .replace(new RegExp("&amp;", "g"), "&")
            .replace(new RegExp("&nbsp;", "g"), " ");
    }
    ret = stripUnsafeChars(ret);
    return(ret);
};

var getSetNameMultiverseIds = function(setName, cb) {
    tiptoe(
        function getFirstListingsPage() {
            shared.buildMultiverseListingURLs(setName, this);
        },
        function getOtherListingsPages(urls) {
            urls.forEach(function (url) {
                shared.getURLAsDoc(url, this.parallel());
            }.bind(this));
        },
        function getListingMultiverseids(err) {
            if (err)
                return setImmediate(function () { cb(err); });

            var listDocs = Array.prototype.slice.apply(arguments, [1]);

            var multiverseids = [];
            listDocs.forEach(function (listDoc) {
                multiverseids = unique(multiverseids.concat(Array.from(listDoc.querySelectorAll("table.checklist tr.cardItem a.nameLink")).map(function (o) {  return +querystring.parse(url.parse(o.getAttribute("href")).query).multiverseid; })));
            });

            setImmediate(cb, undefined, multiverseids);
        }
    );
};

/**
 * Fix converted mana cost for cards
 */
var fixCMC = function(cards, cb) {
    var findCardByNumber = function(number) {
        return(cards.find(function(card) { return(card.number === number); }));
    };

    async.each(cards,
        function(card, subcb) {
            if (card.hasOwnProperty('cmc'))
                return subcb();

            if (card.layout === 'double-faced') {
                // Fix the back of double-faced cards

                    var otherSideNum = card.number.substr(0, card.number.length - 1) + ((card.number.substr(-1) == 'a')?'b':'a');
                    var otherCard = findCardByNumber(otherSideNum);
                    if (otherCard.hasOwnProperty('cmc')) {
                        card.cmc = otherCard.cmc;
                    } else {
                        // The other card has no mama cost so it's a land, set CMC to land mana cost (0).
                        card.cmc = 0;
                    }
                    return subcb();
            }

            if (!card.manaCost) {
                // Fix cards with no mana cost
                card.cmc = 0;
                return subcb();
            }

            return subcb();
        },
        cb
    );
};

/**
 * Process the "colorIdentity" fields for all given cards.
 * cb() is called upon finish.
 */
var fixCommanderIdentityForCards = function(cards, cb) {
    var findCardByNumber = function(number) {
        return(cards.find(function(card) { return(card.number === number); }));
    };

    async.each(cards, function(card, subcb) {
        // Calculate commander color identity
        var regex = /{([^}]*)}/g;
        var colors = [];    // Holds the final color array
        var res = null;

        // Remove old colorIdentity before we start processing...
        delete card.colorIdentity;

        var ct = card.type.toLowerCase();
        if (ct == "phenomenon" || ct == "token" || ct == "plane" || ct == "scheme" || ct == "vanguard") {
            return setImmediate(subcb);
        }

        // Process color indicators
        var newColors = [];
        if (card.colors) {
            card.colors.forEach(function (color){
                if (color.toLowerCase() == "white") newColors.push('W');
                if (color.toLowerCase() == "blue") newColors.push('U');
                if (color.toLowerCase() == "black") newColors.push('B');
                if (color.toLowerCase() == "red") newColors.push('R');
                if (color.toLowerCase() == "green") newColors.push('G');
            });
        }

        // Add color identity to lands
        if (card.type.toLowerCase().indexOf('land') >= 0) {
            if (card.type.toLowerCase().indexOf('plains') > 0) newColors.push('W');
            if (card.type.toLowerCase().indexOf('island') > 0) newColors.push('U');
            if (card.type.toLowerCase().indexOf('swamp') > 0) newColors.push('B');
            if (card.type.toLowerCase().indexOf('mountain') > 0) newColors.push('R');
            if (card.type.toLowerCase().indexOf('forest') > 0) newColors.push('G');
        }

        newColors.forEach(function (idx) {
            if ((C.VALID_COLORS.indexOf(idx) >= 0) && (colors.indexOf(idx) == -1))
                colors.push(idx);
        });

        // Process card text and mana cost
        var fullText = card.manaCost;
        if (card.text)
            fullText += card.text.replace(/\([^\)]*\)/gi,'');

            var addColor = function(idx) {
                if (C.VALID_COLORS.indexOf(idx) >= 0 && colors.indexOf(idx) < 0)
                    colors.push(idx);
            };

        while ((res = regex.exec(fullText))) {
            res[1].split("/").forEach(addColor);
        }

        if (colors.length > 0) {
            card.colorIdentity = colors;
        }

        // Process split and double-faced cards
        if (card.layout == "double-faced" || card.layout == "split" || card.layout == "aftermath" || card.layout == "meld") {
            var otherSideNum = card.number.substr(0, card.number.length - 1) + ((card.number.substr(-1) == "a") ? "b" : "a");
            var otherCard = findCardByNumber(otherSideNum);

            if (!otherCard) {
                winston.error("Current side name: %s", card.name);
                winston.error("-> Other Side num: %s", otherSideNum);

                //throw Error("Error: Cannot find other side of card " + card.name);
            }

            if (card.colorIdentity) colors = colors.concat(card.colorIdentity);
            if (otherCard && otherCard.colorIdentity) colors = colors.concat(otherCard.colorIdentity);

            // Remove duplicates
            var uniqueColors = colors.filter(function (elem, pos) {
                return colors.indexOf(elem) == pos;
            });

            // Sort
            colors.sort();

            if (uniqueColors.length > 0) {
                if (otherCard) otherCard.colorIdentity = uniqueColors;
                card.colorIdentity = uniqueColors;
            }
        }

        subcb();
    }, cb);
};

    // Expose stuff
    exports.ripMCISet = ripMCISet;
    exports.ripSet = ripSet;
    exports.fixCommanderIdentityForCards = fixCommanderIdentityForCards;
    exports.getURLsForMultiverseid = getURLsForMultiverseid;
    exports.processMultiverseids = processMultiverseids;

})(exports);
