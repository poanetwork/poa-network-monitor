#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-transfer-check.js core http://localhost:8541 >> ./logs/reward-transfer-core-log 2>&1
