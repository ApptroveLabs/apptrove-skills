const fs = require("fs-extra");
const path = require("path");
const constants = require("../../core/constants");
const InstallResult = require("../../core/context/install-result");

/**
 * iOS installer — adds CocoaPods dependency when Podfile exists.
 */
function install(context) {
  console.log("\nInstalling iOS AppTrove SDK...\n");
  const result = new InstallResult("ios");

  if (context.matched === false) {
    result.add("project", {
      changed: false,
      message: context.hint || "iOS project not detected"
    });
    result.nextSteps = getNextSteps();
    return result;
  }

  const podfile = path.join(context.projectRoot, "Podfile");
  if (fs.existsSync(podfile)) {
    let content = fs.readFileSync(podfile, "utf8");
    if (content.includes("apptrove-ios-sdk") || content.includes("trackier-ios-sdk")) {
      result.add("pod", {
        changed: false,
        message: "apptrove-ios-sdk already in Podfile"
      });
    } else {
      const podLine = `  pod '${constants.ios.pod}', '~> ${constants.ios.podVersion}'\n`;
      if (/target\s+['"][^'"]+['"]\s+do/.test(content)) {
        content = content.replace(
          /(target\s+['"][^'"]+['"]\s+do\s*\n)/,
          `$1${podLine}`
        );
      } else {
        content += `\n${podLine}`;
      }
      fs.writeFileSync(podfile, content);
      result.add("pod", {
        changed: true,
        message: `Added pod '${constants.ios.pod}' (~> ${constants.ios.podVersion})`
      });
    }
  } else if (context.hasPackageSwift || fs.existsSync(path.join(context.projectRoot, "Package.swift"))) {
    result.add("spm", {
      changed: false,
      message: `Add SPM package ${constants.ios.spmUrl} (product: ${constants.ios.spmProduct}) in Xcode`
    });
  } else {
    result.add("dependency", {
      changed: false,
      message: "No Podfile found — add CocoaPods or SPM manually (see skill)"
    });
  }

  result.nextSteps = getNextSteps();
  return result;
}

function getNextSteps() {
  return [
    "Run `pod install` (CocoaPods) or add ApptroveSDK via Xcode SPM",
    "In AppDelegate.didFinishLaunching: create AppTroveSDKConfig(appToken:env:) and AppTroveSDK.initialize(config:)",
    "Import: `import apptrove_ios_sdk` (CocoaPods) or `import ApptroveSDK` (SPM)",
    "Add Associated Domains: applinks:YOUR_SUBDOMAIN.unilink.me",
    "Add NSUserTrackingUsageDescription for ATT",
    "Call AppTroveSDK.trackSession() in applicationDidBecomeActive",
    "Optional: config.setDeeplinkListerner(listener:) for deferred deep links"
  ];
}

module.exports = install;
