const router = require('express').Router();
const logger = require('../../logger')
const fs = require('fs')
const path = require('path')
const config = require('../../config/config')
const rimraf = require("rimraf");

var capturedUrls = [];
var excludedUrls = [];
var testOnlyRegEx = RegExp('test\-only');
var stubRegEx = RegExp('http:\/\/localhost:[0-9]{4}\/([a-z/-]+\-stub)');
var htmlContentRegEx = RegExp('<\\s*html[^>]*>([\\s\\S]*?)<\\s*\/\\s*html>');

rimraf(path.join(config.pagesDirectory), function () {
  logger.log("DEBUG", "Removed pages directory");
});
deleteFile(path.join(config.outputDir, 'urls.log'))
deleteFile(path.join(config.outputDir, 'excluded-urls.log'))

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
  if((config.captureAllPages === 'true' || !capturedUrls.includes(body.pageURL))
      && !stubRegEx.test(body.pageURL)
      && !testOnlyRegEx.test(body.pageURL)
      && htmlContentRegEx.test(body.pageHTML)){
    capturedUrls.push(body.pageURL)
    fs.appendFile("urls.log", body.pageURL + '\n', handleErrors)
    const fileList = Object.assign({}, body.files, {'index.html': '<!DOCTYPE html>\n' + body.pageHTML}, {'data': body.pageURL})
    fs.mkdirSync(pageDirectory, { recursive: true })
    Object.keys(fileList).forEach(fileName => {
      fs.writeFile(path.join(pageDirectory, fileName), fileList[fileName], (err, data) => {
        if (err) {throw err}
        console.log('saved file', fileName, body.pageHTML.substr(0, 20) + '...')
      })
    })
  } else {
    if(!capturedUrls.includes(body.pageURL) && !excludedUrls.includes(body.pageURL) ) {
      fs.appendFile("excluded-urls.log", body.pageURL + '\n', handleErrors)
      excludedUrls.push(body.pageURL)
    }
  }
  logger.log("INFO", logData)
  res.status('201').send('Done')
})

function deleteFile(name) {
  fs.unlink(name, (err) => {
  if (err) {
    logger.log("DEBUG", "Failed to remove file with error:" + err.message)
    return
  }
  logger.log("DEBUG", `Removed file: ${name}`)
  })
}

function handleErrors(err) {
  if (err) throw err;
  console.log('Saved URL');
}

module.exports = router;
