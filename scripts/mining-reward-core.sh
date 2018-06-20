#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/mining-reward-check.js core http://localhost:8541 >> mining-reward-core-log 2>&1;

