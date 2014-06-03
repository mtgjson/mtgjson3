"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

process.exit(0);

var artists = [];
var artistCounts = {};

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
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		artists.uniqueBySort().sort().forEach(function(artist)
		{
			base.info("%s (%d)", artist, artistCounts[artist]);
		});
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
		function compare(setRaw)
		{
			var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.code===setCode) { return SET; } });
			var set = JSON.parse(setRaw);

			set.cards.forEach(function(card)
			{
				if(card.artist)
				{
					card.artist = card.artist.replaceAll(" and ", " & ");
					Object.forEach(C.ARTIST_CORRECTIONS, function(correctArtist, artistAliases)
					{
						if(artistAliases.contains(card.artist))
							card.artist = correctArtist;
					});

					artists.push(card.artist);
					if(!artistCounts.hasOwnProperty(card.artist))
						artistCounts[card.artist] = 0;
					artistCounts[card.artist] = artistCounts[card.artist] + 1;
				}
			});

			fs.writeFile(path.join(__dirname, "..", "json", setCode + ".json"), JSON.stringify(set), {encoding : "utf8"}, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}



// Replace any artists that have " and " with " & "

