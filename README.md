# Accessibility Assessment Image
This project contains the Dockerfile and dependencies for the access

## Running the image locally
You will need to install [docker](https://docs.docker.com/install) to proceed with this guide.

The following instructions give reviewers of the point in time accessibility audit early sight of the accessibility assessment findings. Work is ongoing to implement this functionality in the build.

### Assessing a test suite

1. Build the accessibility-assessment image from the [docker](docker/) directory:
```bash
docker build -t accessibility-assessment:1.0.0 .
```
2. Start your local ELK stack from the [apps](apps/) directory:
```bash
docker-compose up -d
```
> Go to http://localhost:5601 in your browser and wait for kibana to initialise

3. In Kibana, navigate to **Management -> Saved Ojbects** and click **Import**.  Load the [Index Saved Object](apps/kibana/kibana-index-so.json) and the [visualisations and dashboards](apps/kibana/management-kibana-so.json).  This file contains +700 saved objects so may take a few minutes to load.

4. Ensure that you have the `JENKINS_USERNAME` and `JENKINS_API_KEY` environment variables set in your local development environment.  These values are used to retrieve a given test suite's pages from the jenkins api.

5. Pick the test suite job name that you'd like to assess from jenkins(?) and execute:
```bash
./assess-test-suite.sh your-ui-test-job-name
```

**NOTE: Running time will depend on the number of unique pages that were captured during the UI test run.  As a rough guide, expect the assessment to take approximately 4 seconds per page.**

### Stopping your local ELK stack
Execute the following command:
```bash
docker-compose kill
```
All of the data loaded into ElasticSearch during the assessment will be persisted in `apps/esdata/` for when you next start your local ELK stack.

### Clearing down your local Data
As mentioned in the previous section, all alerts and saved objects will be written to disk in `apps/esdata/`.

If you wish to clear down Elastic Search, simply delete everything in this directory.  I.e. `rm -r apps/esdata/*`


# License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
