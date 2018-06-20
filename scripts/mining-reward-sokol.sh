#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/mining-reward-check.js sokol http://localhost:8540 >> mining-reward-sokol-log 2>&1;
