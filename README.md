# Accessibility Assessment
The accessibility assessment image is the service running in our Jenkins CI which captures complete web pages, assesses them with [axe](https://www.deque.com/axe/) and [Nu HTML Checker](https://validator.github.io/validator/), and produces reports in Jenkins (archived as a basic HTML report) and Kibana.

This resulting image contains the following components:
- accessibility-assessment-service: a simple node express service that exposes an api which the jenkins slave uses to orchestrate accessibility assessments.
- page-accessibility-check: a jar built from the Scala project .... which integrates axe and vnu assessments with the express service
- acessibility-reports: another node project which generates a html report based on the json output of the page-accessibility-check application.


The intention is that future improvements to the accessibility-assessment image collapse the above components into a single Scala or Node service.

# Building the Image
## For use in CI
The [Makefile](Makefile) at the root of this project is used by Jenkins to build and push new versions of this image to artefactory for use in CI.

## In your local dev environment
You'll need to ensure that your development environment meets the following pre-reqs:
- Install [docker](https://docs.docker.com/install), v19.x or above
- Ensure that your `WORKSPACE` environment variable is set, and that this project is checked out to the root of the workspace.  I.e. ${WORKSPACE}/accessibility-assessment

To build the **accessibility-assessment:SNAPSHOT** image for local use execute the `. scripts/build-local-image.sh` script.

*Note: to date this has only been tested on Mac OSX.*

# Local development
To run the image as a docker container in your local dev environment, execute `. scripts/run-local.sh`.

This service requires particular versions of both vnu and axe be installed in the running environment, and be configured to run as cli tools.  To get this working you'll subsequently need to ensure that appropriate versions of nvm/npm/chromedriver be installed.  As the [Dockerfile](docker/Dockerfile) takes care of this complexity, we've found that the quickest and most reliable way to develop and test the service is by mounting the [app](app/) directory into the running docker container.

Simply include the following `docker run` option in the [run-local.sh](scripts/run-local.sh) script before executing:

```-v ${PROJECT_DIR}/app:/home/seluser/app \```

# Testing
## Postman
There is a basic [Postman](https://www.postman.com/downloads/) collection in the [test](test/postman-collections) directory which contains a list of basic requests for each of the endpoints implemented in the service.

## Acceptance tests
A more thorough automated test suite has been implemented in the [accessibility-assessment-tests](https://github.com/hmrc/accessibility-assessment-tests) project.  This test suite includes test cases for:
- violation filters
- violation count

## Kibana Integration
### Running up an ELK stack locally
You will need to have ~6GB of memory allocated to your local docker engine to run the ELK stack.  If you're running Docker Desktop, you can configure this in **Docker -> Preferences**

You will also need to have docker-compose installed (tested on Mac OSX with v1.25.2).

Simply navigate to the [elk](test/elk) directory and execute the command: `docker-compose up -d`

ElasticSearch and Kibana will start on the default ports of 9600 and 5601 respectively.  You will be able to see Kibana in your browser if you navigate to http://localhost:5601.  Note that it may take a minute to initialise.

To kill the stack, execute `docker-compose kill` from the [elk](test/elk) directory.  If you wish to delete all of the data ingested by elk, then delete the esdata directory `rm -r test/elk/esdata/*`

### Visualising Violations in Kibana
Visualisations for the local Kibana instance can be loaded manually using Kibana's Saved Object import UI.  If this is the first time you've run the `docker-compose` command in the previous section, then please follow the below instructions to generate the visualisations you'll need to review the results of the assessment:

1. In Kibana, navigate to **Management -> Saved Ojbects** and click **Import**.
2. Load the [index saved object](test/elk/kibana/kibana-index-so.json).  Set the *time filter* field to *testRun* when prompted.
3. Click **Import** again and load the [visualisations and dashboards saved objects](test/elk/kibana/management-kibana-so.json).

You should now be able to search for Dashboards and Visualisations using the *test-suite-name* given to your UI test job in our build-jobs config.


# Notes....
- setting up axe and vnu to run locally
  - install vnu with `npm install vnu-jar -g`
  - navigate to the vnu directory.  it'll be something like: `.nvm/versions/node/v12.15.0/lib/node_modules/vnu-jar/build/dist`
  - create an executable:
    - execute: `echo -e '#!/bin/bash\njava -jar ${HOME}/.nvm/versions/node/v${NODE_VERSION}/lib/node_modules/vnu-jar/build/dist/vnu.jar "$@"' > /usr/local/bin/vnu`
    - then add permissions: `sudo chmod +x /usr/local/bin/vnu`
-
# License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
