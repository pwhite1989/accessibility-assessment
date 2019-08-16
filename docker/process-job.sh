#!/bin/bash
jenkins_username=
jenkins_api_key=

docker run -v $(pwd)/files/entry_point.sh:/opt/scripts/entry_point.sh -e TEST_SUITE_NAME=${1} -e JENKINS_USERNAME=${jenkins_username} -e JENKINS_API_KEY=${jenkins_api_key} accessibility-assessment:1.0.0
#docker run -e TEST_SUITE_NAME=${1} -e JENKINS_USERNAME=${jenkins_username} -e JENKINS_API_KEY=${jenkins_api_key} accessibility-assessment:1.0.0
