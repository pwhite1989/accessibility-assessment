#!/bin/bash

# Be sure to export valid build.tax.service.gov.uk API credentials
# (JENKINS_USERNAME and JENKINS_API_KEY) in your local environment.

rm -rf $(pwd)/docker/files/output/*
docker rm a11y

################################################################################
# Use the following command for testing entry_point, load-alert-data.sh and
# assessAllPages script changes locally.
################################################################################
docker run --cpus 3  \
    --name a11y \
    -v $(pwd)/docker/files/output:/home/seluser/output \
    -v $(pwd)/docker/files/entry_point.sh:/home/seluser/entry_point.sh \
    -e BUILD_URL=${1} \
    -e JENKINS_USERNAME=${JENKINS_USERNAME} \
    -e JENKINS_API_KEY=${JENKINS_API_KEY} \
    -p 6001:16001 \
    accessibility-assessment:SNAPSHOT
    #artefacts.tax.service.gov.uk/accessibility-assessment:0.9.0
    #To run with the latest image used in ci, update the below version with version used in mdtp-build repo.
    #artefacts.tax.service.gov.uk/accessibility-assessment:<mdtp-build-version>  # Current CI build image

#-v $(pwd)/docker/files/page-accessibility-check.jar:/home/seluser/page-accessibility-check.jar \
#-v $(pwd)/docker/files/entry_point.sh:/home/seluser/entry_point.sh \
#-v $(pwd)/docker/files/assessAllPages.sh:/home/seluser/assessAllPages.sh \
#-v $(pwd)/docker/files/global-filters.conf:/home/seluser/global-filters.conf \
