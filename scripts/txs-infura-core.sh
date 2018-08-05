#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node  ./network-test/txs-infura-test.js core https://poa.infura.io >> ./logs/txs-infura-core-log 2>&1;

