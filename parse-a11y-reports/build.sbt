val appName = "parse-a11y-reports"

version := "0.1"

scalaVersion := "2.11.12"


resolvers += "Typesafe Repo" at "http://repo.typesafe.com/typesafe/releases/"

val compileDependencies = Seq(
  "com.typesafe.play" %% "play-json" % "2.6.13"
)

// set the main class
mainClass in (Compile, packageBin) := Some("uk.gov.hmrc.a11y.ParseA11yReport")

lazy val parseA11YReports = Project(appName, file("."))
  .settings(
    scalaVersion := "2.11.12",
    libraryDependencies ++= compileDependencies,
    crossScalaVersions := Seq("2.11.12"),
    resolvers += Resolver.bintrayRepo("hmrc", "releases")
  )