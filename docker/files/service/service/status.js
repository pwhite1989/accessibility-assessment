const logger = require('../logger')

module.exports = function (newStatus) {
  logger.log("INFO", `Setting accessibility assessment service status from ${global.status} to ${newStatus}`)
  global.status = newStatus
}
