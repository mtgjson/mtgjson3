/*jslint node: true */
'use strict';

var C = require('../shared/C');
var shared = require('../shared/shared');
var tiptoe = require('tiptoe');
var rip = require('./rip.js');
var winston = require("winston");
var async = require('async');
var winston = require("winston");

var setsToDo = shared.getSetsToDo();

winston.info('Doing sets: %s', setsToDo);

async.eachSeries(setsToDo, function(arg, callback) {
    var targetSet = S.SETS.find(function(SET) {
        return SET.name.toLowerCase() === arg.toLowerCase() || SET.code.toLowerCase() === arg.toLowerCase();
    });

    if(!targetSet) {
        winston.error('Set %s not found!', arg);
        return setImmediate(callback);
    }

    if(!targetSet.isMCISet) {
        winston.error('Set %s is not an MCI set (isMCISet is not set)', arg);
        return setImmediate(callback);
    }

    tiptoe(
        function build() {
            rip.ripMCISet(targetSet, this);
        },
        function save(set) {
            shared.saveSet(set, this);
        },
        callback
    );

}, function exit(err) {
    if(err) {
        winston.error(err);
        process.exit(1);
    }

    process.exit(0);
});
