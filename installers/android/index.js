const addApptroveDependency = require("../../core/modifier/gradle-modifier");
const scanApplication = require("../../core/analyzer/application-scanner");
const injectApptrove = require("./application-modifier");
const installDeepLink = require("./deeplink");
const InstallResult = require("../../core/context/install-result");

/**
 * Full Android AppTrove SDK installer.
 * @param {object} context
 * @param {{ sdkKey?: string, env?: string, sdkSecretId?: string, sdkSecretKey?: string, deepLinkHost?: string }} [options]
 */
function install(context, options = {}) {
  console.log("\nInstalling Android AppTrove SDK...\n");

  const result = new InstallResult("android");

  if (context.matched === false) {
    result.add("project", {
      changed: false,
      message: context.hint || "Android project not detected"
    });
    result.success = false;
    return result;
  }

  const dependency = addApptroveDependency(context);
  result.add("dependency", dependency);

  const application = scanApplication(context);
  result.add("application", application);

  if (application.found && application.path) {
    const init = injectApptrove(application.path, {
      sdkKey: options.sdkKey,
      env: options.env,
      sdkSecretId: options.sdkSecretId,
      sdkSecretKey: options.sdkSecretKey
    });
    result.add("initialization", init);
  } else {
    result.add("initialization", {
      changed: false,
      message:
        application.message ||
        "Skipped — create an Application class, register it in the manifest, then re-run"
    });
  }

  const deepLink = installDeepLink(context.projectRoot, {
    host: options.deepLinkHost
  });
  result.add("deepLink", deepLink);

  result.nextSteps = [
    `Replace ${options.sdkKey || "YOUR_APP_TOKEN"} with your AppTrove app token`,
    "Replace YOUR_SUBDOMAIN.u9ilnk.me with your UniLink domain",
    "Call AppTroveSDK.parseDeepLink(uri) in the activity that receives the deep link",
    "Optional: sdkConfig.setDeepLinkListener(...) for deferred deep links",
    "Optional: AppTroveSDK.sendFcmToken(token) after obtaining an FCM token"
  ];

  return result;
}

module.exports = install;
