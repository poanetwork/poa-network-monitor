#!/bin/bash

node  $POA_MONITOR_PATH/network-test/missing-rounds.js sokol http://localhost:8540 >> missing-rounds-sokol-log 2>&1;

