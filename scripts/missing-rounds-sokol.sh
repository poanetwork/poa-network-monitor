#!/bin/bash

. ../config.toml

cd ../"${BASH_SOURCE%/*}"
node ./network-test/missing-rounds.js sokol $sokolWsUrl >> ./logs/missing-rounds-sokol-log 2>&1;
