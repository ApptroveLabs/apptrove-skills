const fs = require("fs-extra");
const path = require("path");
const modifyManifest = require("./manifest-modifier");
const validate = require("./validator");

function installDeepLink(projectPath, options = {}) {
  const candidates = [
    "app/src/main/AndroidManifest.xml",
    "app/AndroidManifest.xml"
  ];

  let manifest = null;
  for (const rel of candidates) {
    const fullPath = path.join(projectPath, rel);
    if (fs.existsSync(fullPath)) {
      manifest = fullPath;
      break;
    }
  }

  if (!manifest) {
    return {
      changed: false,
      message: "Manifest not found"
    };
  }

  const result = modifyManifest(manifest, options);
  const validation = result.validation || validate(manifest);

  return {
    ...result,
    validation
  };
}

module.exports = installDeepLink;
