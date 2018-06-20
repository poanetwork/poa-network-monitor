#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/missing-rounds.js core http://localhost:8541 >> missing-rounds-core-log 2>&1;

