package uk.gov.hmrc.a11y

import java.io.FileInputStream
import java.text.SimpleDateFormat

import play.api.libs.json.{JsValue, Json, OWrites}
import uk.gov.hmrc.a11y.ParseA11yReport.{fileWriter, reportDirectories, testSuite}

import scala.io.Source

object AxeReport {

  def apply(reportFolderPath: String): Unit = {
    val axeReport: String = s"$reportFolderPath/axe-report.json"
    val url: String = pageUrl(reportFolderPath)
    val parsedReport: List[JsValue] = parseJsonFile(axeReport)
    val timeStamp: Long = reportFolderPath.split("/").last.toLong


    val violationsList: List[JsValue] = parsedReport.flatMap(reports => (reports \ "violations").as[List[JsValue]])

    val violationAlerts = violationsList.map {
      t =>
        val code = getValue(t, "id")
        val severity = getValue(t, "impact")
        val description = getValue(t, "description")
        val nodes = (t \ "nodes").as[List[JsValue]]
        val selector = getValue(nodes.head, "target")
        val snippet = getValue(nodes.head, "html")

        Violation("axe", testSuite, url, testTimeStamp, timeStamp, code, severity, description, selector, snippet)
    }

    val inCompleteList: List[JsValue] = parsedReport.flatMap(report => (report \ "incomplete").as[List[JsValue]])

    val inCompleteAlerts = inCompleteList.map {
      t =>
        val code = getValue(t, "id")
        val severity = getValue(t, "impact")
        val description = getValue(t, "message")
        val selector = getValue(t, "data")
        val snippet = getValue(t, "html")
        Violation("axe", testSuite, url, testTimeStamp, timeStamp, code, severity, s"Incomplete Alert: $description", selector, snippet)
    }

    val alerts = violationAlerts ++ inCompleteAlerts

    implicit val reportWrites: OWrites[Violation] = Json.writes[Violation]
    alerts.foreach { v =>
//      println(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
      fileWriter.write(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
    }

  }

  def testTimeStamp: String = {
    val firstTestTimeStamp = reportDirectories.map(_.toLong).sortWith(_ < _).head
    new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(firstTestTimeStamp)
  }

  def pageUrl(reportFolderPath: String): String = {
    val fileData = s"$reportFolderPath/data"
    val bufferedSource = Source.fromFile(fileData)
    val url = bufferedSource.getLines().take(1).toList.head
    bufferedSource.close
    url
  }

  def parseJsonFile(reportPath: String): List[JsValue] = {
    val stream = new FileInputStream(reportPath)
    try {
      Json.parse(stream).as[List[JsValue]]
    } finally {
      stream.close()
    }
  }

  def getValue(json: JsValue, field: String): String = {

    (json \ field).toEither match {
      case Left(s) => "UNDEFINED"
      case Right(value) => value.toString()
    }
  }

}
