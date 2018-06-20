#!/bin/bash

node  $POA_MONITOR_PATH/test-result-monitor.js sokol http://localhost:8540 >> monitor-sokol-log 2>&1;

