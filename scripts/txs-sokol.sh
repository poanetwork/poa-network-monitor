#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-block-test.js sokol $sokolRpcUrl >> ./logs/txs-sokol-log 2>&1;

