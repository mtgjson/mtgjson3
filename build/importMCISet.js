/*jslint node: true */
'use strict';

var base = require('xbase');
var C = require('C');
var shared = require('shared');
var tiptoe = require('tiptoe');
var rip = require('./rip.js');
var async = require('async');

var setsToDo = shared.getSetsToDo();

base.info('Doing sets: %s', setsToDo);

async.eachSeries(setsToDo, function(arg, callback) {
	var targetSet = C.SETS.mutateOnce(function(SET) { if (SET.name.toLowerCase() === arg.toLowerCase() || SET.code.toLowerCase() === arg.toLowerCase()) { return SET; } });

	if(!targetSet) {
		base.error('Set %s not found!', arg);
		return setImmediate(callback);
	}

	if(!targetSet.isMCISet) {
		base.error('Set %s is not an MCI set (isMCISet is not set)', arg);
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
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});
