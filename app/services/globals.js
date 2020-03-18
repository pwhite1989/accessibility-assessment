const logger = require('../logger')

module.exports.applicationStatus = function (newApplicationStatus) {
  if (newApplicationStatus != global.status) {
    logger.log("INFO", `Setting accessibility assessment service status from ${global.status} to ${newApplicationStatus}`)
    global.status = newApplicationStatus
  }
}

module.exports.initialiseApp = function (testSuite, buildUrl) {
  global.testSuite = testSuite
  global.buildUrl = buildUrl
  logger.log('INFO', `Assessment initialised with test suite name '${global.testSuite}' and build URL '${global.buildUrl}'. `)
}

module.exports.reset = () => {
  global.status = 'READY'
  global.capturedUrls = []
  global.excludedUrls = []
  global.erroredAssets = []
  global.testSuite = 'not-set'
  global.buildUrl = ''
}

module.exports.captureUrl = (url) => { global.capturedUrls.push(url) }
module.exports.excludeUrl = (url) => { global.excludedUrls.push(url) }
module.exports.logErroredAsset = (asset) => { global.erroredAssets.push(asset) }
