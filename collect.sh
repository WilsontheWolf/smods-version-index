#!/bin/bash

cd smods

git fetch > /dev/null

git pull > /dev/null

export COMMITS=$(git log --pretty=format:"%h")

for c in $COMMITS; do
	export v=$(git show $c:version.lua 2>/dev/null | awk 'match($0, /return "(.+)"/,a) {print a[1]}')
	if [ -z "$v" ]; then
		export v=$(git show $c:core/core.lua 2>/dev/null | awk 'match($0, /MODDED_VERSION = "(.+)"/,a) {print a[1]}')
	fi
	echo $c $v
done

echo "=======TAGS======="

git show-ref --tags -d --abbrev=7
