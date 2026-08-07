const scanApplication = require("../../core/analyzer/application-scanner");
const injectApptrove = require("./application-modifier");

/**
 * Locate Application class and inject AppTrove init.
 */
function configureApplication(context, options = {}) {
  const scan = scanApplication(context);
  if (!scan.found || !scan.path) {
    return {
      changed: false,
      message: scan.message
    };
  }
  return injectApptrove(scan.path, options);
}

module.exports = configureApplication;
