#!/usr/bin/env bash

# Retrieve the zip and extract contents
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastSuccessfulBuild | .url' | tr -d '"')
export JENKINS_ARTIFACT_LOCATION=${test_suite_url}artifact/automated-a11y-testing
curl -L -o ${TEST_SUITE_NAME}.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} "${JENKINS_ARTIFACT_LOCATION}"/*zip*/output.zip
unzip -q ${TEST_SUITE_NAME}.zip -d test-suites/${TEST_SUITE_NAME}

# Run the assessment
cd ${HOME}/test-suites
source assessAllPages.sh ${TEST_SUITE_NAME}

# Run the report parser
java -Dtest.suites.location="${HOME}/test-suites" -jar a11y-report-parser-assembly-0.1.jar

# Find the bulk upload file and load it to the given ELS instance
cd ~
bulk_upload_file=$(find ./a11y-report-parser/ -maxdepth 1 -type f | grep bulk-upload )
source load-alert-data.sh $bulk_upload_file
