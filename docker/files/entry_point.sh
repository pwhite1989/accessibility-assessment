#!/usr/bin/env bash

# Retrieve a zip file from the last successful build.
test_suite_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JENKINS_BASE_URI}/${JENKINS_TEST_FOLDER}/a11y-test-${TEST_SUITE_NAME}/api/json | jq '.lastSuccessfulBuild | .url' | tr -d '"')

export JENKINS_ARTIFACT_LOCATION=${test_suite_url}artifact/automated-a11y-testing/server
curl -L -s -o ${TEST_SUITE_NAME}.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} "${JENKINS_ARTIFACT_LOCATION}"/*zip*/server.zip

# Unzip the file - restructure files/directories to suite assessAllPages.sh processing and serving of pages via jenkins:
# TODO:  We may want to update Jenkins and the assessAllPages.sh script rather than have this here...
unzip -q ${TEST_SUITE_NAME}.zip -d test-suites/${TEST_SUITE_NAME}
cd test-suites/${TEST_SUITE_NAME}
cp -r server/output output
rm -rf server/

# TODO: Refactor assessAllPages.sh to run against a given directory (first param...)
cd ${HOME}/test-suites
source assessAllPages.sh ${TEST_SUITE_NAME}

# Run the report parser
cd ~/a11y-report-parser
java -Dtest.suites.location="${HOME}/test-suites" -jar a11y-report-parser-assembly-0.1.jar
