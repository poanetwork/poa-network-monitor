#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node  ./test-result-monitor.js sokol 1800 >> ./logs/monitor-sokol-log 2>&1;

