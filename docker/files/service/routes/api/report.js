const router = require('express').Router();
const path = require('path')
const fs = require('fs')
const config = require('../../config/config')
const logger = require('../../logger');
const archiver = require('archiver')
const { exec }  = require('child_process');
const status = require('../../service/status')

const reportPath = path.join(config.outputDir, config.accessibility_assessment_report)
const pagesPath = path.join(config.pagesDirectory)

router.post('/run-assessment', (req, res) => {
  status("ASSESSING_PAGES")
  exec('cd /home/seluser && ./run_assessment.sh', (err, stdout, stderr) => {
    if (err) {
      logger.log("ERROR", err)
    } else {
     status("ASSESSMENT_COMPLETE")
    }
  });
  res.status(200).send("Assessment Triggered")
})

router.post('/generate', (req, res) => {
  status("GENERATING_REPORT")
  exec('cd /home/seluser && ./generate_report.sh', (err, stdout, stderr) => {
    if (err) {
      logger.log("ERROR", err)
    } else {
     status("REPORT_READY")
    }
  });
  res.status(200).send("Generating report")
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

router.get('/bundle', (req, res) => {
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
