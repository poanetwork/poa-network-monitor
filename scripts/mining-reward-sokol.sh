#!/bin/bash

cd $POA_MONITOR_PATH
node $POA_MONITOR_PATH/network-test/mining-reward-check.js sokol http://localhost:8540 >> $POA_MONITOR_PATH/logs/mining-reward-sokol-log 2>&1;
