#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/missing-rounds.js core http://localhost:8541 >> $POA_MONITOR_PATH/logs/missing-rounds-core-log 2>&1;

