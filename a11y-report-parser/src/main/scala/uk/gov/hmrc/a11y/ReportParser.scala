package uk.gov.hmrc.a11y

import java.io.File
import java.text.SimpleDateFormat

import play.api.libs.json.Json

import scala.io.Source

object ReportParser {

  val currentDirectoryPath: String = System.getProperty("user.dir")
  val rootDirectoryPath: String = new File(currentDirectoryPath).getParent

  def main(args: Array[String]): Unit = {
    println("********** Generating alert report ***********")
    val fileName: String = generateReport()
    println("******************** Done ********************")
    println(s"see ${fileName}")
  }

  def generateReport(): String = {

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

        reportDirectoriesPath.foreach {
          reportDirectoryPath =>
            println(s"Parsing: ${reportDirectoryPath}")
            AxeReport(reportDirectoryPath, testSuiteName, path(reportDirectoryPath), page(reportDirectoryPath), testRunTimeStamp)
            Pa11yReport(reportDirectoryPath, testSuiteName, path(reportDirectoryPath), page(reportDirectoryPath), testRunTimeStamp)
            VnuReport(reportDirectoryPath, testSuiteName, path(reportDirectoryPath), page(reportDirectoryPath), testRunTimeStamp)
        }
    }
    Output.closeFileWriter()
  }

  private def path(reportFolderPath: String): String = {
    val bufferedSource = Source.fromFile(s"$reportFolderPath/data")
    val url = bufferedSource.getLines().take(1).toList.head
    val pattern = "http:\\/\\/localhost:[0-9]{4,5}(.*)".r
    val pattern(path) = url
    bufferedSource.close
    path
  }

  private def page(reportDirectoryPath: String): String = {
    val pattern = ".*(pages)(.*)".r
    val pattern(parent, subPath) = reportDirectoryPath
    s"http://localhost:6002${subPath}/index.html"
  }
}