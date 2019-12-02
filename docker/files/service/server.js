const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require('multer');
const app = express()
const port = process.env.SERVICE_PORT
const test_suite_name = "undefined"
const uploadConfigToDir = path.join(process.env.HOME)
const outputDir = path.join(process.env.HOME,  'output')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfigToDir)
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
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  logger("INFO",`Setting setting global configuration`)
  res.status(200).send()
})

app.listen(port, () => logger("INFO",`Accessibility assessment service running on port ${port}`))

function logger(level, message) {
  const formatted_message = `{"level": "${level}", "message": "${message}", "type": "accessibility_logs", "app": "accessibility-assessment-service", "testSuite": "${test_suite_name}"}\n`
  console.log(formatted_message)
  fs.appendFile(path.join(outputDir, "accessibility-assessment-service.log"), formatted_message, (err, data) => {
    if (err) {
      throw err
    }
  })
}
