#!/bin/bash

# Set JENKINS_USERNAME and JENKINS_API_KEY as local environment variables.

################################################################################
# Use the following command for testing a11y-parser, entry_point and
# assessAllPages script changes locally
################################################################################
docker run --cpus 3  \
    -v $(pwd)/files/entry_point.sh:/opt/scripts/entry_point.sh \
    -v $(pwd)/files/assessAllPages.sh:/home/seluser/test-suites/assessAllPages.sh \
    -v $(pwd)/../a11y-report-parser:/home/seluser/a11y-report-parser \
    -v $(pwd)/files/load-alert-data.sh:/home/seluser/load-alert-data.sh \
    -e TEST_SUITE_NAME=${1} \
    -e JENKINS_USERNAME=${JENKINS_USERNAME} \
    -e JENKINS_API_KEY=${JENKINS_API_KEY} \
    accessibility-assessment:1.0.0

################################################################################
# The following run command sets environment variables that we expect to have
# set when the container runs in Jenkins
################################################################################
#docker run \
#    -e TEST_SUITE_NAME=${1} \
#    -e JENKINS_USERNAME=${JENKINS_USERNAME} \
#    -e JENKINS_API_KEY=${JENKINS_API_KEY} \
#    -e ELS_BULK_UPLOAD_API= \
#    -e JENKINS_BASE_URI= \
#    -e JENKINS_TEST_FOLDER= \
#    accessibility-assessment:1.0.0

#docker run -v $(pwd)/files/entry_point.sh:/opt/scripts/entry_point.sh -v $(pwd)/files/load-alert-data.sh:/home/seluser/load-alert-data.sh -v $(pwd)/../a11y-report-parser:/home/seluser/a11y-report-parser -e TEST_SUITE_NAME=${1} -e JENKINS_USERNAME=${JENKINS_USERNAME} -e JENKINS_API_KEY=${JENKINS_API_KEY} accessibility-assessment:1.0.0