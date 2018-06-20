#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/mining-block-test.js sokol http://localhost:8540 >> txs-sokol-log 2>&1;

