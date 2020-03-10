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
    -v $(pwd)/docker/files/app:/home/seluser/app \
    -p 6010:6010 \
    accessibility-assessment:SNAPSHOT

# -v $(pwd)/docker/files/run_assessment.sh:/home/seluser/run_assessment.sh \
# -v $(pwd)/docker/files/app:/home/seluser/app \  # FOR TESTING CHANGES WITHIN THE IMAGE
