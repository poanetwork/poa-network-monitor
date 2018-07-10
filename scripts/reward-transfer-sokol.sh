#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-transfer-check.js sokol http://localhost:8540 >> ./logs/reward-transfer-sokol-log 2>&1;
