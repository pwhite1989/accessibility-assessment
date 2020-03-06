const router = require('express').Router();
const logger = require('../logger')
const { initialiseApp } = require('../service/globals')

router.post('/', async (req, res, next) => {
  if(!req.body.testSuite || !req.body.buildUrl) {
    let err = new Error(`Must supply a 'testSuite' and 'buildUrl' param in the request. Received testSuite:${req.body.testSuite} and buildUrl:${req.body.buildUrl}`)
    err.status = 400;
    return next(err);
  }
  await initialiseApp(req.body.testSuite, req.body.buildUrl);
  res.status(200).json({ applicationStatus: global.status, testSuite: global.testSuite, buildUrl: global.buildUrl}).send();
})

module.exports = router;
