const fs = require("fs-extra");
const path = require("path");
const constants = require("../constants");

const DEPS = [
  constants.android.dependency,
  constants.android.installReferrer,
  constants.android.adsIdentifier
];

/**
 * Add AppTrove Android SDK + required companion deps to app/build.gradle(.kts)
 */
function addApptroveDependency(context) {
  const projectPath = context.projectRoot;
  const groovy = path.join(projectPath, "app/build.gradle");
  const kts = path.join(projectPath, "app/build.gradle.kts");

  let gradleFile = null;
  let isKts = false;

  if (fs.existsSync(kts)) {
    gradleFile = kts;
    isKts = true;
  } else if (fs.existsSync(groovy)) {
    gradleFile = groovy;
  }

  if (!gradleFile) {
    return {
      changed: false,
      message: "app/build.gradle(.kts) not found"
    };
  }

  let content = fs.readFileSync(gradleFile, "utf8");

  if (
    content.includes("com.apptrove:android-sdk") ||
    content.includes("com.apptrove:sdk")
  ) {
    // Upgrade legacy wrong coordinate if present
    if (
      content.includes("com.apptrove:sdk") &&
      !content.includes("com.apptrove:android-sdk")
    ) {
      content = content.replace(
        /implementation\s*[\("']com\.apptrove:sdk:[^"')]+["')]/g,
        isKts
          ? 'implementation("com.apptrove:android-sdk:2.0.1")'
          : 'implementation "com.apptrove:android-sdk:2.0.1"'
      );
      fs.writeFileSync(gradleFile, content);
      return {
        changed: true,
        message: "Updated Apptrove dependency to com.apptrove:android-sdk:2.0.1"
      };
    }

    return {
      changed: false,
      message: "Apptrove SDK dependency already exists"
    };
  }

  const lines = DEPS.map((line) => {
    if (!isKts) return `    ${line}`;
    // Convert groovy-style to kts
    const match = line.match(/implementation\s+"([^"]+)"/);
    if (match) return `    implementation("${match[1]}")`;
    return `    ${line}`;
  }).join("\n");

  if (!/dependencies\s*\{/.test(content)) {
    content += `\n\ndependencies {\n${lines}\n}\n`;
  } else {
    content = content.replace(
      /dependencies\s*\{/,
      `dependencies {\n${lines}\n`
    );
  }

  fs.writeFileSync(gradleFile, content);

  return {
    changed: true,
    message: "Apptrove SDK dependencies added (android-sdk, installreferrer, ads-identifier)"
  };
}

module.exports = addApptroveDependency;
