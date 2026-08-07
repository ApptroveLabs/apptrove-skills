const fs = require("fs-extra");
const path = require("path");
const addDeepLink = require("./deeplink/manifest-modifier");

/**
 * Ensure AndroidManifest permissions / deep link config.
 */
function configureManifest(context, options = {}) {
  const manifestPath = path.join(
    context.projectRoot,
    "app/src/main/AndroidManifest.xml"
  );

  if (!fs.existsSync(manifestPath)) {
    return {
      changed: false,
      message: "AndroidManifest.xml not found"
    };
  }

  return addDeepLink(manifestPath, options);
}

module.exports = configureManifest;
