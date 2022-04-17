#!/bin/sh

(which entr) >& /dev/null
[ $? -ne 0 ] && {
  echo "Please install entr first"
  exit
}

find . -not -path \*node_modules\* -and \( -name \*\.ts -o -name \*\.json \)\
  | entr -p -s './bin/build.sh'
