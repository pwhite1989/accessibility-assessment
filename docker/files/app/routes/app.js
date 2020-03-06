const router = require('express').Router();
var rimraf = require("rimraf");
const path = require('path')
const logger = require('../logger')
const { initialiseApp, reset } = require('../services/globals')
const config = require('../config')

router.post('/initialise', async (req, res, next) => {
  if(!req.body.testSuite || !req.body.buildUrl) {
    let err = new Error(`Must supply a 'testSuite' and 'buildUrl' param in the request. Received testSuite:${req.body.testSuite} and buildUrl:${req.body.buildUrl}`)
    err.status = 400;
    return next(err);
  }
  await initialiseApp(req.body.testSuite, req.body.buildUrl);
  res.status(200).json({ applicationStatus: global.status, testSuite: global.testSuite, buildUrl: global.buildUrl}).send();
})

router.post('/shut-down', async (req, res, next) => {

  res.status(200).send();
})

router.post('/reset', async (req, res, next) => {
  rimraf.sync(config.pagesDirectory);
  rimraf.sync(path.join(config.outputDir, config.accessibilityAssessmentReportHtml));
  rimraf.sync(path.join(config.outputDir, config.accessibilityAssessmentReportJson));
  reset();
  res.status(200).send();
})

module.exports = router;
