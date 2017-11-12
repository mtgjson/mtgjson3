"use strict";
/*global setImmediate: true*/

var C = require('../shared/C'),
    async = require('async'),
    clone = require('clone'),
    fs = require("fs"),
    shared = require('../shared/shared'),
    path = require("path"),
    tiptoe = require("tiptoe"),
    winston = require("winston");

async.eachSeries(
    shared.getSetsToDo(),
    processSet,
    function(err) {
        if (err) {
            winston.error(err);
            process.exit(1);
        }

        process.exit(0);
    });

function processSet(code, cb) {
    winston.info("Processing set: %s", code);

    tiptoe(
        function getJSON() {
            fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
        },
        function processCards(setRaw) {
            var newSet = clone(C.SETS.find(function(SET) { return SET.code === code; }));
            newSet.cards = JSON.parse(setRaw).cards;
            newSet.code = code; // Needed for shared.saveSet()

            shared.saveSet(newSet, this);
        },
        function finish(err){
            setImmediate(cb, err);
        }
    );
}
