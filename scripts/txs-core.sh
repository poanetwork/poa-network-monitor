#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/mining-block-test.js core http://localhost:8541 >> txs-core-log 2>&1;

