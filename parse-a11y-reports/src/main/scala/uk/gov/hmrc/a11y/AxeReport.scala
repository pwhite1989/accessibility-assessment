package uk.gov.hmrc.a11y

import java.io.FileInputStream

import play.api.libs.json.{JsValue, Json, OWrites}
import uk.gov.hmrc.a11y.ParseA11yReport.{outputFileWriter, testSuite}

object AxeReport {

  def apply(reportFolderPath: String, pageUrl: String, testRunTimeStamp: String): Unit = {
    val axeReport: String = s"$reportFolderPath/axe-report.json"
    val parsedReport: List[JsValue] = parseJsonFile(axeReport).as[List[JsValue]]
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

        Violation("axe", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet)
    }

    val inCompleteList: List[JsValue] = parsedReport.flatMap(report => (report \ "incomplete").as[List[JsValue]])

    val inCompleteAlerts = inCompleteList.map {
      t =>
        val code = getValue(t, "id")
        val severity = getValue(t, "impact")
        val description = getValue(t, "message")
        val selector = getValue(t, "data")
        val snippet = getValue(t, "html")
        Violation("axe", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, s"Incomplete Alert: $description", selector, snippet)
    }

    val alerts = violationAlerts ++ inCompleteAlerts

    implicit val reportWrites: OWrites[Violation] = Json.writes[Violation]
    alerts.foreach { v =>
      println(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
      outputFileWriter.write(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
    }

  }

  def parseJsonFile(reportPath: String): JsValue = {
    val stream = new FileInputStream(reportPath)
    try {
      Json.parse(stream)
    }
    finally {
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
