#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/mining-block-test.js core http://localhost:8541 >> $POA_MONITOR_PATH/logs/txs-core-log 2>&1;

