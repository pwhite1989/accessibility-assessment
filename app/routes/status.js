const router = require('express').Router();
const logger = require('../logger')

router.get('/', (req, res) => {
  logger.log("INFO",`Returning Accessibility assessment service status:${global.status}`)
  res.status(200).send(global.status)
})

module.exports = router;
