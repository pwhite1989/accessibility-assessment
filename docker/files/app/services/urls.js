const logger = require('../logger')
const { captureUrl, excludeUrl, logErroredAsset } = require('./globals');

module.exports.capture = function (url) {
  captureUrl(url);
  logger.log("INFO", `Captured page with URL: ${url}`);
}

module.exports.exclude = function (url) {
  excludeUrl(url);
  logger.log("INFO", `Excluded page with URL: ${url}`);
}

module.exports.error = function (path, url) {
  logErroredAsset({url: url, path: path});
  logger.log("ERROR", `Failed to capture asset with path ${path} for page with URL ${url}`);
}
