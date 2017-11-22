"use strict";

var C = require('../shared/C'),
    async = require('async'),
    path = require("path"),
    childProcess = require("child_process"),
    tiptoe = require("tiptoe"),
    winston = require("winston");

tiptoe(
    function updateNonGathererSets()
    {
        winston.info("Updating non-gatherer sets...");
        async.eachSeries(
            C.SETS_NOT_ON_GATHERER,
            function(setCode, subcb) {
                var cmd = "node " + path.join(__dirname, "..", "build", "createNonGathererSet.js") + " " + setCode;
                childProcess.exec(cmd, function(err, stdout, stderr) {
                    if (stdout) winston.info(stdout);
                    if (stderr) winston.error(stderr);
                    return subcb(err);
                });
            },
            this);
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
