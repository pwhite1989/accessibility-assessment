# Accessibility Assessment Image
This project contains the Dockerfile and images assets required to create the accessibility-assessment image that is used in CI for the assessment of captured pages using axe, pa11y and vnu.  The violations found during the assessment are pushed to ELK.

## Running the image locally
The following instructions are intended to give reviewers of the point in time accessibility audit early sight of the accessibility assessment findings.  This functionality will be made available in our CI in the coming weeks.

We believe the automated assessment generates some value, however this value is hidden amongst a **LOT** of background noise.  We have not filtered any of the axe/pa11y/vnu violations at this time, so it wouldn't be unexpected for a 10 page assessment to generate ~150 Violations.  

For this reason we're using the ELK stack to Visualise findings.

### Assessing a test suite
You will need [docker](https://docs.docker.com/install) installed and an API token configured in our build jenkins to proceed with this guide.

1. Build the accessibility-assessment image from the [docker](docker/) directory:
```bash
./build-image.sh
```
2. Ensure that you have ~6GB of memory allocated to your docker engine.
3. Start your local ELK stack from the [apps](apps/) directory:
```bash
docker-compose up -d
```
> Go to http://localhost:5601 in your browser and wait for kibana to initialise:

4. Ensure that you have the `JENKINS_USERNAME` and `JENKINS_API_KEY` environment variables configured in your local development environment.  These credentials are used by the assessment container to retrieve pages via the jenkins api.

5. Provide the test suite's Jenkins build url that you'd like to assess. It is required that the pages to be assessed
are already captured and archived under `<build_url>/artifact/pages`. Jenkins Build URL can be found in: `<jenkins-job-url>/<build-number>/injectedEnvVars/`
 
```bash
./test-assessment-image.sh <build_url>
```

**NOTE: Running time will depend on the number of unique pages that were captured during the UI test run.  As a rough guide, expect the assessment to take approximately 4 seconds per page.**

### Visualising Violations in Kibana
Visualisations are loaded manually using Kibana's Saved Object import UI.  If this is the first time you've run the `docker-compose` command in the previous section, then please follow the below instructions to generate the visualisations you'll need to review the results of the assessment:

1. In Kibana, navigate to **Management -> Saved Ojbects** and click **Import**.  
2. Load the [index saved object](apps/kibana/kibana-index-so.json).  Set the *time filter* field to *testRun* when prompted.
3. Click **Import** again and load the [visualisations and dashboards saved objects](apps/kibana/management-kibana-so.json). Note that this file contains over 700 saved objects so may take a few minutes to load.

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


# License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
