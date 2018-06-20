#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/network-test/txs-public-rps-test.js core https://core.poa.network  >> txs-public-rpc-core-log 2>&1;

