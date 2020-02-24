#!/bin/bash

accessibility_report_dir=${WORKSPACE}/accessibility-report/
page_accessibility_check_dir=${WORKSPACE}/page-accessibility-check/

rm files/page-accessibility-check.jar || true
cp ${page_accessibility_check_dir}target/scala-2.11/page-accessibility-check.jar files/page-accessibility-check.jar

rm -rf files/report
mkdir files/report
cp -r  $accessibility_report_dir/assets files/report/
cp $accessibility_report_dir/package* files/report/
cp $accessibility_report_dir/prepare-report.js files/report
cp $accessibility_report_dir/template.pug files/report

docker rmi -f accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT .
