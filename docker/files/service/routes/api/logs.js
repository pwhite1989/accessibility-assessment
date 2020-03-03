const router = require('express').Router();
const config = require('../../config/config')
const path = require('path')
const fs = require('fs')

router.get('/urls', (req, res) => {
  res.json({capturedUrls:global.capturedUrls, excludedUrls: global.excludedUrls, errors: global.erroredAssets})
  res.status(200).send()
})

const logFilePath = path.join(config.outputDir, "accessibility-assessment-service.log")

router.get('/app', (req, res) => {
  let readStream = fs.createReadStream(logFilePath);
  readStream.pipe(res);
  readStream.on('error', (err) => {
    logger.log('ERROR', 'Error reading accessibility assessment service logs. Failed with ' + err);
    return res.sendStatus(500);
  });
})

module.exports = router;
