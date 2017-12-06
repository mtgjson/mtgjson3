[![Changelog](https://img.shields.io/badge/dynamic/json.svg?label=latest%20release&colorB=4ac41d&prefix=v&query=$.version&uri=https%3A%2F%2Fmtgjson.com%2Fjson%2Fversion-full.json)](https://mtgjson.com/changelog.html)


Intro
-----

This is the code used to generate the JSON for [mtgjson.com](http://mtgjson.com/)

I didn't plan on open-sourcing this, so there are rough edges. See 'Other' section below.

Requirements
------------

* Linux or MacOS (never tested under Windows)
* [Node.js](http://nodejs.org/) v0.10.0 or later. It will NOT work with 0.9.9 or earlier.

Setup
-----

    npm install
    # See 'Other' below

Usage
-----

    cd build
    node buildSet.js <expansion code>

This creates the file:

    json/<expansion code>.json

You will need to run this twice for any 'new' sets. First pass doesn't include foreign langauges.

Troubleshooting
---------------

If something doesn't work after doing a `git pull` update, make sure you also update NPM modules with

    npm update

Including a new set
-------------------

If you're building mtgjson data on your own, you should follow the following steps to be able to grab the new set data:

* make sure the new set is already available on gatherer
* add a file describing the set in `shared/set_configs` or an appropriate subdirectory
* `node build/buildSet NEWSETCODE`
* check your json files to see if everything is in order
* `node util/updatePrintingsFromSet NEWSETCODE` -- This will update the printings on the previous sets, using the data from the new set.
* `node util/updateRulingsFromSet NEWSETCODE` -- Same as above, but for rulings.
* `node util/updateLegalitiesFromSet NEWSETCODE` -- Same as above, but for legalities.

Other
-----

All gatherer page requests are cached to the cache directory and any future requests will use the cached version instead.

The 'verify' directory is a little private local webpage I use to verify that my JSON is correct by comparing it side by side with card images.

The 'web' directory is used to generate the mtgjson.com website.

Note that both verify and web have some symbolic links to files that only exist on my local dev workstation. Sorry.
