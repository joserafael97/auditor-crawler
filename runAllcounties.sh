#!/bin/bash

aproach="bfs"

cat counties.txt | xargs -P 3  -d '\n' -l1 -I value npm start county=value aproach="$aproach" &

