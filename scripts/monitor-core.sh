#!/bin/bash

node $POA_MONITOR_PATH/test-result-monitor.js core http://localhost:8541 >> monitor-core-log 2>&1;

