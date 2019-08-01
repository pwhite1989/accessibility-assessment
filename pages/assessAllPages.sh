#!/bin/bash

function assessPage {
  directory=$1
  pageHtmlFile="$directory/index.html"

  rm "${directory}/axe-report.json"
  rm "${directory}/vnu-report.json"
  rm "${directory}/pa11y-report.json"

  echo "Running aXe"
  aXe "file://"$(pwd)/$pageHtmlFile --no-reporter --exclude ".copyright > a[target=\"_blank\"],.organisation-logo" --save axe-report.json --dir $directory

  echo "Running Nu HTML Validator"
  vnu --format json $pageHtmlFile &> $directory/vnu-report.tmp
  cat $directory/vnu-report.tmp | jq . > $directory/vnu-report.json
  rm $directory/vnu-report.tmp

  echo "Running pa11y"
  pa11y --hide-elements "#logo > img,#footer > div > div > div:nth-child(2) > a" --reporter json --include-warnings $(pwd)/$pageHtmlFile | jq . &> $directory/pa11y-report.json

}

read -a directories <<< $(find $1 -type d )# | grep 1564 ) #include this grep to strip non-page folders from the assessment

for dir in "${directories[@]}"
do
  echo "Assessing page in $dir"
  assessPage $dir
done
