package uk.gov.hmrc.a11y

import java.io.File
import java.nio.file.{Files, Paths}

import play.api.libs.json.{JsString, JsValue, Json}
import uk.gov.hmrc.a11y.JsonUtil._

object VnuReport {

  def apply(reportFolderPath: String, testSuite: String, path: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val vnuReport: String = s"$reportFolderPath/vnu-report.json"
    val timeStamp: String = reportFolderPath.split("/").last

    if ( !Files.exists(Paths.get(vnuReport)) || new File(vnuReport).length() == 0 ) {
      println(s"MISSING FILE:\t$vnuReport does not exist")
    } else {
      val alerts: List[Violation] = (parseJsonFile(vnuReport) \ "messages").as[List[JsValue]].map {
        violation =>
          val code = getJsValue(violation, "message")  //as vnu reports don't output the concept of an alert type or code, we use the message.
          val severity = getJsValue(violation, "type")
          val alertLevel = AlertLevel(getJsValue(violation, "type"))
          val description = JsString(getJsValue(violation, "message").toString().replaceAll("\\\\[nrt]|\\\"", ""))
          val selector = getJsValue(violation, "selector")
          val snippet = getJsValue(violation, "extract")
          val helpUrl = JsString("Not Available")
          Violation("vnu", testSuite, path, pageUrl, testRunTimeStamp, timeStamp, code, severity, alertLevel, description,
            selector, snippet, helpUrl)
      }
      Output.writeOutput(alerts)
    }
  }

}
