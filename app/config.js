const env = process.env.NODE_ENV

const docker = {
  port: parseInt(process.env.APP_PORT) || 6010,
  rootDir: process.env.HOME,
  outputDir: `${process.env.HOME}/output/`,
  scriptDir: `${process.env.HOME}/app/resources`,
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  globalFilterFileName: 'global-filters.conf',
  captureAllPages: process.env.CAPTURE_ALL_PAGES || false,
  pagesDirectory: `${process.env.HOME}/pages/`
};

const local = {
  port: parseInt(process.env.APP_PORT) || 6010,
  rootDir: '/Users/dan/dev/hmrc/accessibility-assessment/app',
  outputDir: './output/',
  scriptDir: './resources',
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  globalFilterFileName: 'global-filters.conf',
  captureAllPages: false,
  pagesDirectory: './pages/'
}

const config = {
  docker,
  local
}

module.exports = config[env];
