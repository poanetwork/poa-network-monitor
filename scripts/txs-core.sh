#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/mining-block-test.js core http://localhost:8541 >> ./logs/txs-core-log 2>&1;

