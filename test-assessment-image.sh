#!/bin/bash

rm -rf $(pwd)/docker/files/output/*
docker rm a11y

################################################################################
# Use the following command for testing entry_point, load-alert-data.sh and
# assessAllPages script changes locally.
################################################################################
docker run --cpus 3  \
    --name a11y \
    -v $(pwd)/docker/files/output:/home/seluser/output \
    -e BUILD_URL=${1} \
    -p 6010:6010 \
    accessibility-assessment:SNAPSHOT
    #artefacts.tax.service.gov.uk/accessibility-assessment:0.9.0
    #To run with the latest image used in ci, update the below version with version used in mdtp-build repo.
    #artefacts.tax.service.gov.uk/accessibility-assessment:<mdtp-build-version>  # Current CI build image
