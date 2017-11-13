'use strict';

var pug = require('pug');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var tiptoe = require('tiptoe');
var async = require('async');
var moment = require('moment');
var winston = require('winston');
var childProcess = require("child_process");

var ansidiff = require('ansidiff');

var C = require('../shared/C');
var clone = require('clone');

var JSONP_PREFIX = 'mtgjsoncallback(';
var JSONP_SUFFIX = ');';
var output = path.join(__dirname, '..', 'public');
var jsonRoot = path.join(output, 'json');

// Jade Params
var params = {
    title : "Magic the Gathering card data in JSON format",    // for atom
    analytics: "<scr" + "ipt>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-66983210-2', 'auto');ga('send', 'pageview');</scr" + "ipt>",
    sets: {},
    moment: moment
};

var SETS = [];
// Sets variables
var allSets = {};
var allSetsWithExtras = {};
var allSetsArray = [];
var allSetsArrayWithExtras = [];

// Cards variables
var allCardsWithExtras = {};
var allCards = {};

// Other stuff
var previousSeenSetCodes = {};
var taintedCards = [];


function processCard(SET, card, callback) {
    if (!allCardsWithExtras.hasOwnProperty(card.name)) {
        allCardsWithExtras[card.name] = {};
    }

    if(!previousSeenSetCodes.hasOwnProperty(card.name))
        previousSeenSetCodes[card.name] = {};

    var checkTaint = function(fieldName, fieldValue) {
        if (SET.code == 'UGL')
            // ignore un-sets.
            return;

        if (!fieldValue) {
            if (card.hasOwnProperty(fieldName))
                fieldValue = card[fieldName];
        }

        // Do nothing if we do not have a previous value.
        if (!allCardsWithExtras[card.name].hasOwnProperty(fieldName))
            return;

        var previousValue = allCardsWithExtras[card.name][fieldName];

        var taint = false;
        var diff = null;
        if (previousValue) {
            if (!fieldValue) {
                taint = true;
            }
            else
                diff = ansidiff.words(previousValue, fieldValue);

            if (diff) {
                taint = true
            }
        }

        if (taint) {
            taintedCards.push({ card: card, fieldName: fieldName });
            winston.info("Tainted field %s on card '%s' (%s)", fieldName, card.name, SET.code);
            if (diff)
                winston.info(diff);
        }
    };

    async.eachSeries(
        Object.keys(C.FIELD_TYPES),
        function(fieldName, subcb) {
            if (C.SET_SPECIFIC_FIELDS.includes(fieldName)) {
                setImmediate(subcb);
                return;
            }

            if (!previousSeenSetCodes[card.name].hasOwnProperty(fieldName))
                previousSeenSetCodes[card.name][fieldName] = [];

            var fieldValue = card[fieldName];
            if (fieldName === "imageName")        // Modify for AllCards.json the imageName field
                fieldValue = card.name.toLowerCase().replace(new RegExp(":\"?", "g"), "").replace(new RegExp("/", "g"), " ").replace(new RegExp("^[0-9 \.]+|[0-9 \.]+$", "g"), "").replace(new RegExp(" token card", "g"), "");

            if (C.ORACLE_FIELDS.includes(fieldName) && fieldName !== 'foreignNames') {
                checkTaint(fieldName, fieldValue);
            }

            previousSeenSetCodes[card.name][fieldName].push(SET.code);
            allCardsWithExtras[card.name][fieldName] = fieldValue;

            setImmediate(subcb);
        },
        callback
    );

}

function processSet(SET, callback) {
    winston.info(SET.code);
    // Fix cards
    async.each(
        SET.cards,
        function(card, cb) {
            processCard(SET, card, cb);
        },
        function(err) {
            delete SET.isMCISet;
            delete SET.magicRaritiesCode;
            delete SET.essentialMagicCode;
            delete SET.useMagicRaritiesNumber;

            // Create Simple Set
            var SimpleSet = clone(SET);
            async.each(SimpleSet.cards, function(card, cb) {
                // Strip out extras
                async.each(C.EXTRA_FIELDS, function(EXTRA_FIELD, subcb) {
                    delete card[EXTRA_FIELD];
                    setImmediate(subcb);
                }, cb);
            });

            if (callback)
                setImmediate(callback, null, SET, SimpleSet);
        }
    );
}

function saveSet(Code, FullSET, SimpleSET, callback) {
    var done = false;
    var i = 0;

    var setPrefix = path.join(jsonRoot, Code);

    var _ss = JSON.stringify(SimpleSET, null, 2);
    var _fs = JSON.stringify(FullSET, null, 2);

    var Size = _ss.length;
    var FullSize = _fs.length;

    // Add a function to the counter and return the check function.
    var push = function() {
        i++;
        return(check);
    };

    // Checks for errors and check if we're done. Once we're done, fire the callback.
    var check = function(err) {
        if (err)
            throw(err);

        i--;
        if (done && i == 0)
            callback && callback(null, FullSize, Size);
    };

    fs.writeFile(setPrefix + '.json', _ss, { encoding: 'utf8' }, push());
    fs.writeFile(setPrefix + '-x.json', _fs, { encoding: 'utf8' }, push());

    if (Code == 'CON') {
        fs.writeFile(setPrefix + '_.json', _ss, { encoding: 'utf8' }, push());
        fs.writeFile(setPrefix + '_.jsonp', JSONP_PREFIX + _ss + JSONP_SUFFIX, { encoding: 'utf8' }, push());
    }

    // JSONP
    fs.writeFile(setPrefix + '.jsonp', JSONP_PREFIX + _ss + JSONP_SUFFIX, { encoding: 'utf8' }, push());
    fs.writeFile(setPrefix + '-x.jsonp', JSONP_PREFIX + _fs + JSONP_SUFFIX, { encoding: 'utf8' }, push());

    done = true;
}

/**
 * Creates a list of all the files on a given folder and gives it to the callback function.
 * Adapted from stackoverflow: http://stackoverflow.com/a/5827895/488212
 */
var walk = function(dir, callback) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return(callback(err));

        if (list.length == 0) return(setImmediate(callback, null, results));

        async.each(
            list,
            function(file, cb) {
                file = path.resolve(dir, file);

                fs.stat(file, function(err, stat) {
                    if (err) return(callback(err));

                    if (stat && stat.isDirectory())
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            cb();
                        });
                    else {
                        results.push(file);
                        cb();
                    }
                });
            },
            function() {
                setImmediate(callback, null, results);
            }
        );
    });
};

// Start processing...
tiptoe(
    function removeDirectory() {
        winston.info("Clearing Output directory...");
        rimraf(output, this);
    },
    function createDirectoryStructure() {
        tiptoe(
            function() {
                fs.mkdir(output, this);
            },
            function() {
                fs.mkdir(jsonRoot, this);
            },
            this
        );
    },
    function loadJSON() {
        winston.info("Loading JSON...");
        async.eachSeries(
            C.SETS,
            function(SET, cb) {
                fs.readFile(path.join(__dirname, '..', 'json', SET.code + '.json'), { encoding: 'utf8' }, function(err, data) {
                    if (err) throw(err);
                    SETS.push(JSON.parse(data));
                    cb();
                });
            },
            this
        );
    },
    function processJSON() {
        async.eachSeries(
            SETS,
            function(SET, cb) {
                params.sets[SET.code] = {
                    code: SET.code,
                    releaseDate : SET.releaseDate
                };

                processSet(SET, function(err, FullSET, SimpleSET) {
                    allSetsWithExtras[SET.code] = FullSET;
                    allSetsArrayWithExtras.push(FullSET);
                    allSets[SET.code] = SimpleSET;
                    allSetsArray.push(SimpleSET);

                    saveSet(SET.code, FullSET, SimpleSET, function(err, FullSize, SimpleSize) {
                        params.sets[SET.code].simpleSize = SimpleSize;
                        params.sets[SET.code].fullSize = FullSize;
                        cb();
                    });
                });
            },
            this
        );
    },
    function saveFullJSON() {
        var save = function(fname, data, callback) {
            var _data = JSON.stringify(data, null, 2);
            var size = _data.length;

            tiptoe(
                function() {
                    fs.writeFile(path.join(jsonRoot, fname + '.json'), _data, 'utf-8', this.parallel());
                    fs.writeFile(path.join(jsonRoot, fname + '.jsonp'), JSONP_PREFIX + _data + JSONP_SUFFIX, 'utf-8', this.parallel());
                },
                function(err) {
                    if (callback) setImmediate(callback, err, size);
                }
            );
        };

        // Generate allCards object.
        allCards = clone(allCardsWithExtras);
        Object.values(allCards).forEach(function(card) {
            // Strip out extras
            C.EXTRA_FIELDS.forEach(function(EXTRA_FIELD) {
                delete card[EXTRA_FIELD];
            });
        });

        var dataBlock = {
            'AllSets': { data: allSets, param: 'allSize' },
            'AllSets-x': { data: allSetsWithExtras, param: 'allSizeX' },
            'AllSetsArray': { data: allSetsArray, param: 'allSizeArray' },
            'AllSetsArray-x': { data: allSetsArrayWithExtras, param: 'allSizeArrayX' },
            'AllCards': { data: allCards, param: 'allCards' },
            'AllCards-x': { data: allCardsWithExtras, param: 'allCardsX' }
        };

        async.eachSeries(
            Object.keys(dataBlock),
            function(block, cb) {
                winston.info("Saving %s...", block);
                save(block, dataBlock[block].data, function(err, size) {
                    if (err) throw(err);
                    dataBlock[dataBlock[block].param] = size;
                    cb();
                });
            },
            this
        );
    },
    function changelog() {
        fs.readFile(path.join(__dirname, 'changelog.json'), { encoding: 'utf8' }, this);
    },
    function staticInfo(changelog_raw) {
        var changelog = JSON.parse(changelog_raw);

        params.changelog = changelog.map(function(o, i) {
            o.whenAtom = moment(o.when, "YYYY-MM-DD").format("YYYY-MM-DDTHH:mm:ss");
            o.whenSiteMap = o.when;
            o.when = moment(o.when, "YYYY-MM-DD").format("MMM D, YYYY");
            o.uniqueID = changelog.length-i;
            o.atomContent = "<p>Changes:<br><ul>" + o.changes.map(function(change) { return "<li>" + change + "</li>"; }).join("") + "</ul></p>";
            return o;
        });

        // Update stuff for our html output
        params.version = changelog[0].version;
        params.changeLogAtom = changelog.slice(0, 9);

        params.lastUpdatedAtom = params.changelog[0].whenAtom;
        params.lastUpdated = params.changelog[0].when;
        params.lastUpdatedSiteMap = params.changelog[0].whenSiteMap;
        params.setSpecificFields = C.SET_SPECIFIC_FIELDS.sort().join(", ");

        // SetCodes
        var setCodes = JSON.stringify(C.SETS.map(function(SET) { return SET.code; }), null, 2);
        fs.writeFile(path.join(jsonRoot, 'SetCodes.json'), setCodes, { encoding : 'utf8' }, this.parallel());
        fs.writeFile(path.join(jsonRoot, 'SetCodes.jsonp'), JSONP_PREFIX + setCodes + ', "SetCodes"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

        // SetList
        var setList = JSON.stringify(C.SETS.map(function(SET) { return { name : SET.name, code : SET.code, releaseDate : SET.releaseDate, block: SET.block }; }), null, 2);
        fs.writeFile(path.join(jsonRoot, 'SetList.json'), setList, { encoding : 'utf8' }, this.parallel());
        fs.writeFile(path.join(jsonRoot, 'SetList.jsonp'), JSONP_PREFIX + setList + ', "SetList"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

        // Version
        var version = JSON.stringify({ version: params.version }, null, 2);
        fs.writeFile(path.join(jsonRoot, 'version-full.json'), version, { encoding : 'utf8' }, this.parallel());
        fs.writeFile(path.join(jsonRoot, 'version-full.jsonp'), JSONP_PREFIX + version + ', "version-full"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

        fs.writeFile(path.join(jsonRoot, 'version.json'), JSON.stringify(params.version), { encoding : 'utf8' }, this.parallel());
        fs.writeFile(path.join(jsonRoot, 'version.jsonp'), JSONP_PREFIX + JSON.stringify(params.version) + ', "version"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());

        // Changelog
        var cl = JSON.stringify(changelog, null, 2);
        fs.writeFile(path.join(jsonRoot, 'changelog.json'), cl, { encoding : 'utf8' }, this.parallel());
        fs.writeFile(path.join(jsonRoot, 'changelog.jsonp'), JSONP_PREFIX + cl + ', "changelog"' + JSONP_SUFFIX, { encoding : 'utf8' }, this.parallel());
    },
    function createHTML() {
        var options = {
            pretty: true
        };
        var save = function(jadefn, fn, callback) {
            var func = pug.compileFile(path.join(__dirname, jadefn), options);
            var html = func(params);

            fs.writeFile(path.join(output, fn), html, 'utf-8', callback);
        };

        save('index.pug', 'index.html', this.parallel());
        save('atom.pug', 'atom.xml', this.parallel());
        save('sitemap.pug', 'sitemap.xml', this.parallel());
        save('sets.pug', 'sets.html', this.parallel());
        save('changelog.pug', 'changelog.html', this.parallel());
        save('documentation.pug', 'documentation.html', this.parallel());
    },
    function zipFiles() {
        winston.info("Compressing JSON files...");
        var self = this;
        var options = {cwd: jsonRoot};
        fs.readdir(jsonRoot, function(err, files) {
            if (err) return self(err);
            async.eachSeries(files, function(file, subcb) {
                var cmds = [
                    'zip -9 ' + file + '.zip ' + file,
                    'gzip -k ' + file
                ];
                async.eachSeries(cmds, function(cmd, cmdcb) {
                    childProcess.exec(cmd, options, function(err, stdout, stderr) {
                        if (stdout) winston.info(stdout);
                        if (stderr) winston.error(stderr);
                        return cmdcb(err);
                    });
                }, subcb);
            }, self);
        });
    },
    function zipSpecial() {
        var self = this;
        var options = {cwd: jsonRoot};

        var allCodes = C.SETS.map(function(SET) { return SET.code + ".json"; });
        var allCodesX = C.SETS.map(function(SET) { return SET.code + "-x.json"; });
        var allCodesWin = C.SETS.map(function(SET) { return SET.code + (SET.code==="CON" ? "_" : "") + ".json"; });


        var cmds = [
            'zip -9 AllSetFiles.zip ' + allCodes.join(' '),
            'zip -9 AllSetFiles-x.zip ' + allCodesX.join(' '),
            'zip -9 AllSetFilesWindows ' + allCodesWin.join(' ')
        ];
        async.eachSeries(cmds, function(cmd, cmdcb) {
            childProcess.exec(cmd, options, function(err, stdout, stderr) {
                if (stdout) winston.info(stdout);
                if (stderr) winston.error(stderr);
                return cmdcb(err);
            });
        }, self);
    },
    function createFolders() {
        // Create folders. This should me automated on copyFiles() step somehow.
        fs.mkdir(path.join(output, 'java'), this.parallel());
        fs.mkdir(path.join(output, 'images'), this.parallel());
        fs.mkdir(path.join(output, 'fonts'), this.parallel());
    },
    function generateList() {
        var self = this;
        winston.info("Generating static file list...");

        walk(__dirname, function(err, files) {
            var relative = files.map(function(value) { return(value.replace(__dirname + '/', '')); });

            var final = relative.filter(function(value) {
                return(value.match(/\.(png|css|java|jpe?g|eot|svg|ttf|woff)$/) != null);
            });

            self(err, final);
        });
    },
    function copyFiles(files) {
        var self = this;
        async.each(
            files,
            function(file, cb) {
                var source = path.join(__dirname, file);
                var target = path.join(output, file);

                var rd = fs.createReadStream(source);
                rd.on('error', cb);
                var wr = fs.createWriteStream(target);
                wr.on('error', cb);
                wr.on('finish', cb);
                rd.pipe(wr);
            },
            function () { self(null, files); }
        );
    },
    function zipFiles() {
        var self = this;
        winston.info("GZipping static files...");

        walk(output, function(err, files) {
            if (err) {
                return(self(err));
            }

            var final = files.filter(function(value) {
                return(value.match(/\.(css|java|eot|svg|ttf|woff|html?|xml)$/) != null);
            });

            async.each(final, function(file, cb) {
                var cmd = 'gzip -k ' + path.basename(file);
                var options = {cwd: path.dirname(file)};
                childProcess.exec(cmd, options, function(err, stdout, stderr) {
                    if (stdout) winston.info(stdout);
                    if (stderr) winston.error(stderr);
                    return cb(err);
                });
            }, self);
        });
    },
    function(err) {
        if (err) throw(err);

        winston.info('public folder generation finished.');
    }
);
