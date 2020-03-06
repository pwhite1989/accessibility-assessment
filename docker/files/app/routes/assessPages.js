const router = require('express').Router();
const { applicationStatus } = require('../service/globals');
const { runAssessment } = require('../service/scripts');

router.post('/', (req, res) => {
  applicationStatus("ASSESSING_PAGES");
  runAssessment();
  res.status(202).json({message: "Page assessment triggered."}).send();
})

module.exports = router;
