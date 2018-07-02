#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/test-result-monitor.js sokol 1800 >> $POA_MONITOR_PATH/logs/monitor-sokol-log 2>&1;

