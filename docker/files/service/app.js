const config = require('./config/config')
const logger = require('./logger')
const express = require('express')
const errorHandler = require('errorhandler')

var app = express();

app.use(express.json({limit: '500mb',}));
app.use(errorHandler());
app.use(require('./routes'));
app.use('/pages', express.static('pages'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
    logger.log("ERROR", err.message);
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: err
    }});
});

global.status = 'NOT_SET'

var server = app.listen(config.port, function() {
  logger.log("INFO",`Accessibility assessment service running on port ${config.port}`)
});
