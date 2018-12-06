#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-by-block.js sokol $sokolRpcUrl >> ./logs/reward-by-block-sokol-log 2>&1;
