#!/bin/bash

node  $POA_MONITOR_PATH/network-test/mining-block-test.js sokol http://localhost:8540 >> txs-sokol-log 2>&1;

