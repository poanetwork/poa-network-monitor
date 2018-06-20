#!/bin/bash

node  $POA_MONITOR_PATH/network-test/mining-block-test.js core http://localhost:8541 >> txs-core-log 2>&1;

