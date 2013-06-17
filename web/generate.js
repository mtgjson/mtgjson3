"use strict";

var base = require("node-base"),
	C = require("C"),
	util = require("util"),
	rimraf = require("rimraf"),
	printUtil = require("node-utils").print,
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("node-utils").dust,
	tiptoe = require("tiptoe");

var dustData = 
{
	title : "Magic the Gathering card data in JSON format",
	sets  : []
};

tiptoe(
	function removeJSONDirectory()
	{
		rimraf(path.join(__dirname, "json"), this);
	},
	function createJSONDirectory()
	{
		fs.mkdir(path.join(__dirname, "json"), this);
	},
	function loadJSON()
	{
		C.SETS.forEach(function(SET)
		{
			fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this.parallel());
		}.bind(this));
	},
	function saveSets()
	{
		var args=arguments;

		var allSets = {};
		var allSetsWithRulings = {};

		C.SETS.forEach(function(SET, i)
		{
			var setWithRulings = JSON.parse(args[i]);
			allSetsWithRulings[SET.code] = setWithRulings;
			
			var set = base.clone(setWithRulings, true);
			set.cards.forEach(function(card) { delete card.rulings; });
			allSets[SET.code] = set;

			fs.writeFile(path.join(__dirname, "json", SET.code + ".json"), JSON.stringify(set), {encoding : "utf8"}, this.parallel());
			fs.writeFile(path.join(__dirname, "json", SET.code + "-r.json"), JSON.stringify(setWithRulings), {encoding : "utf8"}, this.parallel());

			var setSize = printUtil.toSize(JSON.stringify(set).length, 0);
			setSize = "&nbsp;".repeat(6-setSize.length) + setSize;

			var setRSize = printUtil.toSize(JSON.stringify(setWithRulings).length, 0);
			setRSize = "&nbsp;".repeat(6-setRSize.length) + setRSize;

			dustData.sets.push({code : SET.code, name : SET.name, size : setSize, sizer : setRSize});
		}.bind(this));

		dustData.sets = dustData.sets.sort(function(a, b) { return a.code.localeCompare(b.code); });

		dustData.allSize = printUtil.toSize(JSON.stringify(allSets).length, 1);
		dustData.allSizeR = printUtil.toSize(JSON.stringify(allSetsWithRulings).length, 1);

		fs.writeFile(path.join(__dirname, "json", "AllSets.json"), JSON.stringify(allSets), {encoding : "utf8"}, this.parallel());
		fs.writeFile(path.join(__dirname, "json", "AllSets-r.json"), JSON.stringify(allSetsWithRulings), {encoding : "utf8"}, this.parallel());
	},
	function render()
	{
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