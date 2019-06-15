package uk.gov.hmrc.a11y

import play.api.libs.json.{Json, OWrites}
import uk.gov.hmrc.a11y.ParseA11yReport.outputFileWriter

object Output {

  def writeOutput(violationsList: List[Violation]): Unit = {
    implicit val reportWrites: OWrites[Violation] = Json.writes[Violation]
    violationsList.foreach { v =>
      println(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
      outputFileWriter.write(s"""{"index":{"_index":"accessibility","_type":"alerts"}}\n${Json.toJson(v).toString()}\n""")
    }
  }

}
