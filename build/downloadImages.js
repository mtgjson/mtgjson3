"use strict";
/*global setImmediate: true*/

var base = require("base"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	hash = require("mhash").hash,
	unicodeUtil = require("node-utils").unicode,
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

var IMAGES_PATH = "/mnt/compendium/DevLab/common/images/originals/mtg/cards";

function usage()
{
	base.error("Usage: node %s <set code or name>", process.argv[1]);
	process.exit(1);
}

if(process.argv.length<3)
	usage();

var setsToDo = process.argv.slice(2);
if(setsToDo.length===1 && setsToDo[0].toLowerCase()==="allsets")
	setsToDo = C.SETS.map(function(SET) { return SET.code; });

setsToDo.serialForEach(function(arg, subcb)
{
	var targetSet = C.SETS.mutateOnce(function(SET) { if(SET.name.toLowerCase()===arg.toLowerCase() || SET.code.toLowerCase()===arg.toLowerCase()) { return SET; } });
	if(!targetSet)
	{
		base.error("Set %s not found!", arg);
		setImmediate(subcb);
		return;
	}

	tiptoe(
		function rip()
		{
			downloadImages(targetSet.code, this);
		},
		function save(set)
		{
			fs.writeFile(path.join(__dirname, "..", "json", set.code + ".json"), JSON.stringify(set), {encoding:"utf8"}, this);
		},
		function finish(err)
		{
			subcb(err);
		}
	);
}, function exit(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});


function downloadImages(setCode, cb)
{
	if(fs.existsSync(path.join(IMAGES_PATH, setCode)))
	{
		base.error("Set images directory (%s) already exists!", setCode);
		setImmediate(cb);
		return;
	}

	fs.mkdirSync(path.join(IMAGES_PATH, setCode));

	tiptoe(
		function loadJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", setCode + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(err, setJSON)
		{
			if(err)
			{
				setImmediate(function() { cb(err); });
				return;
			}

			var set = JSON.parse(setJSON);
			set.cards.serialForEach(function(card, subcb)
			{
				tiptoe(
					function downloadImage()
					{
						var imageURL = url.format(
						{
							protocol : "http",
							host     : "gatherer.wizards.com",
							pathname : "/Handlers/Image.ashx",
							query    :
							{
								multiverseid : card.multiverseid,
								type         : "card"
							}
						});

						base.info("Downloading image for card: %s", card.name);

						var requester = request(imageURL);
						requester.pipe(fs.createWriteStream(path.join(IMAGES_PATH, setCode, card.imageName + ".jpg")));
						requester.on("end", this);

						request(imageURL, this);
					},
					function finish(err)
					{
						setImmediate(function() { subcb(err); });
					}
				);
			}, cb);
		}
	);
	
}