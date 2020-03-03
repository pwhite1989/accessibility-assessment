const logger = require('../logger')

global.capturedUrls = []
global.excludedUrls = []
global.erroredAssets = []

module.exports.capture = function (url) {
  logger.log("INFO", `Captured page with URL: ${url}`)
  global.capturedUrls.push(url)
}

module.exports.exclude = function (url) {
  logger.log("INFO", `Excluded page with URL: ${url}`)
  global.excludedUrls.push(url)
}

module.exports.error = function (path, url) {
  logger.log("ERROR", `Failed to capture asset with path ${path} for page with URL ${url}`)
  global.erroredAssets.push({url: url, path: path})
}
