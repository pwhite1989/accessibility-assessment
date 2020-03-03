const router = require('express').Router();
const logger = require('../../logger')
const setStatus = require('../../service/status')

const applicationStatus=['NOT_SET',
                        'READY_TO_ASSESS',
                        'ASSESSING_PAGES',
                        'ASSESSMENT_COMPLETE',
                        'GENERATING_REPORT',
                        'REPORT_READY']

router.get('/', (req, res) => {
  logger.log("INFO",`Returning Accessibility assessment service status:${global.status}`)
  res.status(200).send(global.status)
})

router.post('/:status', async (req, res, next) => {
  if(!applicationStatus.includes(req.params.status)) {
    let err = new Error(`${req.params.status} is not a valid status. Must be one of: ${applicationStatus}`)
    err.status=400
    return next(err)
  }

  setStatus(req.params.status)
  res.status(204).send()
})

module.exports = router;
