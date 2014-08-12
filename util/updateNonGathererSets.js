"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	path = require("path"),
	runUtil = require("xutil").run,
	tiptoe = require("tiptoe");

tiptoe(
	function updateNonGathererSets()
	{
		base.info("Updating non-gatherer sets...");
		C.SETS_NOT_ON_GATHERER.serialForEach(function(setCode, subcb)
		{
			runUtil.run("node", [path.join(__dirname, "..", "build", "createNonGathererSet.js"), setCode], {"redirect-stderr" : false}, subcb);
		}, this);
	},
	function finish(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);