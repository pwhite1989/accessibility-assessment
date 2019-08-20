#!/bin/bash

working_dir=$(pwd)

function runCommand() {
    local counter=0
    local cmd=$1
    local reportFile=$2

    until [ $counter -gt 2 ]
    do
        eval "$cmd"
        if [ -f $reportFile ]
        then
            break 1
        else
            counter=$(( counter + 1 ))
            echo "File $reportFile not produced on attempt $counter"
        fi
    done
}

function axe() {
  axe_dirs=("$@")

  for axe_dir in "${axe_dirs[@]}"
  do
    echo "axe: assessing file://${working_dir}/${axe_dir}/index.html"
    commandString="command axe \"file://${working_dir}/${axe_dir}/index.html\" --no-reporter --save axe-report.json --dir $axe_dir >/dev/null"
    runCommand "${commandString}" "$axe_dir/axe-report.json"
  done
}

function vnu() {
  vnu_dirs=("$@")

  for vnu_dir in "${vnu_dirs[@]}"
  do
    echo "vnu: assessing $vnu_dir/index.html"
    commandString="command vnu --format json \"$vnu_dir/index.html\" &> $vnu_dir/vnu-report.json"
    runCommand "$commandString" "$vnu_dir/vnu-report.json"
  done
}

function pa11y() {
  pa11y_dirs=("$@")

  for pa11y_dir in "${pa11y_dirs[@]}"
  do
    echo "pa11y: assessing $working_dir/$pa11y_dir/index.html"
    commandString="command pa11y -c ~/pa11y-config.json --reporter json --include-warnings \"$working_dir/$pa11y_dir/index.html\" | jq . &> $pa11y_dir/pa11y-report.json"
    runCommand "$commandString" "$pa11y_dir/pa11y-report.json"
  done
}

declare -a pids
read -a directories <<< $(find $1 -type d -mindepth 2 | tr '\n' ' ')

axe "${directories[@]}" &
pids[0]=$!
pa11y "${directories[@]}" &
pids[1]=$!
vnu "${directories[@]}" &
pids[2]=$!

for pid in ${pids[*]}; do
    wait $pid
done

echo "Processing complete."
