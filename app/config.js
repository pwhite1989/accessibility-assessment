const env = process.env.NODE_ENV

const docker = {
  port: parseInt(process.env.APP_PORT) || 6010,
  rootDir: process.env.HOME,
  outputDir: `${process.env.HOME}/output/`,
  scriptDir: `${process.env.HOME}/app/resources`,
  assetsDir: `${process.env.HOME}/app/resources/assets`,
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  accessibilityAssessmentReportCsv: 'accessibility-assessment-report.csv',
  globalFilterFileName: 'global-filters.conf',
  captureAllPages: process.env.CAPTURE_ALL_PAGES || false,
  pagesDirectory: `${process.env.HOME}/pages/`
};

const local = {
  port: parseInt(process.env.APP_PORT) || 6010,
  rootDir: '/Users/dan/dev/hmrc/accessibility-assessment/',
  outputDir: './output/',
  scriptDir: './resources',
  assetsDir: `/Users/dan/dev/hmrc/accessibility-assessment/app/resources/assets`,
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  accessibilityAssessmentReportCsv: 'accessibility-assessment-report.csv',
  globalFilterFileName: 'global-filters.conf',
  captureAllPages: false,
  pagesDirectory: './pages/'
}

const config = {
  docker,
  local
}

module.exports = config[env];
