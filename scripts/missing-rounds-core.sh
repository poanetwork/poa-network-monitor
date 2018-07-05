#!/bin/bash

cd $POA_MONITOR_PATH
node  $POA_MONITOR_PATH/network-test/missing-rounds.js core ws://localhost:8451 >> $POA_MONITOR_PATH/logs/missing-rounds-core-log 2>&1;

