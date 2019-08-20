package uk.gov.hmrc.a11y

import java.io.File
import java.nio.file.{Files, Paths}

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object AxeReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {
    val axeReport: String = s"$reportFolderPath/axe-report.json"
    val timeStamp: String = reportFolderPath.split("/").last

    if ( !Files.exists(Paths.get(axeReport)) || new File(axeReport).length() == 0 ) {
      println(s"MISSING FILE:\t$axeReport does not exist")
    } else {
      val parsedReport: List[JsValue] = parseJsonFile(axeReport).as[List[JsValue]]
      val violationsList: List[JsValue] = parsedReport.flatMap(reports => (reports \ "violations").as[List[JsValue]])

      val violationAlerts: List[Violation] = violationsList.flatMap {
        violation =>
          val nodes = (violation \ "nodes").as[List[JsValue]]
          nodes.map { node =>
            val code = getJsValue(violation, "id")
            val severity = getJsValue(node, "impact")
            val alertLevel = AlertLevel(getJsValue(node, "impact"))
            val description = JsString(getJsValue(node, "failureSummary").toString().replaceAll("\\\\[nrt]|\\\"", ""))
            val selector = getJsValue(node, "target")
            val snippet = getJsValue(node, "html")
            val helpUrl = getJsValue(violation, "helpUrl")

            Violation("axe", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, alertLevel, description, selector,
              snippet, helpUrl)
          }
      }

      val inCompleteList: List[JsValue] = parsedReport.flatMap(report => (report \ "incomplete").as[List[JsValue]])
      val inCompleteAlerts: List[Violation] = inCompleteList.flatMap {
        violation =>
          val nodes = (violation \ "nodes").as[List[JsValue]]
          nodes.map { node =>
            val code = getJsValue(violation, "id")
            val severity = getJsValue(node, "impact")
            val alertLevel = AlertLevel(getJsValue(node, "impact"))
            val description = getJsValue(violation, "description")
            val selector = getJsValue(node, "target")
            val snippet = getJsValue(node, "html")
            val helpUrl = getJsValue(violation, "helpUrl")

            Violation("axe", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, alertLevel,
              JsString(s"Incomplete Alert: $description"), selector, snippet, helpUrl)
          }
      }
      Output.writeOutput(violationAlerts ++ inCompleteAlerts)
    }
  }
}
