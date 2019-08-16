package uk.gov.hmrc.a11y

import play.api.libs.json.{JsString, JsValue}

object AlertLevel {

  val alertMapping: Map[JsValue, JsValue] = Map(
    JsString("info") -> JsString("INFO"),
    JsString("warning") -> JsString("WARNING"),
    JsString("minor") -> JsString("ERROR"),
    JsString("moderate") -> JsString("ERROR"),
    JsString("serious") -> JsString("ERROR"),
    JsString("critical") -> JsString("ERROR"),
    JsString("error") -> JsString("ERROR")
  )

  def apply(impactType: JsValue): JsValue = {
    alertMapping(impactType)
  }

}