const config = require('./config/config')
const logger = require('./logger')
const express = require('express')

var app = express();

app.use(express.json({limit: '500mb',}));
app.use(require('./routes'));
app.use('/captured-pages', express.static('pages'));
app.use('/api', errorHandler);


function errorHandler(err, req, res, next) {
    logger.log("ERROR", err.message);
    var httpStatus = err.status || 500
    return res.status(httpStatus).json({message:err.message}).send()
};

var server = app.listen(config.port, function() {
  logger.log("INFO",`Accessibility assessment service running on port ${config.port}`)
});
