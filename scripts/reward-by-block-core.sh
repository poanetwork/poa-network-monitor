#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-by-block.js core http://localhost:8541 >> ./logs/reward-by-block-core-log 2>&1
