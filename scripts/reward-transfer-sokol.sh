#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-transfer-check.js sokol $sokolRpcUrl >> ./logs/reward-transfer-sokol-log 2>&1;
