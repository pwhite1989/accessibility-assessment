package uk.gov.hmrc.a11y

import java.io.File

import play.api.libs.json.{JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object Pa11yReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val pa11yReport: String = s"$reportFolderPath/pa11y-report.json"
    val timeStamp: String = reportFolderPath.split("/").last

    new File(pa11yReport).length() match {
      case 0 => println(s"\t- ${pa11yReport} does not exist")
      case _ =>
        val alerts: List[Violation] = parseJsonFile(pa11yReport).as[List[JsValue]].map {
          t =>
            val code = getJsValue(t, "code")
            val severity = getJsValue(t, "type")
            val description = getJsValue(t, "message")
            val selector = getJsValue(t, "selector")
            val snippet = getJsValue(t, "context")

            Violation("pa11y", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet)
        }
        Output.writeOutput(alerts)
    }
  }
}