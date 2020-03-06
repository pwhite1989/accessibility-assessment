const router = require('express').Router();
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const config = require('../config')
const logger = require('../logger');
const { applicationStatus } = require('../service/globals')
const { runAssessment } = require('../service/scripts')

router.post('/run-assessment', (req, res) => {
  applicationStatus("ASSESSING_PAGES");
  runAssessment();
  res.status(202).json({message: "Page assessment triggered."}).send();
})

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

function respondWithFile(filePath, response, next) {
  let readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
    readStream.on('error', (err) => {
      let error = new Error(`Failed to read the report from file: ${filePath}. See details: ${err}`);
      error.status=500;
      next(error);
    });
    response.on('error', (err) => {
      logger.log('ERROR', 'Error in write stream. Writing accessibility assessment report file failed with ' + err);
    });
}

const zipFileName = path.join(config.outputDir, 'report.zip')

router.get('/bundle', (req, res) => {
  var output = fs.createWriteStream(zipFileName);
  var pagesPath = path.join(config.pagesDirectory)
  var archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.pipe(output);
  archive.file(reportPath, { name: config.accessibility_ssessment_report });
  archive.directory(pagesPath, { name: 'pages' });
  archive.finalize();

  output.on('close', function() {
    logger.log("INFO", archive.pointer() + ' total bytes');
    logger.log("INFO", 'archiver has been finalized and the output file descriptor has closed.');
    readZip(res)
  });

  archive.on('error', function(err){
      logger.log("ERROR", "Archiver failed with: " + err)
  });
})

function readZip(res) {
  let readStream = fs.createReadStream(zipFileName);
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename="' + zipFileName + '"')
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
