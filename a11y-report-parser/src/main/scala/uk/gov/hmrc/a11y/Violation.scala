package uk.gov.hmrc.a11y

import play.api.libs.json.JsValue

case class Violation(tool: String, testSuite: String, path: String, capturedPage: String, testRun: String, timeStamp: String, code: JsValue, severity: JsValue,
                     description: JsValue, selector: JsValue, snippet: JsValue, helpUrl: JsValue)