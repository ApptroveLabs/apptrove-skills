const fs = require("fs-extra");
const path = require("path");

/**
 * Analyze an Android project at the given root.
 * @param {string} projectRoot
 */
function analyzeAndroidProject(projectRoot = process.cwd()) {
  const filesToCheck = [
    "settings.gradle",
    "settings.gradle.kts",
    "build.gradle",
    "build.gradle.kts",
    "app/build.gradle",
    "app/build.gradle.kts",
    "app/src/main/AndroidManifest.xml"
  ];

  const report = {
    projectPath: projectRoot,
    androidProject: false,
    files: {},
    gradleFile: null,
    manifestFile: null,
    isKotlinDsl: false
  };

  filesToCheck.forEach((file) => {
    report.files[file] = fs.existsSync(path.join(projectRoot, file));
  });

  if (report.files["app/build.gradle.kts"]) {
    report.gradleFile = path.join(projectRoot, "app/build.gradle.kts");
    report.isKotlinDsl = true;
    report.androidProject = true;
  } else if (report.files["app/build.gradle"]) {
    report.gradleFile = path.join(projectRoot, "app/build.gradle");
    report.androidProject = true;
  }

  if (report.files["app/src/main/AndroidManifest.xml"]) {
    report.manifestFile = path.join(
      projectRoot,
      "app/src/main/AndroidManifest.xml"
    );
  }

  return report;
}

module.exports = analyzeAndroidProject;
