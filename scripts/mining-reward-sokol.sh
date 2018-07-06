#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-reward-check.js sokol http://localhost:8540 >> ./logs/mining-reward-sokol-log 2>&1;
