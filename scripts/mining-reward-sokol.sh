#!/bin/bash

node $POA_MONITOR_PATH/network-test/mining-reward-check.js sokol http://localhost:8540 >> mining-reward-sokol-log 2>&1;
