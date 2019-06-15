package uk.gov.hmrc.a11y

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object AxeReport {

  def apply(reportFolderPath: String, testSuite: String, pageUrl: String, testRunTimeStamp: String): Unit = {
    val axeReport: String = s"$reportFolderPath/axe-report.json"
    val parsedReport: List[JsValue] = parseJsonFile(axeReport).as[List[JsValue]]
    val timeStamp: Long = reportFolderPath.split("/").last.toLong


    val violationsList: List[JsValue] = parsedReport.flatMap(reports => (reports \ "violations").as[List[JsValue]])

    val violationAlerts = violationsList.map {
      t =>
        val code = getJsValue(t, "id")
        val severity = getJsValue(t, "impact")
        val description = getJsValue(t, "description")
        val nodes = (t \ "nodes").as[List[JsValue]]
        val selector = getJsValue(nodes.head, "target")
        val snippet = getJsValue(nodes.head, "html")

        Violation("axe", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet)
    }

    val inCompleteList: List[JsValue] = parsedReport.flatMap(report => (report \ "incomplete").as[List[JsValue]])

    val inCompleteAlerts = inCompleteList.map {
      t =>
        val code = getJsValue(t, "id")
        val severity = getJsValue(t, "impact")
        val description = getJsValue(t, "description")
        val nodes = (t \ "nodes").as[List[JsValue]]
        val selector = getJsValue(nodes.head, "target")
        val snippet = getJsValue(nodes.head, "html")
        Violation("axe", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, JsString(s"Incomplete Alert: $description"), selector, snippet)
    }

    Output.writeOutput(violationAlerts ++ inCompleteAlerts)
  }
}
