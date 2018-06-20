#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/mining-reward-check.js core http://localhost:8541 >> $POA_MONITOR_PATH/logs/mining-reward-core-log 2>&1;

