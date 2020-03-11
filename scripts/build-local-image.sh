#!/bin/bash
PROJECT_DIR=${WORKSPACE}/accessibility-assessment
DOCKER_FILES_DIR=${PROJECT_DIR}/docker/files
accessibility_report_dir=${WORKSPACE}/accessibility-report/
page_accessibility_check_dir=${WORKSPACE}/page-accessibility-check/

# pull the latest accessibility report
rm -rf ${DOCKER_FILES_DIR}/report
mkdir ${DOCKER_FILES_DIR}/report
cp -r  $accessibility_report_dir/assets ${DOCKER_FILES_DIR}/report/
cp $accessibility_report_dir/package* ${DOCKER_FILES_DIR}/report/
cp $accessibility_report_dir/prepare-report.js ${DOCKER_FILES_DIR}/report
cp $accessibility_report_dir/template.pug ${DOCKER_FILES_DIR}/report

# cp the latest app/ into files
rm -rf ${DOCKER_FILES_DIR}/app || true
mkdir ${DOCKER_FILES_DIR}/app
cp ${PROJECT_DIR}/app/*.js  $DOCKER_FILES_DIR/app
cp ${PROJECT_DIR}/app/package.json  $DOCKER_FILES_DIR/app/package.json
cp -r ${PROJECT_DIR}/app/resources $DOCKER_FILES_DIR/app/
cp -r ${PROJECT_DIR}/app/routes $DOCKER_FILES_DIR/app/
cp -r ${PROJECT_DIR}/app/services $DOCKER_FILES_DIR/app/

docker rmi -f accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT ${PROJECT_DIR}/docker
