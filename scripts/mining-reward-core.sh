#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-reward-check.js core $coreRpcUrl >> ./logs/mining-reward-core-log 2>&1
