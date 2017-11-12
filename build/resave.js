/*jslint node: true */
"use strict";

var C = require('../shared/C'),
    async = require('async'),
    fs = require("fs"),
    path = require("path"),
    shared = require('../shared/shared'),
    tiptoe = require("tiptoe"),
    winston = require("winston");

var setsToDo = shared.getSetsToDo();

setsToDo.removeAll(C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes()));

winston.info("Doing sets: %s", setsToDo);

async.eachSeries(
    setsToDo,
    function(arg, subcb) {
        var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===arg.toLowerCase() || SET.code.toLowerCase()===arg.toLowerCase()) { return SET; } });
        if(!targetSet)
        {
            winston.error("Set %s not found!", arg);
            return setImmediate(subcb);
        }

        if(targetSet.isMCISet)
        {
            winston.error("Set %s is an MCI set, use importMCISet.js instead.", arg);
            return setImmediate(subcb);
        }


        tiptoe(
            function loadJSON() {
                winston.info("Loading file for set %s (%s)", targetSet.name, targetSet.code);
                fs.readFile(path.join(__dirname, "..", "json", targetSet.code + ".json"), "utf8", this);
            },
            function convertAndSave(JSONRaw) {
                var set = JSON.parse(JSONRaw);
                shared.saveSet(set, this);
            },
            function finish(err) {
                setImmediate(function() { subcb(err); });
            }
        );

        winston.info("Done with %s.", targetSet.name);
    },
    function exit(err) {
        if(err) {
            winston.error(err);
            process.exit(1);
        }

        process.exit(0);
    });
