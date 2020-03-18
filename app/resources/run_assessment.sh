#!/usr/bin/env bash
root_dir=$1
test_suite_name=${2:-not-set}
build_url=${3:-}

# If a build url is passed to this script, the artefact_location should be given an
# absolute reference.
if [ -z "$3" ]
then
  artefact_location=./pages
else
  artefact_location=${build_url}artifact/pages
fi

java -Dtest.suite.name="${test_suite_name}" \
     -Duser.dir="${root_dir}" \
     -Dtest.suite.file.location="${root_dir}/pages" \
     -Dtest.suite.artefact.location="${artefact_location}" \
     -Dconfig.file="${root_dir}/global-filters.conf" \
     -Dtest.suite.build.url="${build_url}" \
     -jar $(pwd)/page-accessibility-check.jar 2>&1
