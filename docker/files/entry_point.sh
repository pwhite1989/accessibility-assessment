#!/usr/bin/env bash
source log_as_json

function set_status() {
  curl -s -X POST http://localhost:${SERVICE_PORT}/status/${1}
}

( cd a11y-service && node server.js & )
sleep 1

# Retrieve the zip and extract contents
set_status PULLING_ZIP
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastBuild | .url' | tr -d '"')
if [ -z "$test_suite_url" ]
then
 log_message ERROR "Last Build Url not found at ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json. Exiting process"
 exit 1
fi

export JENKINS_ARTIFACT_LOCATION=${test_suite_url}artifact/page-capture-service
DOWNLOAD_STATUS=$(curl -L -s -o ${TEST_SUITE_NAME}.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY}  --write-out "%{http_code}" "${JENKINS_ARTIFACT_LOCATION}"/*zip*/page-capture-service.zip)

if [ "$DOWNLOAD_STATUS" -eq 200 ]; then
  log_message INFO "Downloaded file: $JENKINS_ARTIFACT_LOCATION/*zip*/page-capture-service.zip"
else
  log_message ERROR "Failed to download captured pages zip file from : $JENKINS_ARTIFACT_LOCATION/*zip*/page-capture-service.zip. Failed with HTTP status code: $DOWNLOAD_STATUS. Exiting process"
  exit 1
fi

unzip -q ${TEST_SUITE_NAME}.zip -d test-suites/${TEST_SUITE_NAME}

# Run the assessment
set_status ASSESSING_PAGES
source assessAllPages.sh ${TEST_SUITE_NAME}

log_message INFO "Finished assesing all pages with Axe, A11y and VNU for $TEST_SUITE_NAME. Triggerring report parser"

# Run the report parser
set_status PARSING_REPORTS
PARSER_OUTPUT="$(java -Dtest.suite.name="${TEST_SUITE_NAME}" \
     -Dtest.suite.file.location="${HOME}/test-suites/${TEST_SUITE_NAME}/page-capture-service/output" \
     -Dtest.suite.artefact.location="$JENKINS_ARTIFACT_LOCATION/output" \
     -Dconfig.file="${HOME}/test-suites/${TEST_SUITE_NAME}/page-capture-service/global-filters.conf" \
     -jar accessibility-assessment-report-parser.jar 2>&1)"

if [ $? -eq 0 ]
then
  log_message INFO "Report parser completed with exit code 0."
else
  EXCEPTION=$(echo "$PARSER_OUTPUT" | grep -o 'Exception.*$')
  log_message ERROR "Report parser failed with the message: $EXCEPTION"
fi

set_status EXPORT_LOGS
sleep ${LOG_EXPORT_WAIT}
set_status FINISHED
sleep 10
