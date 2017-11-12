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
        request("http://magiccards.info/additions.html", this.parallel());
        fs.readFile(path.join(__dirname, "previous_mci_additions.json"), { encoding : "utf8"}, this.parallel());
    },
    function compareVersions(setsHTML, previousSetsJSON)
    {

        var additions = Array.from(domino.createWindow(setsHTML[0]).document.querySelector("h1").nextElementSibling.querySelectorAll("tr td:nth-child(1) a")).map(function(o) { return o.textContent.trim(); }).filterEmpty();
        if(additions.length<1)
        {
            winston.error("No additions found! Probably a temporary error...");
            process.exit(1);
        }

        var previousAdditions = JSON.parse(previousSetsJSON);

        if(additions.join(", ")!==previousAdditions.join(", "))
            winston.info("Sets changed.\nBefore: %s\n\nAfter: %s", previousAdditions.join(", "), additions.join(", "));

        fs.writeFile(path.join(__dirname, "previous_mci_additions.json"), JSON.stringify(additions, null, '  '), {encoding : "utf8"}, this);
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
