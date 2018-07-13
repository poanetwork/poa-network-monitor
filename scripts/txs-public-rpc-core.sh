#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/txs-public-rps-test.js core https://core.poa.network  >> ./logs/txs-public-rpc-core-log 2>&1;

