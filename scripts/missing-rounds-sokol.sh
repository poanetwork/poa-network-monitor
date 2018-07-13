#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/missing-rounds.js sokol ws://localhost:8450 >> ./logs/missing-rounds-sokol-log 2>&1;
