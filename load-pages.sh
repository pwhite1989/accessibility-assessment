#!/bin/bash

read -a pageDirectories <<< $(find pages -type d -maxdepth 1 -mindepth 1 )

for dir in "${pageDirectories[@]}"
do
  cp -r $dir apps/pages
done
