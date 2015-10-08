#!/bin/bash
rsync -f "merge web.filter" --delete --delete-excluded -avL ../web/ sandbox:/srv/mtgjson.com/
scp ../nginx/mtgjson.com.conf sandbox:/srv/
