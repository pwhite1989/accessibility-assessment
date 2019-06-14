package uk.gov.hmrc.a11y

case class Violation(tool: String, testSuite: String, path: String, testRun: String, timeStamp: Long, code: String, severity: String,
                     description: String, selector: String, snippet: String)
