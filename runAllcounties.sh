#!/bin/bash

aproach="bandit"

cat counties.txt | xargs -P 4  -d '\n' -l1 -I value nohup npm start county=value aproach="$aproach" allitens="true" > runLogs/"$value"_"$aproach"_"$(date +%d_%m_%Y_%H_%M_%S_%N)".out.txt 2>&1 &
