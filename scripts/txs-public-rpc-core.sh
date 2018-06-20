#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/txs-public-rps-test.js core https://core.poa.network  >> $POA_MONITOR_PATH/logs/txs-public-rpc-core-log 2>&1;

