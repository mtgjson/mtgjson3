#!/bin/sh

inotifywait -mr --timefmt '%d/%m/%y %H:%M' --format '%T %w %f' -e close_write ./ | while read date time dir file; do
    	filechanged=${dir}${file}
    	extension=${filechanged##*.}

    	if [ $extension = "styl" ]
       	then
	    	echo "At ${time} on ${date}, file $filechanged $extension"
       		/mnt/compendium/bin/node_modules/stylus/bin/stylus "$filechanged"
		fi
done
