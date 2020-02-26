const router = require('express').Router();
const logger = require('../../logger')
const status = require('../../service/status')

router.get('/', (req, res) => {
  logger.log("INFO",`Returning Accessibility assessment service status:${global.status}`)
  res.status(200).send(global.status)
})

router.post('/:status', (req, res) => {
  status(req.params.status)
  res.status(204).send()
})

module.exports = router;
