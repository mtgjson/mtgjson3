Intro
-----

This is the code used to generate the JSON for [mtgjson.com](http://mtgjson.com/)

I didn't plan on open-sourcing this, so there are rough edges. See 'Other' section below.

Requirements
------------

* Linux (never tested under MacOS or Windows)
* [Node.js](http://nodejs.org/) v0.10.0 or later. It will NOT work with 0.9.9 or earlier.

Setup
-----

    mkdir cache
    cd cache
    mkdir 0 1 2 3 4 5 6 7 8 9 a b c d e f
    cd ..
    npm install
    cd node_modules
    ln -s ../shared/C.js
    ln -s ../shared/shared.js
    cd ..
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


Other
-----

All gatherer page requests are cached to the cache directory and any future requests will use the cached version instead.

The 'verify' directory is a little private local webpage I use to verify that my JSON is correct by comparing it side by side with card images.

The 'web' directory is used to generate the mtgjson.com website.

Note that both verify and web have some symbolic links to files that only exist on my local dev workstation. Sorry.
