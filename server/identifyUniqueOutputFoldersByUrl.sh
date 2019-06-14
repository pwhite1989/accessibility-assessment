#!/bin/bash

logFileName="service.log"
servicePort="9856"
uniquePageDirectory="business-multi-factor-authentication-acceptance-tests"

read -a uniqueUrls <<< $(cat $logFileName | grep http:// | grep $servicePort | sed -n -e 's/^.*\(http:\/\/\)/\1/p' | tr -d \'\, | sort | uniq)
mkdir -p $uniquePageDirectory

for url in "${uniqueUrls[@]}"
do
  timestamp=$(cat $logFileName | grep -A3 $url | grep -m 1 "timestamp" | tr -d '[:space:]' | tr -d /, | cut -d':' -f2 )
  echo "$url $timestamp"
  cp -r "output/${timestamp}" "${uniquePageDirectory}/"
  echo "$url" >> "${uniquePageDirectory}/${timestamp}/data"
done


#remove all directories in output
# find output -type d | grep /
