#!/bin/bash
PROJECT_DIR=${WORKSPACE}/accessibility-assessment
DOCKER_FILES_DIR=${PROJECT_DIR}/docker/files

# cp the latest app/ into files
rm -rf ${DOCKER_FILES_DIR}/app || true
mkdir ${DOCKER_FILES_DIR}/app
cp ${PROJECT_DIR}/app/*.js  $DOCKER_FILES_DIR/app
cp ${PROJECT_DIR}/app/package.json  $DOCKER_FILES_DIR/app/package.json
cp ${PROJECT_DIR}/app/package-lock.json  $DOCKER_FILES_DIR/app/package-lock.json
cp -r ${PROJECT_DIR}/app/resources $DOCKER_FILES_DIR/app/
cp -r ${PROJECT_DIR}/app/routes $DOCKER_FILES_DIR/app/
cp -r ${PROJECT_DIR}/app/services $DOCKER_FILES_DIR/app/

docker rmi -f accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT ${PROJECT_DIR}/docker
