# Accessibility Assessment Service
The accessibility assessment service is published as a docker image, and runs as a sidecar container to our jenkins slaves.  It exposes a REST API for capturing complete web pages (HTML, js, css) which are then assessed with [axe](https://www.deque.com/axe/) and [Nu HTML Checker](https://validator.github.io/validator/).  The service then publishes the violations found in a basic HTML report which is archived in Jenkins, and in our Management instance of Kibana.

This incarnation of the service was created following an accessibility audit which was conducted using the page coverage achieved by our UI test suites in CI.  The implementation arrived at for the audit is the result of prioritising expedience over all else (cost of improvement/maintenance/support).  Future work on the accessibility-assessment image will include collapsing the below components into a single Scala or Node service.

At present the image is made up of the following components:
- **accessibility-assessment-service**: a [node express](https://expressjs.com/) service that exposes a REST API which is consumed by the jenkins slave and our page-capture-chrome-extension.  The API exposes endpoints to capture pages, trigger page assessments, produces reports and surfaces logging information.
- **page-accessibility-check**: a jar published by [this Scala project](https://github.com/hmrc/page-accessibility-check) which executes axe and vnu assessments against a collection of pages.  This app is triggered by the accessibility-assessment-service.


# Building the Image in CI
The [Makefile](Makefile) at the root of this project is used by Jenkins to build and publish new versions of this image to artefactory for use in CI.

# Development
*Note that to date this project has only been developed on Mac OSX.*

## Pre-requisites
For local development you will need to satisfy the following pre-reqs:
- Install [docker](https://docs.docker.com/install), v19.x or above;
- set your `WORKSPACE` environment variable, and ensure that this project is cloned in the root of the workspace.  I.e. ${WORKSPACE}/accessibility-assessment

## Building the image
To build the **accessibility-assessment:SNAPSHOT** docker image for local use execute the `. scripts/build-local-image.sh` script.

## Running the image
To run the image as a docker container in your local dev environment, execute `. scripts/run-local.sh`.

## Making changes to the service
This service requires particular versions of both vnu and axe be installed and running as cli tools in the execution environment.  Furthermore, installation of axe/vnu require that nvm/npm/chromedriver also be installed.  As the [Dockerfile](docker/Dockerfile) contains all of the setup configuration required to get the service running, we've found that the quickest and most reliable way to develop and test the service is by mounting the [app](app/) directory into the running docker container.

Simply include the following `docker run` option in the [run-local.sh](scripts/run-local.sh) script before executing:

```bash
-v ${PROJECT_DIR}/app:/home/seluser/app \
```

# Testing
## Postman Collection
There is a basic [Postman](https://www.postman.com/downloads/) collection in the [test](test/postman-collections) directory which contains a list of basic requests for each of the endpoints implemented in the service.

## Acceptance tests
An end to end automated test suite has been implemented in the [accessibility-assessment-tests](https://github.com/hmrc/accessibility-assessment-tests) project.  This test suite includes test cases for:
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
Visualisations for the local Kibana instance can be loaded manually using Kibana's Saved Object import UI.  If this is
 the first time you've run the `docker-compose` command in the previous section, then please follow the below instructions
  to generate the visualisations you'll need to review the results of the assessment:

1. When the log ingestion is successful, Kibana will show the option to create an Index at **Management -> Index Patterns**.
The index pattern could be set to `logstash-*` and set the *time filter* field to `testRun` when prompted.
2. The exported accessibility dashboards from Management Kibana environment is available [here](https://github.com/hmrc/management-kibana-dashboards/tree/master/saved-objects/management). The current
local ELK stack setup does not support `.raw` type used in Kibana Management. It supports only type `.keyword`. Hence,
  before importing these objects replace all references to `.raw` type in the exported saved object with `.keyword`
3. Import the modified saved objects by navigating to **Management -> Saved Ojbects** and click **Import**.
4. When prompted to choose an index pattern, select the index pattern created above in step 1
5. Upon successful import, the dashboards can be found under **Dashboard** section


# License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
