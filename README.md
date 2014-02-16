Intro
-----

This is the code used to generate the JSON for [mtgjson.com](http://mtgjson.com/)

I didn't plan on open-sourcing this, so there are rough edges. See 'Other' section below.

Setup
-----

    mkdir cache
    cd cache
    mkdir 0 1 2 3 4 5 6 7 8 9 a b c d e f
    cd ..
    npm install
    # See 'Other' below

Usage
-----

    cd build
    node buildSet.js <expansion code>

This creates the file:

    json/<expansion code>.json

You will need to run this twice for any 'new' sets. First pass doesn't include foreign langauges.

Other
-----

All gatherer page requests are cached to the cache directory and any future requests will use the cached version instead.

A key file in the 'shared' directory (C.js) is missing here. Without it, this project can't run. Sorry.

The 'verify' directory is a little private local webpage I use to verify that my JSON is correct by comparing it side by side with card images.

The 'web' directory is used to generate the mtgjson.com website.

Note that both verify and web have some symbolic links to files that only exist on my local dev workstation. Sorry.
