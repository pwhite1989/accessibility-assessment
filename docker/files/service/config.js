const env = process.env.NODE_ENV

const docker = {
  port: parseInt(process.env.APP_PORT) || 6010,
  outputDir: '/home/seluser/output',
  accessibility_assessment_report: process.env.A11Y_REPORT_FILE_NAME || 'accessibility-assessment-report.html',
  captureAllPages: process.env.CAPTURE_ALL_PAGES || false,
  pagesDirectory: '/home/seluser/pages'
};

const local = {
  port: parseInt(process.env.APP_PORT) || 6010,
  outputDir: './',
  accessibility_assessment_report: process.env.A11Y_REPORT_FILE_NAME || 'accessibility-assessment-report.html',
  captureAllPages: false,
  pagesDirectory: './pages'
}

const config = {
  docker,
  local
}

module.exports = config[env];
