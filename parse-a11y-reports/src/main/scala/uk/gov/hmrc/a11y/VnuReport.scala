package uk.gov.hmrc.a11y

import java.io.File

import play.api.libs.json.{JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object VnuReport {

  def apply(reportFolderPath: String, testSuite: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val vnuReport: String = s"$reportFolderPath/vnu-report.json"
    val timeStamp: Long = reportFolderPath.split("/").last.toLong

    new File(vnuReport).length() match {
      case 0 => println(s"vnu report is empty for $vnuReport")
      case _ =>
        val alerts = (parseJsonFile(vnuReport) \ "messages").as[List[JsValue]].map {
          t =>
            val code = getJsValue(t, "code")
            val severity = getJsValue(t, "type")
            val description = getJsValue(t, "message")
            val selector = getJsValue(t, "selector")
            val snippet = getJsValue(t, "extract")

            Violation("vnu", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet)
        }
        Output.writeOutput(alerts)
    }

  }

}
