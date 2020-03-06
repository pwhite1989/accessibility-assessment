#!/usr/bin/env bash
test_suite_name=${1:-not-set}
build_url=${2:-}
artefact_location=${build_url}artifact/pages

if [ -z "$2" ]
then
  artefact_location=./pages
fi

java -Dtest.suite.name="${test_suite_name}" \
     -Dtest.suite.file.location="${HOME}/pages" \
     -Dtest.suite.artefact.location="${artefact_location}" \
     -Dconfig.file="${HOME}/global-filters.conf" \
     -Dtest.suite.build.url="${build_url}" \
     -jar ${HOME}/page-accessibility-check.jar 2>&1
