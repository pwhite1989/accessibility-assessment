package uk.gov.hmrc.a11y

import java.io.{File, FileWriter}
import java.text.SimpleDateFormat

import play.api.libs.json.Json

import scala.io.Source

object ParseA11yReport {

  val testSuite = "trusts-unique-pages"
  val USER_DIR: String = System.getProperty("user.dir")
  val PROJECT_DIR: String = new File(USER_DIR).getParent
  val testFolderPath = s"$PROJECT_DIR/pages/$testSuite"
  val reportFileName = s"report-${System.currentTimeMillis / 1000}"
  val outputFileWriter = new FileWriter(s"$USER_DIR/$reportFileName", true)
  val reportDirectories: List[String] = new File(testFolderPath).listFiles()
    .filter(_.isDirectory)
    .map(_.getName)
    .toList

  def testRunTimeStamp: String = {
    val firstTestTimeStamp = reportDirectories.map(_.toLong).sortWith(_ < _).head
    new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(firstTestTimeStamp)
  }

  def main(args: Array[String]): Unit = {
    println("********** Generating A11Y report ***********")
    generateReport()
    println("********** Completed ***********")
  }

  def generateReport(): Unit = {
    for (directory <- reportDirectories) {
      val reportFolderPath = s"$testFolderPath/$directory"
      println("********** Generating AXE REPORT ***********")
      AxeReport(reportFolderPath, pageUrl(reportFolderPath), testRunTimeStamp)

      println("********** Generating PA11Y REPORT ***********")
      Pa11yReport(reportFolderPath, pageUrl(reportFolderPath), testRunTimeStamp)

      println("********** Generating VNU REPORT ***********")
      VnuReport(reportFolderPath, pageUrl(reportFolderPath), testRunTimeStamp)
    }
    outputFileWriter.close()
  }

  private def pageUrl(reportFolderPath: String): String = {
    val fileData = s"$reportFolderPath/data"
    val bufferedSource = Source.fromFile(fileData)
    val url = bufferedSource.getLines().take(1).toList.head
    bufferedSource.close
    url
  }

}




