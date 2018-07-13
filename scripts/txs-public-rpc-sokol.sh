#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/txs-public-rps-test.js sokol https://sokol.poa.network  >> ./logs/txs-public-rpc-sokol-log 2>&1;

