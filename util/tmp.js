"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	shared = require("shared"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

process.exit(0);

var mwscodes = ["ARE", "AVR", "BIN", "BNG", "BOK", "BRB", "C13", "CFX", "CH", "CHK", "CHP", "CIN", "CM1", "CMD", "CNS", "CS", "CST", "CVP", "DD2", "DDC", "DDD", "DDE", "DDF", "DDG", "DDH", "DDI", "DDJ", "DDK", "DDL", "DDM", "DGM", "DIS", "DK", "DKA", "DLM", "DM", "DPA", "DRB", "DS", "EVE", "EVG", "EX", "FBP", "FD", "FE", "FNM", "FUT", "GAM", "GP", "GPX", "GTC", "GTW", "H09", "HHL", "HL", "HOP", "I2P", "IA", "IN", "ISD", "JGC", "JOU", "JU", "JUN", "LE", "LG", "LND", "LRW", "M10", "M11", "M12", "M13", "M14", "M15", "MBS", "MGB", "MGD", "MI", "MIN", "MM", "MMA", "MOR", "MPR", "MR", "NE", "NPH", "OD", "ON", "P2", "P3", "PC2", "PD2", "PD3", "PLC", "PRE", "PS", "PT", "PTR", "PY", "RAV", "REL", "ROE", "RS", "RTR", "S00", "SC", "SH", "SHM", "SOK", "SOM", "ST", "STO", "SUM", "TE", "THG", "THS", "TO", "TSB", "TSP", "UD", "UG", "UL", "UNH", "URC", "US", "V09", "V10", "V11", "V12", "V13", "VI", "WL", "WLD", "WWK", "ZEN"];
var matches = [];

tiptoe(
	function processSets()
	{
		C.SETS.map(function(SET) { return SET.code; }).serialForEach(function(code, subcb)
		{
			checkSet(code, subcb);
		}, this);
	},
	function finish(err)
	{
		base.info(matches.unique().join(" "));
		base.info(mwscodes);
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function checkSet(setCode, cb)
{
	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function modifyAndSave(setRaw)
		{
			var set = JSON.parse(setRaw);
			mwscodes.remove(set.code);
			if(set.hasOwnProperty("gathererCode"))
				mwscodes.remove(set.gathererCode);
			if(set.hasOwnProperty("oldCode"))
				mwscodes.remove(set.oldCode);

			/*set.cards.forEach(function(card)
			{
				if(card.layout==="token" || card.border==="silver" || (set.border==="silver" && !card.hasOwnProperty("border")))
					return;

				if(!card.legalities)
				{
					matches.push(setCode);
					base.info("NO LEGALITIES %s: %s", setCode, card.name);
					return;
				}

				if(!card.legalities.hasOwnProperty("Vintage"))
				{
					matches.push(setCode);
					base.info("NO VINTAGE %s: %s", setCode, card.name);
				}
			});*/

			//fs.writeFile(path.join(__dirname, "..", "json", setCode + ".json"), JSON.stringify(set), {encoding : "utf8"}, this);
			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
