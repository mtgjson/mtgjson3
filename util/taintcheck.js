'use strict';

var fs = require('fs');
var path = require('path');
var C = require('../shared/C');
var async = require('async');
var tiptoe = require('tiptoe');
var ansidiff = require('ansidiff');

var allCardsWithExtras = {};
var previousSeenSetCodes = {};
var taintedCards = [];

var checkCard = function(SET, card, callback) {
    if (!previousSeenSetCodes.hasOwnProperty(card.name))
        previousSeenSetCodes[card.name] = {};
    if (!allCardsWithExtras.hasOwnProperty(card.name))
        allCardsWithExtras[card.name] = {};

    //winston.info('[%s] %s', SET.code, card.name);

    async.each(
        Object.keys(C.FIELD_TYPES),
        function(fieldName, cb) {
            if (C.SET_SPECIFIC_FIELDS.includes(fieldName)) {
                return(setImmediate(cb));
            }

            if (!previousSeenSetCodes[card.name].hasOwnProperty(fieldName))
                previousSeenSetCodes[card.name][fieldName] = [];

            var fieldValue = card[fieldName];
            if (fieldName === "imageName")        // Modify for AllCards.json the imageName field
                fieldValue = card.name.toLowerCase().replace(new RegExp(":\"?", "g"), "").replace(new RegExp("/", "g"), " ").replace(new RegExp("^[0-9 \.]+|[0-9 \.]+$", "g"), "").replace(new RegExp(" token card", "g"), "");

            if (C.ORACLE_FIELDS.includes(fieldName) && fieldName !== 'foreignNames') {
                checkTaintField(SET, card, fieldName, fieldValue);
            }

            previousSeenSetCodes[card.name][fieldName].push(SET.code);

            setImmediate(cb);
        },
        function() {
            setImmediate(callback, null, allCardsWithExtras[card.name]);
        }
    );
};

var checkTaintField = function(SET, card, fieldName, fieldValue) {
    if (!fieldValue) {
        if (card.hasOwnProperty(fieldName))
            fieldValue = card[fieldName];
    }

    if (fieldName == 'rulings' && fieldValue) {
        // We need to fix the quotes, since mci and gatherer do not agree on quote formatting.
        // MTGJson will adopt regular quotes all around.
        fieldValue.forEach(function(rule) {
            rule.text = rule.text.replace(/[“”]/g, '"').replace(/’/g, "'");
        });
    }

    // Do nothing if we do not have a previous value.
    if (!allCardsWithExtras[card.name].hasOwnProperty(fieldName)) {
        allCardsWithExtras[card.name][fieldName] = fieldValue;
        return;
    }

    var previousValue = allCardsWithExtras[card.name][fieldName];

    var taint = false;
    var diff = null;
    if (previousValue) {
        if (!fieldValue) {
            winston.info("No value present");
            taint = true;
        }
        else
            diff = ansidiff.words(previousValue, fieldValue);

        if (diff) {
            taint = true;
        }
    }

    if (taint) {
        var obj = taintedCards.find(function(c) { return(c.name == card.name); });

        if (!obj) {
            obj = { card: card, fields: [], sets: [] };
            taintedCards.push({ card: card, fieldName: fieldName });
        }

        if (obj.fields.indexOf(fieldName) < 0)
            obj.fields.push(fieldName);

        if (obj.sets.indexOf(SET.code) < 0)
            obj.sets.push(SET.code);

        winston.info("Tainted field %s on card '%s' (%s)", fieldName, card.name, SET.code);
        if (diff)
            winston.info(diff);
        winston.info('Past sets: %s', obj.sets.join(','));
        winston.info('Card sets: %s', card.printings.join(','));
    }
};

var processSet = function(SET, cb) {
    var data = null;
    tiptoe(
        function() {
            fs.readFile(path.join(__dirname, '..', 'json', SET.code + '.json'), { encoding: 'utf-8' }, this);
        },
        function(setRaw) {
            data = JSON.parse(setRaw);
            async.eachSeries(
                data.cards,
                function(card, callback) {
                    checkCard(data, card, callback);
                },
                this
            );
        },
        function(err) {
            if (err) {
                winston.error('Error while processing set %s', SET.name);
                throw(err);
            }
            setImmediate(cb);
        }
    );
};

var checkAll = function(callback) {
    async.eachSeries(
        C.SETS,
        function(SET, cb) {
            winston.info("Processing set %s (%s)", SET.name, SET.code);
            processSet(SET, cb);
        },
        callback
    );
};

module.exports = {
    /* functions */
    reset: function() {
        allCardsWithExtras = {};
        previousSeenSetCodes = {};
        taintedCards = [];

        module.exports.allCardsWithExtras = allCardsWithExtras;
        module.exports.previousSeenSetCodes = previousSeenSetCodes;
        module.exports.taintedCards = taintedCards;
    },
    checkAll: checkAll,
    checkCard: checkCard,
    checkTaintField: checkTaintField,
    /* Variables */
    allCardsWithExtras: allCardsWithExtras,
    previousSeenSetCodes: previousSeenSetCodes,
    taintedCards: taintedCards
};

if (require.main == module) {
    winston.info("Checking for tainted cards...");
    checkAll(function() {
        var output = JSON.stringify(taintedCards, null, 2);
        fs.writeFile(path.join(__dirname, '..', 'taint.json'), output, 'utf-8');
        winston.info('total tainted cards: %d', taintedCards.length);
    });
}
