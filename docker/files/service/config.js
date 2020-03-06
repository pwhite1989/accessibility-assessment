const env = process.env.NODE_ENV

const docker = {
  port: parseInt(process.env.APP_PORT) || 6010,
  outputDir: '/home/seluser/output/',
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  captureAllPages: process.env.CAPTURE_ALL_PAGES || false,
  pagesDirectory: '/home/seluser/pages/'
};

const local = {
  port: parseInt(process.env.APP_PORT) || 6010,
  outputDir: './output/',
  accessibilityAssessmentReportHtml: 'accessibility-assessment-report.html',
  accessibilityAssessmentReportJson: 'accessibility-assessment-report.json',
  captureAllPages: false,
  pagesDirectory: './pages/'
}

const config = {
  docker,
  local
}

module.exports = config[env];
