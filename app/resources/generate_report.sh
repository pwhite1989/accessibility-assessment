#!/usr/bin/env bash
cd ${HOME}/report
cat ${HOME}/output/accessibility-assessment-report.json | ./prepare-report.js > ${HOME}/output/accessibility-assessment-report.html
