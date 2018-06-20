#!/bin/bash

echo "fullpath:"
fullpath=$(pwd)
echo "$fullpath"
echo "$1"
echo "$#"

PIDFILE=$fullpath/pids/$1

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
$fullpath/$1.sh $fullpath

rm $PIDFILE
