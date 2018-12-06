#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/reward-transfer-check.js core $coreRpcUrl >> ./logs/reward-transfer-core-log 2>&1
