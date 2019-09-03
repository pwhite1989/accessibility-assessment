#!/usr/bin/env bash

# Retrieve the zip and extract contents
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastSuccessfulBuild | .url' | tr -d '"')
export JENKINS_ARTIFACT_LOCATION=${test_suite_url}artifact/page-capture-service
curl -L -s -o ${TEST_SUITE_NAME}.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} "${JENKINS_ARTIFACT_LOCATION}"/*zip*/page-capture-service.zip
unzip -q ${TEST_SUITE_NAME}.zip -d test-suites/${TEST_SUITE_NAME}

# Run the assessment
source assessAllPages.sh ${TEST_SUITE_NAME}

# Run the report parser
java -Dtest.suite.name="${TEST_SUITE_NAME}" \
     -Dtest.suite.file.location="${HOME}/test-suites/${TEST_SUITE_NAME}/page-capture-service/output" \
     -Dtest.suite.artefact.location="$JENKINS_ARTIFACT_LOCATION/output" \
     -jar accessibility-assessment-report-parser.jar
