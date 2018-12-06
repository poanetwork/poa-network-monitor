#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/mining-block-test.js core $coreRpcUrl >> ./logs/txs-core-log 2>&1;

