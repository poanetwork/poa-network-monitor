#!/bin/bash

node  $POA_MONITOR_PATH/network-test/missing-rounds.js core http://localhost:8541 >> missing-rounds-core-log 2>&1;

