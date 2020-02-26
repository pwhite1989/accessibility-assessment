# Accessibility Assessment Image
This project contains the Dockerfile and images assets required to create the accessibility-assessment image that is used in CI for the assessment of captured pages using [axe](https://www.deque.com/axe/) and [Nu HTML Checker](https://validator.github.io/validator/).

## Image Composition
Due to the experimental nature of the accessibility audit, the image functionality has been implemented in various places:
- `entry_point.sh` script.  This script currently uploads an archived bundle of HTML pages/assets from Jenkins and explodes the bundle on the file system of the container. The script then runs the page-accessibility-check  app.
- [page-accessibility-check.jar](https://github.com/hmrc/page-accessibility-check): a scala application that orchestrates page assessments, parses reports and normalises the output for ingestion in Kibana.
- [accessibility-assessment-service](docker/files/service/server.js): a simple, single file node express service which exposes endpoints to the jenkins job for retrieving the container status, uploading filter configuration and retrieving a basic HTML report.

We intend future improvements to collapse the above parts into a single Scala service which will support capturing pages, conducting the assessment/validation and compiling a report alongside UI test job execution.  Note that the functionality for capturing pages currently resides in the [page-capture-service](https://github.com/hmrc/page-capture-service), which is a Node application that initialises prior to test execution on the Jenkins build slave.

## Building the image...

### For use in CI
The [Makefile](Makefile) at the root of this project is used by Jenkins to build and push new versions of this image to artefactory for use in CI.

### For use in your local development environment
If you have [docker](https://docs.docker.com/install) installed, you can build this image for use locally with the following commands:
```bash
cd docker
./build-image.sh
```

This will push an image named **accessibility-assessment:SNAPSHOT** to you local docker repository.

## Testing the image locally
To test this image locally using pages captured by a UI test suite in Jenkins, you will need:
- to have [docker](https://docs.docker.com/install) installed locally; and
- have an API token configured in our build jenkins


### Running up a local ELK stack
You will need to have ~6GB of memory allocated to your local docker engine to run the ELK stack.  You can configure this in **Docker -> Preferences**

1. Start ELK with the docker compose script provided in the [apps](apps/) directory:
```bash
cd apps/
docker-compose up -d
```
2. Go to http://localhost:5601 in your browser and wait for Kibana to initialise:

### Assess the pages captured by a jenkins build


1. Ensure that you have the `JENKINS_USERNAME` and `JENKINS_API_KEY` environment variables configured in your local development environment.  These credentials are used by the assessment container to retrieve pages via the jenkins api.

2. Provide the complete **build URL** as an argument to the (test-assessment-image.sh script)[test-assessment-image.sh]. For example:

```bash
./test-assessment-image.sh https://build.tax.service.gov.uk/job/PlatOps/job/Examples/job/platops-example-a11y-test/2
```

### Visualising Violations in Kibana
Visualisations for the local Kibana instance can be loaded manually using Kibana's Saved Object import UI.  If this is the first time you've run the `docker-compose` command in the previous section, then please follow the below instructions to generate the visualisations you'll need to review the results of the assessment:

1. In Kibana, navigate to **Management -> Saved Ojbects** and click **Import**.
2. Load the [index saved object](apps/kibana/kibana-index-so.json).  Set the *time filter* field to *testRun* when prompted.
3. Click **Import** again and load the [visualisations and dashboards saved objects](apps/kibana/management-kibana-so.json).

You should now be able to search for Dashboards and Visualisations using the *test-suite-name* given to your UI test job in our build-jobs config.

**IMPORTANT: The time filter field we use in Kibana is currently "@timestamp", which is the timestamp when the logs are injected.
In Management Kibana the time injected into Kibana should be almost same as the time the test was completed. However, when running locally, this will be different. Make sure that you have your Kibana "Time Range" set appropriately or the visualisations in your dashboards won't be visible."**

### Stopping your local ELK stack
Execute the following command from the `apps/` directory:
```bash
docker-compose kill
```
All of the data loaded into ElasticSearch during the assessment will be persisted in `apps/esdata/` for when you next start your local ELK stack.

### Clearing down your local Data
As mentioned in the previous section, all alerts and saved objects will be written to disk in `apps/esdata/`.

If you wish to clear down Elastic Search, simply delete everything in this directory.  I.e. `rm -r apps/esdata/*` Note that doing so will also delete the Index and other Visualisation saved objects imported in the **Visualising Violations in Kibana** section above.

## image improvements
TODO:
- set the test suite var globally, ensure that the service logs with Test suite set.
- implement the page capture env
- update the page-accessibility-check app to set a relative page link (to the bundle) and absolute link to the kibana logs.
- surface all urls/excluded urls and logs via endpoint
- remove writing to fs for urls/excluded urls.
- review error handling???
- create a script to test against jenkins builds.
- 

# License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
