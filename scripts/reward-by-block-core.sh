#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-by-block.js core $coreRpcUrl >> ./logs/reward-by-block-core-log 2>&1
