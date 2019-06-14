package uk.gov.hmrc.a11y

import java.io.File

import play.api.libs.json.{JsValue, Json, OWrites}
import uk.gov.hmrc.a11y.AxeReport.{getValue, parseJsonFile}
import uk.gov.hmrc.a11y.ParseA11yReport.{outputFileWriter, testSuite}

object VnuReport {

  def apply(reportFolderPath: String, pageUrl: String, testRunTimeStamp: String): Unit = {

    val vnuReport: String = s"$reportFolderPath/vnu-report.json"
    val timeStamp: Long = reportFolderPath.split("/").last.toLong

    new File(vnuReport).length() match {
      case 0 => println(s"vnu report is empty for $vnuReport")
      case _ =>
        val alerts = (parseJsonFile(vnuReport) \ "messages").as[List[JsValue]].map{
          t =>
            val code = getValue(t, "code")
            val severity = getValue(t, "type")
            val description = getValue(t, "message")
            val selector = getValue(t, "selector")
            val snippet = getValue(t, "extract")

            Violation("vnu", testSuite, pageUrl, testRunTimeStamp, timeStamp, code, severity, description, selector, snippet)
        }
        implicit val reportWrites: OWrites[Violation] = Json.writes[Violation]
        alerts.foreach { v =>
          println(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
          outputFileWriter.write(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
        }
    }

  }

}
