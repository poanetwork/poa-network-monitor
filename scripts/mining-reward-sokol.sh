#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-reward-check.js sokol $sokolRpcUrl >> ./logs/mining-reward-sokol-log 2>&1;
