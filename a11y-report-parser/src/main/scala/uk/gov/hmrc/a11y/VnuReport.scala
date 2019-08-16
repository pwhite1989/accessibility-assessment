package uk.gov.hmrc.a11y

import java.io.File

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object VnuReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val vnuReport: String = s"$reportFolderPath/vnu-report.json"
    val timeStamp: String = reportFolderPath.split("/").last

    new File(vnuReport).length() match {
      case 0 => println(s"\t- $vnuReport does not exist")
      case _ =>
        val alerts: List[Violation] = (parseJsonFile(vnuReport) \ "messages").as[List[JsValue]].map {
          t =>
            val code = getJsValue(t, "message")  //as vnu reports don't output the concept of an alert type or code, we use the message.
            val severity = getJsValue(t, "type")
            val description = JsString(getJsValue(t, "message").toString().replaceAll("\\\\[nrt]|\\\"", ""))
            val selector = getJsValue(t, "selector")
            val snippet = getJsValue(t, "extract")
            val helpUrl = JsString("")
            Violation("vnu", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet, helpUrl)
        }
        Output.writeOutput(alerts)
    }

  }

}
