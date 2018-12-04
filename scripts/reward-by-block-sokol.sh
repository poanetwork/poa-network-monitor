#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-by-block.js sokol http://localhost:8540 >> ./logs/reward-by-block-sokol-log 2>&1;
