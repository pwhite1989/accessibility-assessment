#!/bin/bash

################################################################################
# Use this script to run the accessibility-assessment image locally
################################################################################

PROJECT_DIR=${WORKSPACE}/accessibility-assessment
rm -rf ${PROJECT_DIR}/output/*
docker rm a11y

docker run --cpus 3  \
    --name a11y \
    -v ${PROJECT_DIR}/output:/home/seluser/output \
    -p 6010:6010 \
    accessibility-assessment:SNAPSHOT

# For local development, include the commented out line below (which mounts ./app
#    within the image).  Note that you will also need to delete the
#    ${PROJECT_DIR}/app/node_modules directory as it will contain packages specific
#    to the filesystem of your local development environment, and not that off the
#    docker container.

# -v ${PROJECT_DIR}/app:/home/seluser/app \

#to pull down an image from artefactory
#artefacts.tax.service.gov.uk/accessibility-assessment:0.15.0
