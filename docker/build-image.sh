#!/bin/bash
rm -rf ./files/a11y-report-parser
cp -r ../a11y-report-parser ./files/
docker build -t accessibility-assessment:1.0.0 .
