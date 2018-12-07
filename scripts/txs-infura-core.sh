#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/txs-infura-test.js core $coreInfuraUrl >> ./logs/txs-infura-core-log 2>&1;

