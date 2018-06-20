#!/bin/bash

cd $1/.. ;
fullpath=$(pwd)
node  $fullpath/test-result-monitor.js sokol http://localhost:8540 >> monitor-sokol-log 2>&1;

