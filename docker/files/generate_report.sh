#!/usr/bin/env bash
cd report
cat ${HOME}/output/accessibility-assessment-report.json | ./prepare-report.js > ${HOME}/output/accessibility-assessment-report.html
