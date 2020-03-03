const router = require('express').Router();
const logger = require('../../logger')
const fs = require('fs')
const path = require('path')
const config = require('../../config/config')
const rimraf = require("rimraf");
const {capture, exclude} = require('../../service/urls')

var testOnlyRegEx = RegExp('test\-only');
var stubRegEx = RegExp('http:\/\/localhost:[0-9]{4}\/([a-z/-]+\-stub)');
var htmlContentRegEx = RegExp('<\\s*html[^>]*>([\\s\\S]*?)<\\s*\/\\s*html>');

router.post('/', (req, res) => {
  const body = req.body;
  const logData = Object.assign({}, body)
  const pageDirectory = path.join(config.pagesDirectory, '' + body.timestamp)
  logData.pageHTML = logData.pageHTML.substr(0, 100) + '...'
  logData.files = Object.keys(logData.files)

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
    const fileList = Object.assign({}, body.files, {'index.html': '<!DOCTYPE html>\n' + body.pageHTML}, {'data': body.pageURL})
    fs.mkdirSync(pageDirectory, { recursive: true })

    Object.keys(fileList).forEach(fileName => {
      fs.writeFile(path.join(pageDirectory, fileName), fileList[fileName], (err, data) => {
        if (err) {throw err}
        logger.log('INFO', `Captured ${fileName}`)
      })
    })
  } else {
    if(!global.capturedUrls.includes(body.pageURL) && !global.excludedUrls.includes(body.pageURL) ) {
      exclude(body.pageURL)
    }
  }
  res.status('201').send('Done')
})

module.exports = router;
