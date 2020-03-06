const router = require('express').Router();
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const config = require('../config')
const logger = require('../logger');
const { applicationStatus } = require('../service/status')
const { runAssessment } = require('../service/scripts')

const reportPath = path.join(config.outputDir, config.accessibility_assessment_report)
const pagesPath = path.join(config.pagesDirectory)

router.post('/run-assessment', (req, res) => {
  applicationStatus("ASSESSING_PAGES");
  runAssessment();
  res.status(202).json({message: "Page assessment triggered."}).send();
})

router.get('/html-report', (req, res) => {
  let readStream = fs.createReadStream(reportPath);
    readStream.pipe(res);
    readStream.on('error', (err) => {
      logger.log('ERROR', 'Error reading accessibility assessment report file. Failed with ' + err);
      return res.sendStatus(500);
    });
    res.on('error', (err) => {
      logger.log('ERROR', 'Error in write stream. Writing accessibility assessment report file failed with ' + err);
    });
})

const zipFileName = path.join(config.outputDir, 'report.zip')

router.get('/report-bundle', (req, res) => {
  var output = fs.createWriteStream(zipFileName);
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
