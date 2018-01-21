'use strict';

const fs = require('fs');
const shared = require('../shared/shared');
const path = require('path');
const tiptoe = require('tiptoe');
const winston = require('winston');
const async = require('async');
const unique = require('array-unique');

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

function processSet(code, cb) {
    winston.info("Processing set: %s", code);

    // Will contain all rulings on this set.
    var cardRulingsByName = {};

    tiptoe(
        function getJSON() {
            fs.readFile(path.join(__dirname, '..', 'json', code + '.json'), { encoding : 'utf8' }, this);
        },
        function processCards(setRaw) {
            var set = JSON.parse(setRaw);

            var setCards = {};
            var self = this;

            async.each(set.cards, function(card, cb) {
                if (!card.rulings)
                    return(setImmediate(cb));

                if (!card.printings || !Array.isArray(card.printings)) {
                  winston.warn('Card has none or invalid printings:', card.name);
                  winston.warn(card.printings);
                } else {
                  // We don't want to update our own set.
                  card.printings = card.printings.filter(code => code !== set.code);
                }

                if (!card.printings || !card.printings.length)
                    return setImmediate(cb);

                cardRulingsByName[card.name] = card.rulings;

                async.each(card.printings, function(printing, subcb) {
                    if (!setCards.hasOwnProperty(printing))
                        setCards[printing] = [];

                    setCards[printing].push(card.name);
                    setCards[printing] = unique(setCards[printing]).sort();

                    subcb();
                }, cb);
            }, function() {
                setImmediate(self, null, setCards);
            });
        },
        function addRulings(setCards) {
            async.eachSeries(Object.keys(setCards), function(setCode, cb) {
                addRulingsToSetCards(setCode, setCards[setCode], cardRulingsByName, cb);
            }, this);
        },
        function finish(err) {
            winston.info('done');
            setImmediate(cb, err);
        }
    );
}

function addRulingsToSetCards(setCode, targetCardNames, cardRulingsByName, cb) {
    winston.info("Adding rulings to set [%s] for all cards: %s", setCode, targetCardNames.join(", "));

    var processFunction = function(set) {
        set.cards.forEach(function(card) {
            if(!targetCardNames.includes(card.name))
                return;

            if(!cardRulingsByName.hasOwnProperty(card.name))
                return;

            card.rulings = cardRulingsByName[card.name];
        });

        return(set);
    };

    shared.processSet(setCode, processFunction, cb);
}

module.exports = processSet;
