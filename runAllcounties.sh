#!/bin/bash

aproach="bandit"

cat counties.txt | xargs -P 5  -d '\n' -l1 -I value npm start county=value aproach="$aproach" &

