#!/bin/bash

echo "got path:"
echo "$1"
cd $1/.. ;
fullpath=$(pwd)
echo "now path:"
echo "$fullpath"
node  $fullpath/test-result-monitor.js core http://localhost:8541 >> monitor-core-log 2>&1;

