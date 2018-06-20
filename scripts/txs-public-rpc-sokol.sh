#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/txs-public-rps-test.js sokol https://sokol.poa.network  >> $POA_MONITOR_PATH/logs/txs-public-rpc-sokol-log 2>&1;

