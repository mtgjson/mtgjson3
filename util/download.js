"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	httpUtil = require("xutil").http,
	tiptoe = require("tiptoe");

	process.exit(0);

httpUtil.get(targetURL, {timeout:base.SECOND*10, retry:5}, this);