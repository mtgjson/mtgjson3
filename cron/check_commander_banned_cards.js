#!/usr/local/bin/node

"use strict";

var fs = require("fs"),
	path = require("path"),
	request = require('request'),
	domino = require("domino"),
	tiptoe = require("tiptoe"),
	winston = require("winston");

tiptoe(
	function getPageAndPrevious()
	{
		request("http://magic.wizards.com/en/gameinfo/gameplay/formats/commander", this.parallel());
		fs.readFile(path.join(__dirname, "previous_banned_commander_cards.json"), { encoding : "utf8"}, this.parallel());
	},
	function compareVersions(cardsHTML, previousCardsJSON)
	{
		var cards = Array.toArray(domino.createWindow(cardsHTML[0]).document.querySelectorAll("ul.list-links li a")).map(function(o) { return o.textContent.trim(); }).filterEmpty();
		if(cards.length<1)
		{
			winston.error("No cards found! Probably a temporary error...");
			process.exit(1);
		}

		var previousCards = JSON.parse(previousCardsJSON);

		var removedCards = previousCards.subtract(cards);
		if(removedCards.length)
			winston.info("Cards Removed: %s", removedCards.join(", "));

		var addedCards = cards.subtract(previousCards);
		if(addedCards.length)
			winston.info("Cards Added: %s", addedCards.join(", "));

		fs.writeFile(path.join(__dirname, "previous_banned_commander_cards.json"), JSON.stringify(cards, null, '  '), {encoding : "utf8"}, this);
	},
	function finish(err)
	{
		if(err)
		{
			winston.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
