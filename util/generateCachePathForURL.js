"use strict";

var shared = require('../shared/shared');
var winston = require("winston");

if (process.argv.length < 3) {
	winston.error("Usage: node %s <url>", process.argv[1]);
	process.exit(1);
}

winston.info(shared.generateCacheFilePath(process.argv[2]));
