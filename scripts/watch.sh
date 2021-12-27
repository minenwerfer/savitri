#!/bin/sh

(which entr) >& /dev/null
[ $? -ne 0 ] && {
  echo "Please install entr first"
  exit
}

find . -name \*\.ts -o -name \*\.json | entr -p -s 'npm run build'
