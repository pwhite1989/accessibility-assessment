#!/bin/bash

function assessPage {
  directory=$1
  pageHtmlFile="$directory/index.html"

  echo "Running aXe"
  axe "file://"$(pwd)/$pageHtmlFile --no-reporter --save axe-report.json --dir $directory

  echo "Running Nu HTML Validator"
  vnu --format json $pageHtmlFile &> $directory/vnu-report.tmp
  cat $directory/vnu-report.tmp | jq . > $directory/vnu-report.json
  rm $directory/vnu-report.tmp

  echo "Running pa11y"
  pa11y -c ~/pa11y-config.json --reporter json --include-warnings $(pwd)/$pageHtmlFile | jq . &> $directory/pa11y-report.json

}

read -a directories <<< $(find $1 -type d -mindepth 1 | tr '\n' ' ')

for dir in "${directories[@]}"
do
  echo "Assessing page in $dir"
  assessPage $dir
done
