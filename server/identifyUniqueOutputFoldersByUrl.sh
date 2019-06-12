#!/bin/bash

logFileName="service.log"
serviceName="trusts-registration"
uniquePageDirectory="trusts-unique-pages"

read -a uniqueUrls <<< $(cat $logFileName | grep http:// | grep $serviceName | sed -n -e 's/^.*\(http:\/\/\)/\1/p' | tr -d \'\, | sort | uniq)
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
