#!/bin/bash

set -e

if [ ! -d ./smods ]; then
	git clone https://github.com/Steamodded/smods smods
fi

echo Gathering Data...
./collect.sh > data

echo Processing Data...
node process.js

echo Building HTML...
node html.js

rm -rf build 2>/dev/null

cp -r public build

cp data.html build/index.html
