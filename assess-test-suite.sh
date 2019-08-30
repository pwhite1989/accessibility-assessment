#!/bin/bash

# Set JENKINS_USERNAME and JENKINS_API_KEY as local environment variables.

docker run --cpus 3  \
    -e TEST_SUITE_NAME=${1} \
    -e JENKINS_USERNAME=${JENKINS_USERNAME} \
    -e JENKINS_API_KEY=${JENKINS_API_KEY} \
    accessibility-assessment:1.0.0
