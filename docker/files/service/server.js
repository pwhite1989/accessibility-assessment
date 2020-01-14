const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require('multer')
const config = require('./config')
const app = express()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.globalFilterConfigLocation)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage })
var status='NOT-SET'

app.get('/status', (req, res) => {
  logger("INFO",`Returning Accessibility assessment service status:${status}`)
  res.status(200).send(status)
})

app.post('/status/:status', (req, res) => {
  logger("INFO",`Setting accessibility assessment service status from ${status} to ${req.params.status}`)
  status=req.params.status
  res.status(204).send()
})

app.post('/upload', upload.single('global-filters.conf'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please provide a file')
    error.httpStatusCode = 400
    return next(error)
  }
  logger("INFO",`Global configuration uploaded`)
  res.status(200).send()
})

app.get('/report', (req, res) => {
  const reportPath = path.join(config.outputDir, config.accessibility_assessment_report)

  let readStream = fs.createReadStream(reportPath);
    readStream.pipe(res);

    readStream.on('error', (err) => {
      logger('ERROR', 'Error reading accessibility assessment report file. Failed with ' + err);
      return res.sendStatus(500);
    });

    res.on('error', (err) => {
      logger('ERROR', 'Error in write stream. Writing accessibility assessment report file failed with ' + err);
    });
});

app.listen(config.port, () => logger("INFO",`Accessibility assessment service running on port ${config.port}`))

function logger(level, message) {
  const formatted_message = `{"level": "${level}", "message": "${message}", "type": "accessibility_logs", "app": "accessibility-assessment-service", "testSuite": "NotSet"}\n`
  console.log(formatted_message)
  fs.appendFile(path.join(config.outputDir, "accessibility-assessment-service.log"), formatted_message, (err, data) => {
    if (err) {
      throw err
    }
  })
}
