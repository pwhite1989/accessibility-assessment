const logger = require('../logger')

global.status = 'READY'
global.testSuite = 'not-set'
global.buildUrl = ''

module.exports.applicationStatus = function (newApplicationStatus) {
  if (newApplicationStatus != global.status) {
    logger.log("INFO", `Setting accessibility assessment service status from ${global.status} to ${newApplicationStatus}`)
    global.status = newApplicationStatus
  }
}
