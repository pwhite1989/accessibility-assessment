const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()
const port = 6001

app.use(express.json({limit: '500mb',}));
var capturedUrls = [];
var excludeUrls = ["http://localhost:9949/auth-login-stub/gg-sign-in"]

app.post('/page-data', (req, res) => {
  const body = req.body;
  const logData = Object.assign({}, body)
  const rootDir = path.join(__dirname,  'output', '' + body.timestamp)
  logData.pageHTML = logData.pageHTML.substr(0, 100) + '...'
  logData.files = Object.keys(logData.files)

  if(!capturedUrls.includes(body.pageURL) && !excludeUrls.includes(body.pageURL)) {
    capturedUrls.push(body.pageURL)
    const fileList = Object.assign({}, body.files, {'index.html': '<!DOCTYPE html>\n' + body.pageHTML}, {'data': body.pageURL})
    fs.mkdirSync(rootDir, { recursive: true })
    Object.keys(fileList).forEach(fileName => {
      fs.writeFile(path.join(rootDir, fileName), fileList[fileName], (err, data) => {
        if (err) {throw err}
        console.log('saved file', fileName, body.pageHTML.substr(0, 20) + '...')
      })
    })
  }
  console.log(logData)

  res.status('201').send('Done')
})

app.get('/urls', (req, res) => {
  res.status(200).send(capturedUrls)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
