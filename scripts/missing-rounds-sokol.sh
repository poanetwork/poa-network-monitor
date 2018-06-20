#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/missing-rounds.js sokol http://localhost:8540 >> $POA_MONITOR_PATH/logs/missing-rounds-sokol-log 2>&1;

