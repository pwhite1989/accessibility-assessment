package uk.gov.hmrc.a11y

import java.io.File
import java.text.SimpleDateFormat

import play.api.libs.json.Json

import scala.io.Source

object ParseA11yReport {

  val currentDirectoryPath: String = System.getProperty("user.dir")
  val rootDirectoryPath: String = new File(currentDirectoryPath).getParent

  def main(args: Array[String]): Unit = {
    println("********** Generating A11Y report ***********")
    generateReport()
    println("********** Completed ***********")
  }

  def generateReport(): Unit = {

    // Path of all directories under page-capture-spike/pages.
    // example: page-capture-spike/pages/trusts-unique-pages
    val testDirectoriesPath: Array[String] = new File(s"$rootDirectoryPath/pages").listFiles()
      .filter(_.isDirectory)
      .map(s"$rootDirectoryPath/pages/" + _.getName)

    testDirectoriesPath.foreach {
      testDirectoryPath =>
        val testSuiteName = testDirectoryPath.split("/").last

        // Path of directories under each test Directory which contain a11y reports for every page of that test suite.
        // example: page-capture-spike/pages/trusts-unique-pages/1560332773877
        val reportDirectoriesPath: Array[String] = new File(testDirectoryPath).listFiles()
          .filter(_.isDirectory)
          .map(s"$testDirectoryPath/" + _.getName)

        //The earliest report's timestamp, stored as the report directory name, is used as the value of 'TestRun' Json field in the output
        val earliestTimeStamp: Long = reportDirectoriesPath.map(_.split("/").last.toLong).sortWith(_ < _).head
        val testRunTimeStamp: String = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(earliestTimeStamp)

        //For each report directory i.e page-capture-spike/pages/trusts-unique-pages/1560332773877
        // axe-report.json, pa11y-report.json, vnu-report.json is parsed.
        reportDirectoriesPath.foreach {
          reportDirectoryPath =>
            println("********** Generating AXE REPORT ***********")
            AxeReport(reportDirectoryPath, testSuiteName, pageUrl(reportDirectoryPath), testRunTimeStamp)

            println("********** Generating PA11Y REPORT ***********")
            Pa11yReport(reportDirectoryPath, testSuiteName, pageUrl(reportDirectoryPath), testRunTimeStamp)

            println("********** Generating VNU REPORT ***********")
            VnuReport(reportDirectoryPath, testSuiteName, pageUrl(reportDirectoryPath), testRunTimeStamp)
        }
    }
    Output.closeFileWriter()
  }

  private def pageUrl(reportFolderPath: String): String = {
    val fileData = s"$reportFolderPath/data"
    val bufferedSource = Source.fromFile(fileData)
    val url = bufferedSource.getLines().take(1).toList.head
    bufferedSource.close
    url
  }

}




