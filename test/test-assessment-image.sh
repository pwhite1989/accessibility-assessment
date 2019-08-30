#!/bin/bash

# Set JENKINS_USERNAME and JENKINS_API_KEY as local environment variables.

################################################################################
# Use the following command for testing entry_point, load-alert-data.sh and
# assessAllPages script changes locally.
################################################################################
docker run --cpus 3  \
    -v $(pwd)/../docker/files/entry_point.sh:/opt/scripts/entry_point.sh \
    -v $(pwd)/../docker/files/assessAllPages.sh:/home/seluser/test-suites/assessAllPages.sh \
    -v $(pwd)/../docker/files/load-alert-data.sh:/home/seluser/load-alert-data.sh \
    -e TEST_SUITE_NAME=${1} \
    -e JENKINS_USERNAME=${JENKINS_USERNAME} \
    -e JENKINS_API_KEY=${JENKINS_API_KEY} \
    accessibility-assessment:1.0.0
