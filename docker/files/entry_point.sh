#!/usr/bin/env bash
source log_as_json

function set_status() {
  curl -s -X POST http://localhost:${SERVICE_PORT}/status/${1}
}

( cd a11y-service && node server.js & )
sleep 1

# Retrieve the zip and extract contents
set_status PULLING_ZIP

build_url=$(curl -s --user ${JENKINS_USERNAME}:${JENKINS_API_KEY} ${JOB_URL}api/json | jq '.lastBuild | .url' | tr -d '"')
test_suite_name=$(echo ${JOB_URL%/} | rev | cut -d'/' -f 1 | rev | sed 's/a11y-test-//g')

if [ -z "$build_url" ]
then
 log_message ERROR "Last Build Url not found at ${JOB_URL}api/json. Exiting process." $test_suite_name
 exit 1
fi

artefact_location=${build_url}artifact/pages
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
source assessAllPages.sh ${test_suite_name}
log_message INFO "Finished assesing all pages with Axe, A11y and VNU for ${test_suite_name}. Triggerring report parser" $test_suite_name

# Run the report parser
set_status PARSING_REPORTS
PARSER_OUTPUT="$(java -Dtest.suite.name="${test_suite_name}" \
     -Dtest.suite.file.location="${HOME}/pages" \
     -Dtest.suite.artefact.location="${artefact_location}" \
     -Dconfig.file="${HOME}/global-filters.conf" \
     -jar accessibility-assessment-report-parser.jar 2>&1)"

if [ $? -eq 0 ]
then
  log_message INFO "Report parser completed with exit code 0." $test_suite_name
else
  EXCEPTION=$(echo "$PARSER_OUTPUT" | grep -o 'Exception.*$')
  log_message ERROR "Report parser failed with the message: $EXCEPTION" $test_suite_name
fi

#Wait for logs to export via fluentbit
set_status EXPORT_LOGS
sleep ${LOG_EXPORT_WAIT}
set_status FINISHED
sleep 10
