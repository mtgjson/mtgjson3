"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	cheerio = require("cheerio"),
	request = require("request"),
	url = require("url"),
	shared = require("shared"),
	hash = require("mhash").hash,
	fileUtil = require("xutil").file,
	path = require("path"),
	tiptoe = require("tiptoe");

if(process.argv.length<3)
{
	base.error("Usage: node %s <url>", process.argv[1]);
	process.exit(1);
}

var urlHash = hash("whirlpool", process.argv[2]);
base.info(path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash));
