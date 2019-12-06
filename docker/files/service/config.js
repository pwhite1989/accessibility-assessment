const env = process.env.NODE_ENV;

const jenkins = {
  port : parseInt(process.env.APP_PORT) || 16001,
  globalFilterConfigLocation : "/home/seluser/",
  outputDir : "/home/seluser/output"
};

const dev = {
  port : parseInt(process.env.APP_PORT) || 6001,
  globalFilterConfigLocation : './',
  outputDir : './'
};

const config = {
 dev,
 jenkins
};

module.exports = config[env];
