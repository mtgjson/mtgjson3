/*jslint node: true */
"use strict";

var base = require('@sembiance/xbase');
var C = require('../shared/C');
var shared = require('../shared/shared');
var tiptoe = require("tiptoe");
var rip = require("./rip.js");

var setsToDo = shared.getSetsToDo();

setsToDo.removeAll(C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes()));

base.info("Doing sets: %s", setsToDo);

setsToDo.serialForEach(
	function(arg, subcb) {
		var targetSet = C.SETS.mutateOnce(function(SET) {
			if (SET.name.toLowerCase() === arg.toLowerCase() || SET.code.toLowerCase() === arg.toLowerCase()) {
				return SET;
			}
		});
		if (!targetSet) {
			base.error("Set %s not found!", arg);
			return setImmediate(subcb);
		}

		if (targetSet.isMCISet) {
			base.error("Set %s is an MCI set, use importMCISet.js instead.", arg);
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
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
