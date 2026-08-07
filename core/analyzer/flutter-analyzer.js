const fs = require("fs-extra");
const path = require("path");

function analyzeFlutter(projectRoot = process.cwd()) {
  const pubspecPath = path.join(projectRoot, "pubspec.yaml");
  if (!fs.existsSync(pubspecPath)) {
    return { flutterProject: false, projectPath: projectRoot };
  }

  const content = fs.readFileSync(pubspecPath, "utf8");
  const flutterProject =
    content.includes("flutter:") || content.includes("sdk: flutter");

  return {
    platform: "flutter",
    flutterProject,
    pubspecPath,
    hasApptrove: content.includes("apptrove_sdk_flutter"),
    projectPath: projectRoot
  };
}

module.exports = analyzeFlutter;
