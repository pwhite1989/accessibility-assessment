#!/bin/bash
# generate the report
(cd parse-a11y-reports;sbt "run-main uk.gov.hmrc.a11y.ParseA11yReport";mv report* ../)
