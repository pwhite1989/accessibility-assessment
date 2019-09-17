const express = require('express')
const app = express()
const port = process.env.SERVICE_PORT

var status='NOT-SET'

app.get('/status', (req, res) => {
  res.status(200).send(status)
})

app.post('/status/:status', (req, res) => {
  status=req.params.status
  res.status(204).send()
})

app.listen(port, () => console.log(`Accessibility assessment service running on port ${port}`))
