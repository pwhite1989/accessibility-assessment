#!/usr/bin/env bash
source log_as_json

export APP_PORT=16001

function set_status() {
  curl -s -X POST http://localhost:${APP_PORT}/status/${1}
}

( export NODE_ENV=jenkins && cd a11y-service && node server.js & )

# Retrieve the zip and extract contents
set_status PULLING_ZIP
test_suite_name=$(echo ${BUILD_URL} | rev | cut -d'/' -f 3 | rev | sed 's/a11y-test-//g')
artefact_location=${BUILD_URL}artifact/pages
artefact_download_status=$(curl -L -s -o pages.zip --user ${JENKINS_USERNAME}:${JENKINS_API_KEY}  --write-out "%{http_code}" "${artefact_location}"/*zip*/pages.zip)

if [ "$artefact_download_status" -eq 200 ]; then
  log_message INFO "Downloaded file: $artefact_location/*zip*/pages.zip" $test_suite_name
else
  log_message ERROR "Failed to download captured pages zip file from : $artefact_location/*zip*/pages.zip. Failed with HTTP status code: $artefact_download_status. Exiting process" $test_suite_name
  exit 1
fi

unzip -q pages.zip

# Run the assessment
set_status ASSESSING_PAGES
PARSER_OUTPUT="$(java -Dtest.suite.name="${test_suite_name}" \
     -Dtest.suite.file.location="${HOME}/pages" \
     -Dtest.suite.artefact.location="${artefact_location}" \
     -Dconfig.file="${HOME}/global-filters.conf" \
     -Dtest.suite.build.url="${BUILD_URL}" \
     -jar page-accessibility-check.jar 2>&1)"

if [ $? -eq 0 ]
then
  log_message INFO "Report parser completed with exit code 0." $test_suite_name
else
  EXCEPTION=$(echo "$PARSER_OUTPUT" | grep -o 'Exception.*$')
  log_message ERROR "Report parser failed. Below is the list of all exceptions thrown during run: $EXCEPTION" $test_suite_name
  exit 1
fi

# generate html report
cd report
cat ../output/accessibility-assessment-report.json | ./prepare-report.js > ../output/accessibility-assessment-report.html

#Wait for logs to export via fluentbit
set_status EXPORT_LOGS
sleep ${LOG_EXPORT_WAIT}
set_status FINISHED
sleep 10
