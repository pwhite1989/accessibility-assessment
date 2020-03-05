#!/usr/bin/env bash
test_suite_name=$(echo ${BUILD_URL} | rev | cut -d'/' -f 3 | rev)
artefact_location=${BUILD_URL}artifact/pages  # Empty value is not sent in fm jenkins.

PARSER_OUTPUT="$(java -Dtest.suite.name="${test_suite_name}" \
     -Dtest.suite.file.location="${HOME}/pages" \
     -Dtest.suite.artefact.location="${artefact_location}" \
     -Dconfig.file="${HOME}/global-filters.conf" \
     -Dtest.suite.build.url="${BUILD_URL}" \
     -jar ${HOME}/page-accessibility-check.jar 2>&1)"
