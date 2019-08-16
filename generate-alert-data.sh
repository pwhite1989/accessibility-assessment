#!/bin/bash
# generate the report
(cd a11y-report-parser;sbt -Dtest.suites.location=/Users/ejayaraman/Workspace/EE/HMRC/automated-a11y-testing/pages "run-main uk.gov.hmrc.a11y.ReportParser";mv report* ../)
