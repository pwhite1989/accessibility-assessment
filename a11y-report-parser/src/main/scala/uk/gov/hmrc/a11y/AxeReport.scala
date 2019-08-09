package uk.gov.hmrc.a11y

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object AxeReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {
    val axeReport: String = s"$reportFolderPath/axe-report.json"
    val parsedReport: List[JsValue] = parseJsonFile(axeReport).as[List[JsValue]]
    val timeStamp: String = reportFolderPath.split("/").last


    val violationsList: List[JsValue] = parsedReport.flatMap(reports => (reports \ "violations").as[List[JsValue]])

    val violationAlerts: List[Violation] = violationsList.flatMap {
      t =>
        val nodes = (t \ "nodes").as[List[JsValue]]
        nodes.map { node =>
        val code = getJsValue(t, "id")
        val severity = getJsValue(node, "impact")
        val description = getJsValue(node, "failureSummary")
        val selector = getJsValue(node, "target")
        val snippet = getJsValue(node, "html")
        val helpUrl = getJsValue(t, "helpUrl")

        Violation("axe", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet, helpUrl)
        }
    }

    val inCompleteList: List[JsValue] = parsedReport.flatMap(report => (report \ "incomplete").as[List[JsValue]])

    val inCompleteAlerts: List[Violation] = inCompleteList.map {
      t =>
        val code = getJsValue(t, "id")
        val severity = getJsValue(t, "impact")
        val description = getJsValue(t, "description")
        val nodes = (t \ "nodes").as[List[JsValue]]
        val selector = getJsValue(nodes.head, "target")
        val snippet = getJsValue(nodes.head, "html")
        val helpUrl = getJsValue(t, "helpUrl")
        Violation("axe", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, JsString(s"Incomplete Alert: $description"), selector, snippet, helpUrl)
    }

    Output.writeOutput(violationAlerts ++ inCompleteAlerts)
  }
}
