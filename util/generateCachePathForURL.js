"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	hash = require("mhash").hash,
	path = require("path"),
	shared = require("shared"),
	tiptoe = require("tiptoe");

if(process.argv.length<3)
{
	base.error("Usage: node %s <url>", process.argv[1]);
	process.exit(1);
}

base.info(shared.generateCacheFilePath(process.argv[2]));
