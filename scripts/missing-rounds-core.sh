#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./network-test/missing-rounds.js core ws://localhost:8451 >> ./logs/missing-rounds-core-log 2>&1

