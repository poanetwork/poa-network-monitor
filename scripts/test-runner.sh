#!/bin/bash

echo "POA_MONITOR_PATH:"
echo $POA_MONITOR_PATH
echo "$1"

PIDFILE=$POA_MONITOR_PATH/scripts/pids/$1

if [ -f $PIDFILE ]
then
  PID=$(cat $PIDFILE)
  ps -p $PID > /dev/null 2>&1
  if [ $? -eq 0 ]
  then
    echo "Process is running"
    exit 1
  else
    ## Process is not running
    echo $$ > $PIDFILE
    if [ $? -ne 0 ]
    then
      echo "Could not create PID file"
      exit 1
    fi
  fi
else
  echo $$ > $PIDFILE
  if [ $? -ne 0 ]
  then
    echo "Could not create PID file"
    exit 1
  fi
fi

# run test and send full path as argument
$POA_MONITOR_PATH/scripts/$1.sh

rm $PIDFILE
