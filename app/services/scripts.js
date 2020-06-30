const util = require('util');
const exec = util.promisify(require('child_process').exec)
const logger = require('../logger')
const config = require('../config')
const { generateHtmlReport } = require('./htmlReport')
const { applicationStatus } = require('./globals');

async function runScript(command) {
  let stderr = ''
  try {
    let { stdout, stderr } = await exec(command)
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
  applicationStatus("ASSESSING_PAGES");
  await runScript(`cd ${config.scriptDir} && ./run_assessment.sh ${config.rootDir} ${global.testSuite} ${global.buildUrl}`);
  generateHtmlReport();
  if(global.status == 'PAGE_ASSESSMENT_FAILED') {return}
}
