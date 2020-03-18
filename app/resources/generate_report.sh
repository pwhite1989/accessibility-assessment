#!/usr/bin/env bash
root_dir=$1

cd ${root_dir}/report
cat ${root_dir}/output/accessibility-assessment-report.json | ./prepare-report.js > ${root_dir}/output/accessibility-assessment-report.html
