"use strict";
/*global setImmediate: true*/

var async = require("async"),
    fs = require("fs"),
    shared = require('../shared/shared'),
    path = require("path"),
    tiptoe = require("tiptoe"),
    unique = require("array-unique"),
    winston = require("winston");

if (require.main == module) {
    async.eachSeries(
        shared.getSetsToDo(),
        processSet,
        function(err) {
            if(err) {
                winston.error(err);
                process.exit(1);
            }

            process.exit(0);
        });
}

function processSet(code, cb)
{
    winston.info("Processing set: %s", code);

    tiptoe(
        function getJSON()
        {
            fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
        },
        function processCards(setRaw)
        {
            var set = JSON.parse(setRaw);

            var setCards = {};
            set.cards.forEach(function(card)
            {
                card.printings.remove(set.code);
                if(!card.printings || !card.printings.length)
                    return;

                card.printings.forEach(function(printing)
                {
                    if(!setCards.hasOwnProperty(printing))
                        setCards[printing] = [];

                    setCards[printing].push(card.name);
                    setCards[printing] = unique(setCards[printing]).sort();
                });
            });

            async.eachSeries(
                Object.keys(setCards),
                function(setCode, subcb) {
                    addPrintingToSetCards(setCode, setCards[setCode], set.code, subcb);
                },
                this);
        },
        function finish(err)
        {
            setImmediate(function() { cb(err); });
        }
    );
}

function addPrintingToSetCards(setCode, targetCardNames, printingCode, cb)
{
    winston.info("Adding printing [%s] to set [%s] for all cards: %s", printingCode, setCode, targetCardNames.join(", "));

    tiptoe(
        function getJSON()
        {
            fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
        },
        function addPrintingsAndSave(setRaw)
        {
            var set = JSON.parse(setRaw);

            set.cards.forEach(function(card)
            {
                if(!targetCardNames.includes(card.name))
                    return;

                if(!card.printings.includes(printingCode))
                {
                    card.printings.push(printingCode);
                    shared.finalizePrintings(card);
                }
            });

            shared.saveSet(set, this);
        },
        function finish(err)
        {
            setImmediate(function() { cb(err); });
        }
    );
}

module.exports = processSet;
