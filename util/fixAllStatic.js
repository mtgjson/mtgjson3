'use strict';

var C = require('../shared/C');
var async = require('async');
var tiptoe = require('tiptoe');

var updateLegalities = require('./updateLegalitiesFromSet');
var updatePrintings = require('./updatePrintingsFromSet');
var updateRulings = require('./updateRulingsFromSet');

var sets = [];

C.SETS.reverse().forEach(function(set) {
    if (set.isMCISet)
        return;

    sets.push(set.code);
});

async.eachSeries(sets, function(setCode, cb) {
    tiptoe(
        function() {
            updateLegalities(setCode, this);
        },
        function() {
            updatePrintings(setCode, this);
        },
        function() {
            updateRulings(setCode, this);
        },
        cb
    );
});
