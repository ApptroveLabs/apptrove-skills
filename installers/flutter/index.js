const fs = require("fs-extra");
const path = require("path");
const constants = require("../../core/constants");
const InstallResult = require("../../core/context/install-result");

/**
 * Flutter installer — adds apptrove_sdk_flutter to pubspec.yaml
 */
function install(context) {
  console.log("\nInstalling Flutter AppTrove SDK...\n");
  const result = new InstallResult("flutter");

  const pubspecPath =
    context.pubspecPath || path.join(context.projectRoot, "pubspec.yaml");

  if (!fs.existsSync(pubspecPath)) {
    result.add("pubspec", {
      changed: false,
      message: "pubspec.yaml not found"
    });
    result.success = false;
    result.nextSteps = getNextSteps();
    return result;
  }

  let content = fs.readFileSync(pubspecPath, "utf8");

  if (content.includes("apptrove_sdk_flutter")) {
    result.add("dependency", {
      changed: false,
      message: "apptrove_sdk_flutter already in pubspec.yaml"
    });
  } else {
    const depLine = `  ${constants.flutter.pubName}: ${constants.flutter.pubConstraint}\n`;
    if (/^dependencies:\s*$/m.test(content) || /^dependencies:\s*\n/m.test(content)) {
      content = content.replace(
        /(^dependencies:\s*\n)/m,
        `$1${depLine}`
      );
    } else {
      content += `\ndependencies:\n${depLine}`;
    }
    fs.writeFileSync(pubspecPath, content);
    result.add("dependency", {
      changed: true,
      message: `Added ${constants.flutter.pubName}: ${constants.flutter.pubConstraint}`
    });
  }

  result.nextSteps = getNextSteps();
  return result;
}

function getNextSteps() {
  return [
    "Run `flutter pub get` then `cd ios && pod install`",
    "In main.dart / app bootstrap: AppTroveSDKConfig(token, env) + AppTroveFlutterSdk.initializeSDK(config)",
    "Import package:apptrove_sdk_flutter/apptrovefluttersdk.dart (and config/event)",
    "Set config.deferredDeeplinkCallback before initialize for deferred links",
    "Add Android installreferrer + ads-identifier deps and AD_ID permission",
    "Add iOS Associated Domains for Universal Links"
  ];
}

module.exports = install;
