"use strict";

var C = require('../shared/C'),
	path = require("path"),
	runUtil = require('@sembiance/xutil').run,
	tiptoe = require("tiptoe"),
	winston = require("winston");

tiptoe(
	function updateNonGathererSets()
	{
		winston.info("Updating non-gatherer sets...");
		C.SETS_NOT_ON_GATHERER.serialForEach(function(setCode, subcb)
		{
			runUtil.run("node", [path.join(__dirname, "..", "build", "createNonGathererSet.js"), setCode], {"redirect-stderr" : false}, subcb);
		}, this);
	},
	function finish(err)
	{
		if(err)
		{
			winston.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
