#!/bin/bash

# make sure pull requests include a changelog
if [[ x"$TRAVIS_PULL_REQUEST" != x'false' ]]; then
    if git diff --quiet master HEAD -- web/changelog.json; then
        echo 'All pull requests must update the changelog.'
        exit 1
    fi
fi
