package uk.gov.hmrc.a11y

import java.io.{File, FileWriter}

import play.api.libs.json.Json


object ParseA11yReport {

  val testSuite = "trusts-unique-pages"
  val USER_DIR: String = System.getProperty("user.dir")
  val PROJECT_DIR: String = new File(USER_DIR).getParent
  val testFolderPath = s"$PROJECT_DIR/pages/$testSuite"
  val reportFileName = s"report-${System.currentTimeMillis / 1000}"
  val fileWriter = new FileWriter(s"$USER_DIR/$reportFileName", true)
  val reportDirectories: List[String] = new File(testFolderPath).listFiles()
                                           .filter(_.isDirectory)
                                           .map(_.getName)
                                           .toList


  def main(args: Array[String]): Unit = {
    generateReport()
  }


  def generateReport(): Unit = {
    for (directory <- reportDirectories) {
      val reportFolderPath = s"$testFolderPath/$directory"
      AxeReport(reportFolderPath)
    }
    fileWriter.close()
  }

}




