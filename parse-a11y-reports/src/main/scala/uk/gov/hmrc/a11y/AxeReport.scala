package uk.gov.hmrc.a11y

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._
import uk.gov.hmrc.a11y.ParseA11yReport.testSuite

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
        val description = getValue(t, "description")
        val nodes = (t \ "nodes").as[List[JsValue]]
        val selector = getValue(nodes.head, "target")
        val snippet = getValue(nodes.head, "html")
        Violation("axe", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, JsString(s"Incomplete Alert: $description"), selector, snippet)
    }

    Output.writeOutput(violationAlerts ++ inCompleteAlerts)
  }
}
