#!/bin/bash

ssh sandbox "mkdir -p /srv/mtgjson-cron/node_modules"
scp package.json previous_sets.json check_gatherer_sets.js sandbox:/srv/mtgjson-cron
ssh sandbox "cd /srv/mtgjson-cron ; npm install"
