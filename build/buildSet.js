/*jslint node: true */
"use strict";

var C = require('../shared/C');
var shared = require('../shared/shared');
var tiptoe = require("tiptoe");
var rip = require("./rip.js");
var async = require("async");
var winston = require("winston");

var setsToDo = shared.getSetsToDo();

setsToDo.removeAll(C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes()));

winston.info("Doing sets: %s", setsToDo);

async.eachSeries(
    setsToDo,
    function(arg, subcb) {
        var targetSet = C.SETS.find(function(SET) {
            return SET.name.toLowerCase() === arg.toLowerCase() || SET.code.toLowerCase() === arg.toLowerCase();
        });
        if (!targetSet) {
            winston.error("Set %s not found!", arg);
            return setImmediate(subcb);
        }

        if (targetSet.isMCISet) {
            winston.error("Set %s is an MCI set, use importMCISet.js instead.", arg);
            return setImmediate(subcb);
        }

        tiptoe(
            function build() {
                rip.ripSet(targetSet.name, this);
            },
            function save(set) {
                shared.saveSet(set, this);
            },
            function finish(err) {
                subcb(err);
            }
        );
    },
    function exit(err) {
        if (err) {
            winston.error(err);
            process.exit(1);
        }

        process.exit(0);
    }
);
