#!/bin/bash

accessibility_report_dir=$(pwd)/../../accessibility-report/

rm -rf files/report
mkdir files/report
cp -r  $accessibility_report_dir/assets files/report/
cp $accessibility_report_dir/package* files/report/
cp $accessibility_report_dir/prepare-report.js files/report
cp $accessibility_report_dir/template.pug files/report

docker rmi -f accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT .
