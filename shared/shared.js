"use strict";

var C = require("./C");
var clone = require("clone");
var hash = require("mhash");
var path = require("path");
var moment = require("moment");
var domino = require("domino");
var querystring = require("querystring");
var tiptoe = require("tiptoe");
var fs = require("fs");
var url = require("url");
var unidecode = require("unidecode");
var unique = require("array-unique");
var winston = require("winston");

winston.level = 'info';
winston.cli();

var retry = require('retry');
var request = require('request');
const cache = require('./cache');

exports.cache = cache;

const readFileAsync = (path, options) => new Promise((accept, reject) => {
  fs.readFile(path, options, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    accept(data);
  });
});

exports.getSetsToDo = require('./getSetsToDo');

exports.getMCISetCodes = function() {
    return C.SETS.filter(function(SET) { return SET.isMCISet; }).map(function(SET) { return SET.code; });
};

exports.cardComparator = function(a, b)
{
    var result = unidecode(a.name).toLowerCase().localeCompare(unidecode(b.name).toLowerCase());
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
            set     : "[" + JSON.stringify(setName.replace(new RegExp("&", "g"), "and")) + "]",
            page    : ("" + (page || 0))
        }
    };

    return url.format(urlConfig).replace(new RegExp("%5C", "g"), "");
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


            var colorOrder = function(card) {
                // COLORS, Golds, Artifacts, Non-Basic Lands, Lands
                if(card.hasOwnProperty("colors") && card.colors.length===1)
                    return COLOR_ORDER.indexOf(card.colors[0]);
                if(card.hasOwnProperty("colors") && card.colors.length>1)
                    return 5;
                if(card.types.includes("Artifact"))
                    return 6;
                if(card.types.includes("Land") && !card.hasOwnProperty("supertypes"))
                    return 7;
                if(LAND_ORDER.includes(card.name))
                    return 8+LAND_ORDER.indexOf(card.name);
                return 99999999;
            };

            var cardNumberComparator = function(cardA, cardB) {
                // Compare colors
                var colorComparison = colorOrder(cardA) - colorOrder(cardB);
                if (colorComparison !== 0) return colorComparison;
                // name
                if (cardA.name < cardB.name) return -2;
                if (cardA.name > cardB.name) return 2;
                // multiverseid
                if (cardA.multiverseid < cardB.multiverseid) return -1;
                if (cardA.multiverseid > cardB.multiverseid) return 1;
                return 0;
            };

            cards.sort(cardNumberComparator).forEach(function(card) { card.number = "" + (cardNumber++); });
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
                if(setCorrection.match && (setCorrection.match==="*" || (Object.keys(setCorrection.match).every(function(key)
                    {
                        var value = setCorrection.match[key];
                        if(Array.isArray(value))
                            return value.includes(card[key]);

                        if(typeof value==="string" && value.startsWith("<"))
                            return (+card[key])<(+(value.substring(1)));

                        if(typeof value==="string" && value.startsWith(">"))
                            return (+card[key])>(+(value.substring(1)));

                        return value===card[key];
                    }))))
                {
                    if(setCorrection.replace)
                    {
                        Object.keys(setCorrection.replace).forEach(function(key)
                            {
                                var value = setCorrection.replace[key];
                                if(value !== null && !Array.isArray(value) && typeof value === "object")
                                {
                                    if(!card.hasOwnProperty(key))
                                        return;

                                    Object.keys(value).forEach(function(findText) {
                                        var replaceWith = value[findText];
                                        card[key] = card[key].replace(new RegExp(findText, "g"), replaceWith);
                                    });
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

                    if(setCorrection.addPrintings) {
                        if(!card.printings) card.printings = [];
                        card.printings = card.printings.concat(setCorrection.addPrintings);
                        exports.finalizePrintings(card);
                    }

                    if(setCorrection.setLegality) {
                        Object.keys(setCorrection.setLegality).forEach(function(legalityType)
                        {
                            var legalityValue = setCorrection.setLegality[legalityType];
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
                        card.legalities = card.legalities.filter(function(cardLegality) { return !setCorrection.deleteLegality.includes(cardLegality.format); });

                    if(setCorrection.flavorAddDash && card.flavor)
                    {
                        card.flavor = card.flavor.replace(/([.!?,'])(["][/]?[\n]?)(\s*)([A-Za-z])/, "$1$2$3 —$4", "gm");
                        while(card.flavor.includes("  —"))
                        {
                            card.flavor = card.flavor.replace("  —", " —");
                        }
                    }

                    if(setCorrection.fixFlavorNewlines && card.flavor) {
                        card.flavor = card.flavor.replace(/(\s|")-\s*([^"—-]+)\s*$/, "$1—$2");

                        if(card.flavor.includes("—"))
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
                        if(cardsToIncrementNumber.includes(card.name)) {
                            var cardCount = cardsToIncrementNumber.filter(function(c) { return c === card.name; }).length;
                            card.number = "" + ((+card.number) + cardCount);
                        }

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
                cards = cards.filter(function(card) { return !cardsToRemove.includes(card); });

            if(setCorrection.copyCard || setCorrection.importCard || setCorrection.addCard)
            {
                var newCard;
                if(setCorrection.copyCard)
                    newCard = clone(cards.find(function(card) { return card.name===setCorrection.copyCard; }));
                else if(setCorrection.importCard)
                    newCard = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "json", setCorrection.importCard.set + ".json"), {encoding:"utf8"})).cards.find(function(card) { return card.name===setCorrection.importCard.name; });
                else if(setCorrection.addCard)
                    newCard = clone(setCorrection.addCard);

                if(setCorrection.replace)
                    Object.keys(setCorrection.replace).forEach(function(key) { newCard[key] = setCorrection.replace[key]; });
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

        card.artist = card.artist.replace(new RegExp(" and ", "g"), " & ");
        Object.keys(C.ARTIST_CORRECTIONS).forEach(function(correctArtist)
        {
            var artistAliases = C.ARTIST_CORRECTIONS[correctArtist];
            if(artistAliases.includes(card.artist))
                card.artist = correctArtist;
        });

        card.artist = card.artist.replace(/^([^"]*)"([^"]*)"(.*)$/, "$1“$2”$3", "m");
    });

    // No text for basic lands and rarity of Basic Land
    cards.forEach(function(card)
    {
        if(card.supertypes && card.supertypes.includes("Basic") && card.types && card.types.includes("Land"))
        {
            if(card.name!=="Wastes")
                delete card.text;
            if(card.name in ["Plains", "Island", "Swamp", "Mountain", "Forest"] || !(fullSet.code in ["CSP", "OGW"]))
                card.rarity = "Basic Land";
            if(addBasicLandWatermarks)
            {
                if('subtypes' in card && card.subtypes.includes("Plains"))
                    card.watermark = "White";
                else if('subtypes' in card && card.subtypes.includes("Island"))
                    card.watermark = "Blue";
                else if('subtypes' in card && card.subtypes.includes("Swamp"))
                    card.watermark = "Black";
                else if('subtypes' in card && card.subtypes.includes("Mountain"))
                    card.watermark = "Red";
                else if('subtypes' in card && card.subtypes.includes("Forest"))
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
        if(!card.text || !card.text.includes("\n"))
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
        newText = newText.replace(new RegExp("[“”＂]", "g"), "\"");
        newText = newText.replace(new RegExp("[‘’]", "g"), "'");
        newText = newText.replace(new RegExp(" *\n+ *", "g"), "\n");
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

                Object.keys(C.SYMBOL_MANA).forEach(function(manaSymbol) {
                    var newText = ruling.text.replace(new RegExp("\\{" + manaSymbol.toUpperCase() + "\\]", "g"), "{" + manaSymbol.toUpperCase() + "}");
                    if(newText===ruling.text)
                        ruling.text.replace(new RegExp("\\[" + manaSymbol.toUpperCase() + "\\}", "g"), "{" + manaSymbol.toUpperCase() + "}");
                    if(newText===ruling.text)
                        ruling.text.replace(new RegExp("\\[" + manaSymbol.toUpperCase() + "\\]", "g"), "{" + manaSymbol.toUpperCase() + "}");

                    if(newText!==ruling.text) {
                        winston.warn("Auto correcting set %s Card [%s] (%s) that has ruling with invalid symbol: %s", fullSet.code, card.name, card.multiverseid || "", ruling.text);
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
            winston.warn("Set [%s] and card [%s] release date format invalid: %s", fullSet.code, card.name, card.releaseDate);
            delete card.releaseDate;
        }
    });

    // Sort and clean up legalities and foreign names
    cards.forEach(function(card)
    {
        if(card.hasOwnProperty("legalities"))
            card.legalities = card.legalities.sort(function(a, b) { var al = a.format.toLowerCase().charAt(0); var bl = b.format.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });
        if(card.hasOwnProperty("foreignNames")) {
            card.foreignNames = card.foreignNames.filter(function(a) {
                return (typeof a.name !== undefined && a.name !== '');
            }).sort(function(a, b) {
                var al = a.language.toLowerCase().charAt(0); var bl = b.language.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0));
            });
        }
    });

    // Finalize printings
    cards.forEach(exports.finalizePrintings);

    // Generate ID
    cards.forEach(function(card)
    {
        card.id = hash("sha1", (fullSet.code + card.name + card.imageName));
    });
    fullSet.cards = cards;
};

exports.finalizePrintings = function (card) {
    if(!card.printings)
        return;

    function setCodeComparator(setA, setB) {
        var releaseA = moment(exports.getReleaseDateForSetCode(setA), "YYYY-MM-DD").unix();
        var releaseB = moment(exports.getReleaseDateForSetCode(setB), "YYYY-MM-DD").unix();
        if (releaseA < releaseB) return -2;
        if (releaseA > releaseB) return 2;
        return setA.localeCompare(setB);
    }
    card.printings = unique(card.printings).sort(setCodeComparator);
};

exports.getSetCodeFromName = function (setName) {
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
        winston.error("Failed to get set code for '%s'; please add the set to shared/C.js", setName);
        process.exit(1);
    }
    return(setInfo.code);
};

exports.getReleaseDateForSetName = function (setName) {
    var targetSet = C.SETS.find(function(SET) { return SET.name === setName; });
    if (targetSet)
        return targetSet.releaseDate;
    return moment().format("YYYY-MM-DD");
};

exports.getReleaseDateForSetCode = function (setCode) {
    var targetSet = C.SETS.find(function(SET) { return SET.code === setCode; });
    if (targetSet)
        return targetSet.releaseDate;
    return moment().format("YYYY-MM-DD");
};

exports.clearCacheFile = function(targetUrl, cb) {
    exports.cache.get(targetUrl, function(err) {
        if (err && err.notFound) return cb();
        if (err) return cb(err);
        exports.cache.del(targetUrl, {}, function(err) {
            if (err) return cb(err);
            winston.info('Cleared from cache: %s', targetUrl);
            return cb();
        });
    });
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
        urls.push(exports.buildMultiverseURL(card.multiverseid).replace("printed=false", "printed=true"));
        if (card.layout==="split") {
            urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[0]).replace("printed=false", "printed=true"));
            urls.push(exports.buildMultiverseURL(card.multiverseid, card.names[1]).replace("printed=false", "printed=true"));
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
    winston.info("building multiverse listing url for " + setName);
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
    function downloadHTML(dlCb) {
        var options = {
            url: targetURL,
            headers: { 'User-Agent': 'mtgjson.com/1.0' }
        };
        request(options, function(err, response, body) {
            if (!err && response && response.statusCode !== 200)
                err = new Error('Server responded with statusCode: ' + response.statusCode);
            if (!err && (!body || body.length === 0 || typeof body === 'undefined'))
                err = new Error('No page contents');
            if (!err && (body.includes('Server Error') || body.includes('You Just Exploded the Internet.')))
                err = new Error('Gatherer Server Error despite statusCode: ' + response.statusCode);
            if (err) {
                winston.error('Error downloading: %s', targetURL);
                winston.error(err);
                return dlCb(err);
            }
            winston.info('Retrieved: %s', targetURL);
            dlCb(null, body);
        });
    }

    function retryDl(dlCb) {
        const retryCount = process.env.RETRY_COUNT || 5;
        const minTimeout = process.env.RETRY_MIN || 1000;
        const operation = retry.operation({
            retries: retryCount,
            minTimeout: minTimeout,
        });
        operation.attempt(function(currentAttempt) {
            downloadHTML(function(err, body) {
                if (operation.retry(err)){
                    winston.info('Retry %d of fetch: %s', currentAttempt, targetURL);
                    return;
                }

                dlCb(err ? operation.mainError() : null, body);
            });
        });
    }

    function downloadCb(err, body) {
        if (err) return getCb(err);
        exports.cache.put(targetURL, body);
        getCb(null, domino.createWindow(body).document);
    }

    function cacheCb(err, doc) {
        if (err && err.notFound)
            retryDl(downloadCb);
        else if (err)
            getCb(err);
        else
            getCb(null, domino.createWindow(doc).document);
    }

    exports.cache.get(targetURL, cacheCb);
};

exports.buildMultiverseAllPrintingsURLs = function(multiverseid, cb) {
    tiptoe(
        function getFirstPage() {
            var targetURL = exports.buildMultiversePrintingsURL(multiverseid, 0);
            exports.getURLAsDoc(targetURL, this);
        },
        function getAllPages(err, doc) {
            if(err) {
                winston.error(exports.buildMultiversePrintingsURL(multiverseid, 0));
                winston.error(err);
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
    if (doc === undefined) {
      winston.warn('doc is undefined!', type);
      return 0;
    }
    var pageLinks = Array.from(doc.querySelectorAll("#ctl00_ctl00_ctl00_MainContent_SubContent_" + pageControlsContainer + " a"));

    var numPages = 1;
    if(pageLinks.length>0)
    {
        if(type==="printings")
        {
            var lastPageHREF = pageLinks[pageLinks.length - 1].getAttribute("href");
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
    var banned = false;
    if (card.legalities)
        card.legalities = card.legalities.filter(function(cardLegality) {
            if (cardLegality.format === 'Standard') {
                if (cardLegality.legality === 'Banned') banned = true;
                return false;
            } else {
                return true;
            }
        });

    var standard = false;
    card.printings.forEach(function(value) {
        if (!standard && C.STANDARD_SETS.indexOf(value) >= 0) {
            standard = true;
            //winston.info("Card %s is in standard set (%s).", card.name, value);
        }
    });
    if (standard === true) {
        var legality = banned ? 'Banned' : 'Legal';
        var legalityObject = {format:"Standard", legality: legality};
        if (card.legalities === undefined)
            card.legalities = [];

        card.legalities.push(legalityObject);
    }
};

/**
 * saveSet() prepares and saves a given set to a file.
 * 1.    Each card is sorted by the following criteria:
 * 1.1   If they both have a number, they are compared and sorted accordingly.
 * 1.2   If the number does not exist or is is the same, compare multiverseIDs
 * 1.3   If there are no numbers, compare the imagenames.
 * 1.4   If there are no imagenames compare names.
 * 2.    The foreignNames array is sorted by the multiverseid
 * 3.    The legalities are sorted by format name
 * 4.    Each key value of the card is sorted.
 *
 * 99. Finally, the file is saved to the <ROOT>/json/<SETNAME>.json file.
 */
exports.saveSet = function(set, callback) {
    // 1. Sort cards
    set.cards.sort(function(a, b) {
        var ret = 0;
        if (a.number && b.number)
            ret = exports.alphanum(a.number, b.number);
        if (ret === 0 && a.multiverseid && b.multiverseid)
            ret = a.multiverseid - b.multiverseid;
        if (ret === 0 && a.imageName && b.imageName)
            ret = a.imageName.localeCompare(b.imageName);
        if (ret === 0)
            ret = a.name.localeCompare(b.name);
        return ret;
    });

    // Sort internal card stuff
    set.cards.forEach(function(card) {
        // 2. Foreign Names
        if (card.foreignNames)
            card.foreignNames.sort(function(fnameA, fnameB) {
                var result = fnameA.multiverseid - fnameB.multiverseid;
                if (result === 0) result = fnameA.language.localeCompare(fnameB.language);
                if (result === 0) result = fnameA.name.localeCompare(fnameB.name);
                return result;
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

/**
 * saveSetAsync() is an async wrapper for saveSet
 */
exports.saveSetAsync = (setData) => new Promise((accept, reject) => {
  exports.saveSet(setData, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    accept(data);
  });
});

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
                exports.saveSet(newSet, this);    // Save set if the function returned anything
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

/**
 * Execute a function on a given set and saves the returned data (if any)
 * @param setCode String with the name of the set we want to update
 * @param processFunction function to modify the set data. If data is returned, this data considered the new set data.
 */
exports.processSetAsync = async function(setCode, processFunction) {
  const jsonPath = path.join(__dirname, '..', 'json', setCode + '.json');
  const jsonContents = await readFileAsync(jsonPath, { encoding : 'utf8' });

  const set = JSON.parse(jsonContents);
  const newSet = processFunction(set);

  return exports.saveSetAsync(newSet);
};
