#!/bin/bash
jenkins_username=dan.prokopiwskyi
jenkins_api_key=2d96c501b0545b1c7d6ba17365c9cfdd

docker run -v $(pwd)/files/entry_point.sh:/opt/scripts/entry_point.sh -e TEST_SUITE_NAME=${1} -e JENKINS_USERNAME=${jenkins_username} -e JENKINS_API_KEY=${jenkins_api_key} accessibility-assessment:1.0.0
#docker run -e TEST_SUITE_NAME=${1} -e JENKINS_USERNAME=${jenkins_username} -e JENKINS_API_KEY=${jenkins_api_key} accessibility-assessment:1.0.0
