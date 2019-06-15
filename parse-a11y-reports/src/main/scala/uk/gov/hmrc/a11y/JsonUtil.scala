package uk.gov.hmrc.a11y

import java.io.FileInputStream

import play.api.libs.json.{JsString, JsValue, Json}

object JsonUtil {

  def parseJsonFile(reportPath: String): JsValue = {
    val stream = new FileInputStream(reportPath)
    try {
      Json.parse(stream)
    }
    finally {
      stream.close()
    }
  }

  def getJsValue(json: JsValue, field: String): JsValue = {

    (json \ field).toEither match {
      case Left(s) => JsString("UNDEFINED")
      case Right(value) => value
    }
  }

}
