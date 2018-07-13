#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-reward-check.js core http://localhost:8541 >> ./logs/mining-reward-core-log 2>&1
