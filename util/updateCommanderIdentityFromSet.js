"use strict";

var async = require("async"),
    fs = require("fs"),
    path = require("path"),
    shared = require('../shared/shared'),
    tiptoe = require("tiptoe"),
    rip = require('../build/rip.js'),
    winston = require("winston");

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

function processSet(code, cb) {
    winston.info("Processing ColorIdentity for set: %s", code);

    var set = null;

    tiptoe(
        function getJSON() {
            fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
        },
        function processCards(setRaw) {
            set = JSON.parse(setRaw);

            rip.fixCommanderIdentityForCards(set.cards, this);
        },
        function saveSet() {
            if (set === null) {
                throw('Error processing set');
            }

            shared.saveSet(set, this);
        },
        function finish(err) {
            setImmediate(function() { cb(err); });
        }

    );
}
