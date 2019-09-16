#!/usr/bin/env bash

. log_as_json

# Retrieve the zip and extract contents
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastSuccessfulBuild | .url' | tr -d '"')
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
source assessAllPages.sh ${TEST_SUITE_NAME}

log_message INFO "Finished assesing all pages with Axe, A11y and VNU for $TEST_SUITE_NAME. Triggerring report parser"

# Run the report parser
java -Dtest.suite.name="${TEST_SUITE_NAME}" \
     -Dtest.suite.file.location="${HOME}/test-suites/${TEST_SUITE_NAME}/page-capture-service/output" \
     -Dtest.suite.artefact.location="$JENKINS_ARTIFACT_LOCATION/output" \
     -jar accessibility-assessment-report-parser.jar
