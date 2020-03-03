const logger = require('../logger')

global.capturedUrls = []
global.excludedUrls = []

module.exports.capture = function (url) {
  logger.log("INFO", `Captured page with URL: ${url}`)
  global.capturedUrls.push(url)
}

module.exports.exclude = function (url) {
  logger.log("INFO", `Excluded page with URL: ${url}`)
  global.excludedUrls.push(url)
}
