#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/txs-public-rps-test.js sokol $sokolPublicRpcUrl  >> ./logs/txs-public-rpc-sokol-log 2>&1;

