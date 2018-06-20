#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/txs-public-rps-test.js sokol https://sokol.poa.network  >> txs-public-rpc-sokol-log 2>&1;

