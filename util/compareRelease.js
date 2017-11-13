"use strict";
/*global setImmediate: true*/

var async = require("async"),
    fs = require("fs"),
    shared = require('../shared/shared'),
    color = require("cli-color"),
    ansidiff = require('ansidiff'),
    path = require("path"),
    request = require("request"),
    tiptoe = require("tiptoe"),
    unique = require("array-unique"),
    winston = require("winston");

var setsToDo = shared.getSetsToDo();
var updatedSetFiles = [];

tiptoe(
    function processSets()
    {
        async.eachSeries(
            setsToDo,
            function(code, subcb) {
                processSet(code, subcb);
            },
            this);
    },
    function processSetsX()
    {
        async.eachSeries(
            setsToDo,
            function(code, subcb) {
                processSet(code + "-x", subcb);
            },
            this);
    },
    function finish(err)
    {
        updatedSetFiles = unique(updatedSetFiles).sort();
        fs.writeFileSync("/tmp/changedSets.json", JSON.stringify(updatedSetFiles), {encoding:"utf8"});

        winston.info("\n\n\n");
        winston.info(JSON.stringify(updatedSetFiles));
        winston.info("\n\n\n");

        if(err)
        {
            winston.error(err);
            process.exit(1);
        }

        process.exit(0);
    }
);

var imageNameAlerts = [];
function processSet(code, cb)
{
    imageNameAlerts = [];
    winston.info("%s", code);

    tiptoe(
        function getJSON()
        {
            request("http://mtgjson.com/json/" + code + ".json", this.parallel());
            fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this.parallel());
        },
        function compare(oldJSONArgs, newJSON)
        {
            var result = compareSets(JSON.parse(oldJSONArgs[0]), JSON.parse(newJSON), code);
            if(result)
                winston.info(result);

            if(imageNameAlerts.length>0)
            {
                winston.info("WARNING!! IMAGE NAMES HAVE CHANGED!!!");
                winston.info(imageNameAlerts.join("\n"));
            }

            this();
        },
        function finish(err)
        {
            setImmediate(function() { cb(err); });
        }
    );
}

function compareSets(oldSet, newSet, filename)
{
    var result = "";
    var oldCardsMap = {};
    oldSet.cards.forEach(function(card) {oldCardsMap[card.name + " (" + card.multiverseid + ")"] = card;});
    var newCardsMap = {};
    newSet.cards.forEach(function(card) {newCardsMap[card.name + " (" + card.multiverseid + ")"] = card;});

    if(oldSet.cards.length!==newSet.cards.length)
        result += "Cards length changed: Old (" + oldSet.cards.length + ") vs New ("  + newSet.cards.length + ")";

    delete oldSet.cards;
    delete newSet.cards;

    var setChanged = ansidiff.words(oldSet, newSet);
    if(setChanged)
    {
        updatedSetFiles.push(filename);
        result += "SET CHANGED : ";
        result += setChanged;
    }

    var cardsChanged = ansidiff.words(Object.keys(oldCardsMap), Object.keys(newCardsMap));
    if(cardsChanged)
    {
        updatedSetFiles.push(filename);
        result += "Cards Changed : ";
        result += cardsChanged;
    }

    Object.keys(oldCardsMap).forEach(function(key)
    {
        var oldCard = oldCardsMap[key];
        if(!newCardsMap.hasOwnProperty(key))
            return;

        var newCard = newCardsMap[key];

        var subResult = ansidiff.words(oldCard, newCard);
        if(subResult)
        {
            updatedSetFiles.push(filename);
            result += color.magenta(JSON.stringify(key)) + " : \n";
            result += subResult;

            if(oldCard.hasOwnProperty("imageName") && newCard.hasOwnProperty("imageName") && oldCard.imageName!==newCard.imageName)
                imageNameAlerts.push(oldCard.name + "(" + oldCard.imageName + ") => " + newCard.name + "(" + newCard.imageName + ")");
        }
    });

    return result;
}
