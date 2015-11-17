"use strict";

var base = require("xbase"),
	C = require("C"),
	runUtil = require("xutil").run,
	rimraf = require("rimraf"),
	printUtil = require("xutil").print,
	diffUtil = require("xutil").diff,
	unicodeUtil = require("xutil").unicode,
	fs = require("fs"),
	path = require("path"),
	dustUtil = require("xutil").dust,
	moment = require("moment"),
	shared = require("shared"),
	tiptoe = require("tiptoe");

var dustData =  {
	title : "Spoilers"
};

/** Process each item on the vector */
Array.prototype.process = function(callback) {
	this.forEach(function(value, idx) {
		this[idx] = callback(value, idx);
	}.bind(this));
	return(this);
};

function mtgManaConvert(value) {
	value = value.replace('{', '').replace('}', '').replace('/', '').toLowerCase();
	if (value === "t")
		return('<i class="mtg tap"></i>');
	return('<i class="mtg mana-' + value + '"></i>');
}

// Generate spoilers
function generateSpoilerForSetName(setName, lang, cb) {
	lang = lang || 'en';
	var mySet = null;

	C.SETS.forEach(function(set) {
		if (set.code.toLowerCase() == setName.toLowerCase()) {
			mySet = set;
		}
	});

	if (mySet == null) {
		base.error('Cannot find set %s', setName);
		if (cb) cb(null);
		return;
	}

	var set = null;

	tiptoe(
		function loadSet() {
			base.info('Generating spoilers for set %s', setName);
			fs.readFile(path.join(__dirname, "..", "json", mySet.code + ".json"), {encoding : "utf8"}, this);
		},
		function parseSet(jsonRaw) {
			set = JSON.parse(jsonRaw);
			this();
		},
		function renderHTML() {
			dustData.title = set.name + ' spoilers';
			dustData.setName = set.name;
			dustData.cards = set.cards;
			dustData.cards.forEach(function(card) {
				// mtgicons set class
				card.setClass = set.name.toLowerCase().replaceAll(' ', '-');
				if (card.rarity.toLowerCase() !== "common")
					card.setClass += ' ' + card.rarity.toLowerCase();

				// mtgicons mana cost
				card.manaIcons = [];
				if (card.manaCost)
					card.manaIcons = card.manaCost.match(/{[^}]*}/g).process(function(value) {
						return('mana-' + value.replace('{', '').replace('}' ,'').replace('/' ,'').toLowerCase());
					});

				// Line breaks
				if (card.text)
					card.text = card.text.replaceAll('\n', '<br />').replaceAll('"', '&quot;');
				if (card.flavor)
					card.flavor = card.flavor.replaceAll('\n', '<br />').replaceAll('"', '&quot;');
			});
			dustData.dustText = function(val, idx) {
				var card = this.cards[this['$idx']];

				if (!card.text)
					return('');

				var converted = card.text.replace(/{[^}]*}/g, mtgManaConvert);
				return(converted);
			}
			dustData.dustFlavor = function(val, idx) {
				var card = this.cards[this['$idx']];

				if (!card.flavor)
					return('');

				var converted = card.flavor.replace(/{[^}]*}/g, mtgManaConvert);
				return(converted);
			}
			dustData.imgUrl = function(val, idx) {
				var card = this.cards[this['$idx']];
				var url = 'http://magiccards.info/scans/en/' + set.magicCardsInfoCode + '/' + card.number + '.jpg';

				return(url);
			}

			dustUtil.render(__dirname, "spoiler", dustData, { keepWhitespace : true }, this);
		},
		function finish(err, html) {
			if (err) throw(err);
			if (cb)
				cb(null, html);	
		}
	);
}

C.SETS.serialForEach(
	function(setInfo, cb) {
		var setName = setInfo.code;
		if (setInfo.isMCISet) {
			setImmediate(cb);
			return;
		}

		tiptoe(
			function() {
				generateSpoilerForSetName(setName, null, this);
			},
			function saveSet(html) {
				fs.writeFile(path.join(__dirname, setName.toLowerCase() + ".html"), html, { encoding: "utf8" }, this);
			},
			function finish(err) {
				if (err)
					cb(err);
				cb();
			}
		);
	},
	function(err) {
		if (err) throw(err);
		base.info('All done.');
	}
);
