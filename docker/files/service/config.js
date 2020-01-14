const env = process.env.NODE_ENV;

const jenkins = {
    port: parseInt(process.env.APP_PORT) || 16001,
    globalFilterConfigLocation: "/home/seluser/",
    outputDir: "/home/seluser/output",
    accessibility_assessment_report: process.env.A11Y_REPORT_FILE_NAME || 'accessibility-assessment-report.html'
};

const dev = {
    port: parseInt(process.env.APP_PORT) || 6001,
    globalFilterConfigLocation: './',
    outputDir: './',
    accessibility_assessment_report: process.env.A11Y_REPORT_FILE_NAME || 'accessibility-assessment-report.html'
};

const config = {
 dev,
 jenkins
};

module.exports = config[env];
