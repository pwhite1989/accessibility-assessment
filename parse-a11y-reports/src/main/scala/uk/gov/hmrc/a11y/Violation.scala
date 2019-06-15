package uk.gov.hmrc.a11y

import play.api.libs.json.JsValue

case class Violation(tool: String, testSuite: String, path: String, testRun: String, timeStamp: Long, code: JsValue, severity: JsValue,
                     description: JsValue, selector: JsValue, snippet: JsValue)