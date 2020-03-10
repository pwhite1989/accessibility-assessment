const router = require('express').Router();
const logger = require('../logger')
const { applicationStatus } = require('../services/globals');
const { runAssessment } = require('../services/scripts');

router.post('/', (req, res) => {
  if(global.status != 'PAGES_CAPTURED') {
    logger.log('INFO', "No pages available for assessment.")
    return res.status(200).json({message: "No Pages available for assessment."}).send()
  }

  applicationStatus("ASSESSING_PAGES");
  runAssessment();
  res.status(202).json({message: "Page assessment triggered."}).send();
})

module.exports = router;
