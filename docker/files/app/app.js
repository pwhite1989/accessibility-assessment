const express = require('express')
const config = require('./config')
const logger = require('./logger')

let app = express();
app.use(express.json({limit: '500mb',}));

//Define routes
const logs = require('./routes/logs.js')
const capturePage = require('./routes/capturePage.js')
const assessPages = require('./routes/assessPages.js')
const report = require('./routes/report.js')
const status = require('./routes/status.js')

//Add middleware
app.use('/captured-pages', express.static('pages'));
app.use('/api/logs', logs);
app.use('/api/app', require('./routes/app.js'));
app.use('/api/capture-page', capturePage);
app.use('/api/assess-pages', assessPages);
app.use('/api/report', report);
app.use('/api/status', status);

//Add error handling
app.use('/api', errorHandler);

function errorHandler(err, req, res, next) {
    logger.log("ERROR", err.message);
    var httpStatus = err.status || 500
    return res.status(httpStatus).json({message:err.message}).send()
};

//Start the application
var server = app.listen(config.port, function() {
  logger.log("INFO",`Accessibility assessment service running on port ${config.port}`)
});
