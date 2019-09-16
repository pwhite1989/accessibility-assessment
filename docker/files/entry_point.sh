#!/usr/bin/env bash

function set_status() {
  curl -s -X POST http://localhost:16001/status/${1}
}

( cd a11y-service && node server.js & )
sleep 1

# Retrieve the zip and extract contents
set_status PULLING_ZIP
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastBuild | .url' | tr -d '"')
export JENKINS_ARTIFACT_LOCATION=${test_suite_url}artifact/page-capture-service
curl -L -s -o ${TEST_SUITE_NAME}.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} "${JENKINS_ARTIFACT_LOCATION}"/*zip*/page-capture-service.zip
unzip -q ${TEST_SUITE_NAME}.zip -d test-suites/${TEST_SUITE_NAME}

# Run the assessment
set_status ASSESSING_PAGES
source assessAllPages.sh ${TEST_SUITE_NAME}

# Run the report parser
set_status PARSING_REPORTS
java -Dtest.suite.name="${TEST_SUITE_NAME}" \
     -Dtest.suite.file.location="${HOME}/test-suites/${TEST_SUITE_NAME}/page-capture-service/output" \
     -Dtest.suite.artefact.location="$JENKINS_ARTIFACT_LOCATION/output" \
     -jar accessibility-assessment-report-parser.jar

sleep ${LOG_EXPORT_WAIT}
set_status FINISHED
sleep 10
