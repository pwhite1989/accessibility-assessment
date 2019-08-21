package uk.gov.hmrc.a11y

import java.io.File
import java.nio.file.{Files, Paths}

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object Pa11yReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val pa11yReport: String = s"$reportFolderPath/pa11y-report.json"
    val timeStamp: String = reportFolderPath.split("/").last
    val Wcag2ReferenceUrl = "http://squizlabs.github.io/HTML_CodeSniffer/Standards/WCAG2/#"

    if ( !Files.exists(Paths.get(pa11yReport)) || new File(pa11yReport).length() == 0 ) {
      println(s"MISSING FILE:\t$pa11yReport does not exist")
    } else {
        val alerts: List[Violation] = parseJsonFile(pa11yReport).as[List[JsValue]].map {
          violation =>
            val code = getJsValue(violation, "code")
            val severity = JsString("Unassigned")
            val alertLevel = AlertLevel(getJsValue(violation, "type"))
            val description = JsString(getJsValue(violation, "message").toString().replaceAll("\\\\[nrt]|\\\"", ""))
            val selector = getJsValue(violation, "selector")
            val snippet = getJsValue(violation, "context")
            val helpUrl = JsString(Wcag2ReferenceUrl)

            Violation("pa11y", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, alertLevel,
              description, selector, snippet, helpUrl)
        }
        Output.writeOutput(alerts)
    }
  }
}
