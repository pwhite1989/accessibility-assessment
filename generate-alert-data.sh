#!/bin/bash
# generate the report
(cd a11y-report-parser;sbt "run-main uk.gov.hmrc.a11y.ReportParser";mv report* ../)
