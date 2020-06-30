const express = require('express')
const config = require('./config')
const logger = require('./logger')
const { reset } = require('./services/globals')

let app = express();
app.use(express.json({limit: '500mb',}));

//Define Routes
app.use('/api/logs', require('./routes/logs.js'));
app.use('/api/app', require('./routes/application.js'));
app.use('/api/capture-page', require('./routes/capturePage.js'));
app.use('/api/assess-pages', require('./routes/assessPages.js'));
app.use('/api/report', require('./routes/report.js'));
app.use('/api/status', require('./routes/status.js'));
app.use('/api/report/pages', express.static(config.pagesDirectory));

//Add error handling
app.use('/api', errorHandler);

function errorHandler(err, req, res, next) {
    logger.log("ERROR", err.message);
    var httpStatus = err.status || 500
    return res.status(httpStatus).json({message:err.message}).send()
};

//Start the application
var server = app.listen(config.port, function() {
  reset()
  logger.log("INFO",`Accessibility assessment service running on port ${config.port}`)
});
