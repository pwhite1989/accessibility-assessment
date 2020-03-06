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
    -v $(pwd)/docker/files/service:/home/seluser/service \
    -v $(pwd)/docker/files/run_assessment.sh:/home/seluser/run_assessment.sh \
    -p 6010:6010 \
    accessibility-assessment:SNAPSHOT
    #artefacts.tax.service.gov.uk/accessibility-assessment:0.9.0
    #To run with the latest image used in ci, update the below version with version used in mdtp-build repo.
    #artefacts.tax.service.gov.uk/accessibility-assessment:<mdtp-build-version>  # Current CI build image
# -v $(pwd)/docker/files/service/routes/capturePage.js:/home/seluser/service/routes/capturePage.js \
# -v $(pwd)/docker/files/service/app.js:/home/seluser/service/app.js \
