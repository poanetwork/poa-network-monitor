#!/bin/bash

node  $POA_MONITOR_PATH/network-test/mining-reward-check.js core http://localhost:8541 >> mining-reward-core-log 2>&1;

