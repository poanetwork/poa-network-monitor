#!/bin/bash

cd $POA_MONITOR_PATH
node $POA_MONITOR_PATH/network-test/mining-block-test.js sokol http://localhost:8540 >> $POA_MONITOR_PATH/logs/txs-sokol-log 2>&1;

