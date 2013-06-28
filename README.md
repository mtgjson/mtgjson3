This is the code used to generate the JSON for [mtgjson.com](http://mtgjson.com/)

I didn't plan on open-sourcing this, so there are rough edges.

Setup:
mkdir cache
npm install

To create a JSON file:
cd build
node buildSet.js <expansion code>

This will create json/<expansion code>.json

You want to run it twice for any 'new' sets, because first pass won't include foreign languages.

All gatherer page requests are cached to the cache directory and any future requests will use the cached version instead.

The 'verify' directory is a little private local webpage I use to verify that my JSON is correct by comparing it side by side with card images.

The 'web' directory is used to generate the mtgjson.com website.

Note that both verify and web have some symbolic links to files that only exist on my local dev workstation. Sorry.
