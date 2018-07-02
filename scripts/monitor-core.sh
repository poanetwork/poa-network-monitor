#!/bin/bash

cd $POA_MONITOR_PATH
node $POA_MONITOR_PATH/test-result-monitor.js core 1800 >> $POA_MONITOR_PATH/logs/monitor-core-log 2>&1;

