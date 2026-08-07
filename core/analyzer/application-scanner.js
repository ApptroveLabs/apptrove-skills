const fs = require("fs-extra");
const path = require("path");

/**
 * Find the Android Application class from the manifest android:name attribute.
 * @param {object} context
 * @returns {{ found: boolean, path?: string, className?: string, message: string }}
 */
function scanApplication(context) {
  const projectPath = context.projectRoot;
  const manifestPath = path.join(
    projectPath,
    "app/src/main/AndroidManifest.xml"
  );

  if (!fs.existsSync(manifestPath)) {
    return {
      found: false,
      message: "AndroidManifest.xml not found"
    };
  }

  const manifest = fs.readFileSync(manifestPath, "utf8");
  const nameMatch = manifest.match(
    /<application[^>]*android:name\s*=\s*"([^"]+)"/
  );

  if (!nameMatch) {
    return {
      found: false,
      manifestPath,
      message:
        "No android:name on <application>. Create an Application class and register it in the manifest."
    };
  }

  let className = nameMatch[1];
  // .MainApplication → MainApplication
  if (className.startsWith(".")) {
    className = className.slice(1);
  }
  // Fully qualified → take last segment for file search
  const simpleName = className.includes(".")
    ? className.split(".").pop()
    : className;

  const searchRoots = [
    path.join(projectPath, "app/src/main/java"),
    path.join(projectPath, "app/src/main/kotlin")
  ];

  for (const root of searchRoots) {
    if (!fs.existsSync(root)) continue;
    const found = findFileByName(root, simpleName);
    if (found) {
      return {
        found: true,
        path: found,
        className: simpleName,
        manifestPath,
        message: `Application class found: ${found}`
      };
    }
  }

  return {
    found: false,
    className: simpleName,
    manifestPath,
    message: `Application class ${simpleName} declared in manifest but source file not found`
  };
}

function findFileByName(dir, baseName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = findFileByName(full, baseName);
      if (nested) return nested;
    } else if (
      entry.name === `${baseName}.kt` ||
      entry.name === `${baseName}.java`
    ) {
      return full;
    }
  }
  return null;
}

module.exports = scanApplication;
