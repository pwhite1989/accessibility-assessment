const router = require('express').Router();
const fs = require('fs')
const path = require('path')
const logger = require('../logger')
const config = require('../config')
const { capture, exclude, error } = require('../services/urls')
const { applicationStatus } = require('../services/globals')

var testOnlyRegEx = RegExp('test\-only');
var stubRegEx = RegExp('http:\/\/localhost:[0-9]{4}\/([a-z/-]+\-stub)');
var htmlContentRegEx = RegExp('<\\s*html[^>]*>([\\s\\S]*?)<\\s*\/\\s*html>');

router.post('/', (req, res, next) => {
  const body = req.body;
  const logData = Object.assign({}, body)
  const pageDirectory = path.join(config.pagesDirectory, '' + body.timestamp)
  logData.pageHTML = logData.pageHTML.substr(0, 100) + '...'
  logData.files = Object.keys(logData.files)
  const errors = Object.assign({}, {errors:logData.errors})

  for (var assetError in logData.errors) {
    error(logData.errors[assetError].failedUrl, body.pageURL)
  };

  //Capture the page for assessment if:
  //   - it hasn't already been captured and onePagePerPath is true
  //   - the page urls does not contain the text 'stub'
  //   - the page is not test-only
  //   - the page contains valid HTML tags
  if((config.captureAllPages === 'true' || !global.capturedUrls.includes(body.pageURL))
      && !stubRegEx.test(body.pageURL)
      && !testOnlyRegEx.test(body.pageURL)
      && htmlContentRegEx.test(body.pageHTML)){

    capture(body.pageURL)
    const fileList = Object.assign({}, body.files, {'index.html': body.pageHTML}, {'data': body.pageURL})
    fs.mkdirSync(pageDirectory, { recursive: true })

    Object.keys(fileList).forEach(fileName => {
      fs.writeFile(path.join(pageDirectory, fileName), fileList[fileName], (err, data) => {
        if (err) {throw err}
        logger.log('INFO', `Captured ${fileName} for ${body.pageURL}`)
      })
    })
  } else {
    if(!global.capturedUrls.includes(body.pageURL) && !global.excludedUrls.includes(body.pageURL) ) {
      exclude(body.pageURL)
    }
  }
  applicationStatus('PAGES_CAPTURED')
  res.status('201').send()
})

module.exports = router;
