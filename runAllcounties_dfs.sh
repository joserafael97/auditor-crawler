#!/bin/bash

aproach="dfs"

cat counties_dfs.txt | xargs -P 1  -d '\n' -l1 -I value nohup npm start county=value aproach="$aproach" allitens="false" > runLogs/"$value"_"$aproach"_"$(date +%d_%m_%Y_%H_%M_%S_%N)".out.txt 2>&1 &
