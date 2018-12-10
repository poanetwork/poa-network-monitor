#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/missing-rounds.js core $coreWsUrl >> ./logs/missing-rounds-core-log 2>&1

