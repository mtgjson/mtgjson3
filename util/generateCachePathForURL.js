"use strict";

var base = require('@sembiance/xbase'),
	shared = require("shared");

if (process.argv.length < 3) {
	base.error("Usage: node %s <url>", process.argv[1]);
	process.exit(1);
}

base.info(shared.generateCacheFilePath(process.argv[2]));
