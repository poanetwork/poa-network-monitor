#!/bin/bash

cd ../"${BASH_SOURCE%/*}"
node ./test-result-monitor.js core 1800 >> ./logs/monitor-core-log 2>&1;

