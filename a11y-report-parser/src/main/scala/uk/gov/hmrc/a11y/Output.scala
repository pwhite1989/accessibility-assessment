package uk.gov.hmrc.a11y

import java.io.FileWriter

import play.api.libs.json.{Json, OWrites}
import uk.gov.hmrc.a11y.ReportParser.currentDirectoryPath

object Output {

  val reportFileName = s"bulk-upload-${System.currentTimeMillis / 1000}"
  val outputFileWriter = new FileWriter(s"$currentDirectoryPath/$reportFileName", true)

  def writeOutput(violationsList: List[Violation]): Unit = {
    implicit val reportWrites: OWrites[Violation] = Json.writes[Violation]
    violationsList.foreach { v =>
      //println(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
      outputFileWriter.write(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
    }
  }

  def closeFileWriter(): String = {
    outputFileWriter.close()
    reportFileName
  }
}
