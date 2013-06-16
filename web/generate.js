"use strict";

var base = require("node-base"),
	C = require("C"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("node-utils").dust,
	tiptoe = require("tiptoe");

tiptoe(
	function render()
	{
		var dustData =
		{
			title : "Magic the Gathering card data in JSON format"
		};

		dustUtil.render(__dirname, "index", dustData, { keepWhitespace : true }, this);
		//dustUtils.render(post.contentPath, "content", post, { keepWhitespace : true }, this);
	},
	function save(html)
	{
		fs.writeFile(path.join(__dirname, "index.html"), html, {encoding:"utf8"}, this);
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