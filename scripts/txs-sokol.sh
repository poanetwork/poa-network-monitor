#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/mining-block-test.js sokol http://localhost:8540 >> ./logs/txs-sokol-log 2>&1;

