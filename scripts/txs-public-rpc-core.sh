#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/txs-public-rps-test.js core $corePublicRpcUrl  >> ./logs/txs-public-rpc-core-log 2>&1;

