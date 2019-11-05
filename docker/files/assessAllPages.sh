#!/bin/bash

. log_as_json

working_dir=$(pwd)

function runCommand() {
    local counter=0
    local cmd=$1
    local reportFile=$2

    until [ $counter -gt 3 ]
    do
        RESULT=$(eval "$cmd" 2>&1)
        if [ -f $reportFile ] && [ -s $reportFile ]
        then
            log_message INFO "Completed assessing file://$reportFile"
            break 1

        elif [ $counter -lt 2 ]
        then
            log_message WARNING "File $reportFile not produced on attempt $counter. Failed with error: $RESULT"
            counter=$(( counter + 1 ))
        else
          log_message ERROR "File $reportFile not produced after $counter attempts. Failed with error: $RESULT"
          break 1
        fi
    done
}

function run_axe() {
  axe_dirs=("$@")

  for axe_dir in "${axe_dirs[@]}"
  do
    log_message INFO "axe: assessing file://${working_dir}/${axe_dir}/index.html"
    commandString="axe \"file://${working_dir}/${axe_dir}/index.html\" --no-reporter --include \"main\" --save axe-report.json --dir $axe_dir >/dev/null"
    runCommand "${commandString}" "$axe_dir/axe-report.json"
  done
  log_message INFO "Axe assesing all pages completed"
}

function run_vnu() {
  vnu_dirs=("$@")

  for vnu_dir in "${vnu_dirs[@]}"
  do
    log_message INFO "VNU: assessing file://${working_dir}/${vnu_dir}/index.html"
    commandString="vnu --format json \"$vnu_dir/index.html\" &> $vnu_dir/vnu-report.json"
    runCommand "$commandString" "$vnu_dir/vnu-report.json"
  done
  log_message INFO "VNU assesing all pages completed"
}

function run_pa11y() {
  pa11y_dirs=("$@")

  for pa11y_dir in "${pa11y_dirs[@]}"
  do
    log_message INFO "Pa11y: assessing file://${working_dir}/${pa11y_dir}/index.html"
    commandString="pa11y -c ~/pa11y-config.json --root-element \"main\" --reporter json --include-warnings \"$working_dir/$pa11y_dir/index.html\" | jq . &> $pa11y_dir/pa11y-report.json"
    runCommand "$commandString" "$pa11y_dir/pa11y-report.json"
  done
  log_message INFO "Pa11y assesing all pages completed"
}

declare -a pids
read -a directories <<< $(find "test-suites/${1}/page-capture-service" -mindepth 2 -type d | tr '\n' ' ')

run_axe "${directories[@]}" &
pids[0]=$!
run_pa11y "${directories[@]}" &
pids[1]=$!
run_vnu "${directories[@]}" &
pids[2]=$!

for pid in ${pids[*]}; do
    wait $pid
done
