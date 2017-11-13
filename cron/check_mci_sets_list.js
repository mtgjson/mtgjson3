#!/usr/local/bin/node

"use strict";

var url = require("url"),
    C = require('../shared/C'),
    path = require("path"),
    request = require('request'),
    domino = require("domino"),
    tiptoe = require("tiptoe"),
    unique = require("array-unique");
    winston = require("winston");

var MCI_SETS_TO_IGNORE = ["9eb", "8eb", "uhaa"];

tiptoe(
    function getPageAndPrevious()
    {
        request("http://magiccards.info/sitemap.html", this);
    },
    function compareVersions(setsHTML)
    {
        var mciSets = unique(Array.from(domino.createWindow(setsHTML).document.querySelector("a[name='en']").nextElementSibling.nextElementSibling.querySelectorAll("li a")).map(function(o) { return path.dirname(url.parse(o.getAttribute("href")).pathname).substring(1).toLowerCase(); }).filter(Boolean));
        if(mciSets.length<1)
        {
            winston.error("No MCI sets found! Probably a temporary error...");
            process.exit(1);
        }

        var oldMCISets = unique(C.SETS.filter(function(SET) { return SET.hasOwnProperty("magicCardsInfoCode"); }).map(function(SET) { return SET.magicCardsInfoCode.toLowerCase(); }).concat(MCI_SETS_TO_IGNORE));
        var newMCISets = mciSets.filter(function(s) { return !oldMCISets.includes(s); });
        if(newMCISets.length>0)
            winston.info(newMCISets);

        this();
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
