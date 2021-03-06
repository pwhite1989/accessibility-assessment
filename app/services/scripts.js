const util = require('util');
const exec = util.promisify(require('child_process').exec)
const logger = require('../logger')
const config = require('../config')
const { applicationStatus } = require('./globals');

async function runScript(command) {
  let stderr = ''
  try {
    let { stdout, stderr } = await exec(command, {maxBuffer: 1024 * 4096})
  } catch(error) {
    logger.log('ERROR', `Failed to run script: ${error}`)
    applicationStatus('PAGE_ASSESSMENT_FAILED')
    return
  }
  if(stderr) {
    logger.log("ERROR", `Command \'${command}\' ran with the following errors: ${stderr}`);
    applicationStatus('PAGE_ASSESSMENT_FAILED')
    return
  }
}

module.exports.runAssessment = async () => {
  await runScript(`cd ${config.scriptDir} && ./run_assessment.sh ${config.rootDir} ${global.testSuite} ${global.buildUrl}`);
  await runScript(`cd ${config.scriptDir} && ./generate_report.sh ${config.rootDir}`);
  if(global.status == 'PAGE_ASSESSMENT_FAILED') {return}
  applicationStatus('REPORT_READY');
}
