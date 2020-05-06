const router = require('express').Router();
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const config = require('../config')
const logger = require('../logger');

router.get('/html', (req, res, next) => {
  if(global.status != 'REPORT_READY') {
    return res.status(200).send('<html><body>The html report is not available.</body></html>');
  }
  filePath = path.join(config.outputDir, config.accessibilityAssessmentReportHtml);
  respondWithFile(filePath, res, next);
});

router.get('/json', (req, res, next) => {
  if(global.status != 'REPORT_READY') {
    return res.status(200).json({}).send();
  }
  let filePath = path.join(config.outputDir, config.accessibilityAssessmentReportJson);
  respondWithFile(filePath, res, next);
});

router.get('/csv', (req, res, next) => {
  if(global.status != 'REPORT_READY') {
    return res.status(404).send();
  }
  let filePath = path.join(config.outputDir, config.accessibilityAssessmentReportCsv);
  respondWithFile(filePath, res, next);
});

function respondWithFile(filePath, response, next) {
  let readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
    readStream.on('error', (err) => {
      let error = new Error(`Failed to read the report from file: ${filePath}. See details: ${err}`);
      error.status=500;
      return next(error);
    });
    response.on('error', (err) => {
      logger.log('ERROR', 'Error in write stream. Writing accessibility assessment report file failed with ' + err);
    });
}

const zipFileName = path.join(config.outputDir, 'report.zip')

router.get('/bundle', (req, res, next) => {

  if(global.status != 'REPORT_READY' ) {
    let err = new Error(`The report is not available.`)
    err.status=400
    return next(err)
  }

  var output = fs.createWriteStream(zipFileName);
  var pagesPath = path.join(config.pagesDirectory)
  var archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  let reportFilename = path.join(config.outputDir, config.accessibilityAssessmentReportHtml);
  archive.file(reportFilename, { name: config.accessibilityAssessmentReportHtml });
  let pagesDirectory = path.join(config.pagesDirectory);
  archive.directory(pagesDirectory, 'pages' );
  archive.finalize();

  output.on('close', function() {
    logger.log("INFO", `Report bundle of size ${archive.pointer()} has been created.`);
    readZip(res)
  });

  archive.on('error', function(err){
      logger.log("ERROR", "Archiver failed with: " + err)
  });
})

function readZip(res) {
  let readStream = fs.createReadStream(zipFileName);
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename="report.zip"')
    readStream.pipe(res);
    readStream.on('error', (err) => {
      logger.log('ERROR', 'Error reading accessibility assessment report file. Failed with ' + err);
      return res.sendStatus(500);
    });
    res.on('error', (err) => {
      logger.log('ERROR', 'Error in write stream. Writing accessibility assessment report file failed with ' + err);
    });
}

module.exports = router;
