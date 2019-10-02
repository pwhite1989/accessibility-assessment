const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()
const port = process.env.SERVICE_PORT
const test_suite_name = process.env.TEST_SUITE_NAME

var status='NOT-SET'

const rootDir = path.join(process.env.HOME,  'output')

app.get('/status', (req, res) => {
  logger("INFO",`Returning Accessibility assessment service status:${status}`)
  res.status(200).send(status)
})

app.post('/status/:status', (req, res) => {
  logger("INFO",`Setting accessibility assessment service status:${req.params.status}`)
  status=req.params.status
  res.status(204).send()
})

app.listen(port, () => logger("INFO",`Accessibility assessment service running on port ${port}`))

function logger(level, message) {
  const formatted_message = `{"level": "${level}", "message": "${message}", "type": "accessibility_logs", "app": "accessibility-assessment-service", "testSuite": "${test_suite_name}"}\n`
  console.log(formatted_message)
  fs.appendFile(path.join(rootDir, "accessibility-assessment-service.log"), formatted_message, (err, data) => {
    if (err) {
      throw err
    }
  })
}