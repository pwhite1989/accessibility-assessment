const env = process.env.NODE_ENV || 'local'

const configurations = {
  base: {
    env,
    port: parseInt(process.env.APP_PORT) || 6010,
    rootDir: '/root-dir/',
    outputDir: `/root-dir/output/`,
    resourcesDir: `/root-dir/resources/`,
    assetsDir: `/root-dir/app/resources/assets/`,
    accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
    accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
    accessibilityAssessmentReportCsv: 'accessibility-assessment-report.csv',
    globalFilterLocation: `/root-dir/global-filters.conf`,
    captureAllPages: false,
    pagesDirectory: `/root-dir/pages/`
  },
  docker: {
    rootDir: process.env.HOME,
    outputDir: `${process.env.HOME}/output/`,
    resourcesDir: `${process.env.HOME}/app/resources/`,
    assetsDir: `${process.env.HOME}/app/resources/assets/`,
    globalFilterLocation: `${process.env.HOME}/global-filters.conf`,
    pagesDirectory: `${process.env.HOME}/pages/`,
    captureAllPages: process.env.CAPTURE_ALL_PAGES || false
  },
  local: {
    rootDir: `${process.env.WORKSPACE}/accessibility-assessment/app/`,
    outputDir: `${process.env.WORKSPACE}/accessibility-assessment/app/output/`,
    resourcesDir: `${process.env.WORKSPACE}/accessibility-assessment/app/resources/`,
    assetsDir: `${process.env.WORKSPACE}/accessibility-assessment/app/resources/assets/`,
    globalFilterLocation: `${process.env.WORKSPACE}/accessibility-assessment/app/global-filters.conf`,
    pagesDirectory: `${process.env.WORKSPACE}/accessibility-assessment/app/pages/`,
  }
}

const config = Object.assign(configurations.base, configurations[env]);

module.exports = config;
