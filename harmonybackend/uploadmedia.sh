#!/bin/bash 
# NOTE: this script must be chmod +x'd and executed as ./uploadmedia.sh 

mkdir -p ./.upload-logs/

while read path 
do 
	echo $path;
	node ./bin/cli-upload.js "TV Shows" "$path"
done < <(node bin/cli-haveprocessed-v2.js /mnt/gdrive/plex-data/TV/The\ Good\ Place tv)
