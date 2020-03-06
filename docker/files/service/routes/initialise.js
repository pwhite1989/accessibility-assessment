const router = require('express').Router();
const logger = require('../logger')

router.post('/', (req, res, next) => {
  if(!req.body.testSuite || !req.body.buildUrl) {
    let err = new Error(`Must supply a 'testSuite' and 'buildUrl' param in the request. Received testSuite:${req.body.testSuite} and buildUrl:${req.body.buildUrl}`)
    err.status = 400;
    return next(err);
  }
  global.buildUrl=req.body.buildUrl
  global.testSuite=req.body.testSuite
  logger.log('INFO', `Assessment initialised with test suite name '${global.testSuite}' and build URL '${global.buildUrl}'. `)
  res.status(200).json({ applicationStatus: global.status, testSuite: global.testSuite, buildUrl: global.buildUrl}).send();
})

module.exports = router;
