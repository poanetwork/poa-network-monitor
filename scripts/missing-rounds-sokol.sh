#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/missing-rounds.js sokol http://localhost:8540 >> missing-rounds-sokol-log 2>&1;

