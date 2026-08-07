const fs = require("fs-extra");
const path = require("path");
const constants = require("../core/constants");
const InstallResult = require("../core/context/install-result");

/**
 * Add an npm dependency to package.json without running npm install.
 */
function addNpmDep(packageJsonPath, name, version) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  pkg.dependencies = pkg.dependencies || {};
  if (pkg.dependencies[name]) {
    return { changed: false, message: `${name} already in package.json` };
  }
  pkg.dependencies[name] = `^${version}`;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
  return { changed: true, message: `Added ${name}@^${version} to package.json` };
}

function installReactNative(context) {
  console.log("\nInstalling React Native AppTrove SDK...\n");
  const result = new InstallResult("react-native");
  const pkgPath =
    context.packageJsonPath || path.join(context.projectRoot, "package.json");

  if (!fs.existsSync(pkgPath)) {
    result.add("package", { changed: false, message: "package.json not found" });
    result.success = false;
  } else {
    result.add(
      "dependency",
      addNpmDep(pkgPath, constants.reactNative.npmName, constants.reactNative.version)
    );
  }

  result.nextSteps = [
    "Run `npm install` (or yarn) then `cd ios && pod install`",
    "Import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove'",
    "new ApptroveConfig(token, ApptroveConfig.EnvironmentDevelopment); ApptroveSDK.initialize(config)",
    "Add play-services-ads-identifier + AD_ID permission on Android",
    "Set setDeferredDeeplinkCallbackListener before initialize for deferred links"
  ];
  return result;
}

function installExpo(context) {
  console.log("\nInstalling Expo AppTrove SDK...\n");
  const result = new InstallResult("expo");
  const pkgPath =
    context.packageJsonPath || path.join(context.projectRoot, "package.json");

  if (!fs.existsSync(pkgPath)) {
    result.add("package", { changed: false, message: "package.json not found" });
    result.success = false;
  } else {
    result.add(
      "dependency",
      addNpmDep(pkgPath, constants.expo.npmName, constants.expo.version)
    );
  }

  // Add config plugin to app.json if present
  const appJson = path.join(context.projectRoot, "app.json");
  if (fs.existsSync(appJson)) {
    try {
      const app = JSON.parse(fs.readFileSync(appJson, "utf8"));
      const expo = app.expo || app;
      expo.plugins = expo.plugins || [];
      const pluginName = constants.expo.plugin;
      const hasPlugin = expo.plugins.some(
        (p) =>
          p === pluginName ||
          p === "./node_modules/apptrove-expo-sdk/app.plugin.js" ||
          (Array.isArray(p) &&
            (p[0] === pluginName ||
              String(p[0]).includes("apptrove-expo-sdk")))
      );
        if (!hasPlugin) {
        expo.plugins.push("./node_modules/apptrove-expo-sdk/app.plugin.js");
        if (app.expo) app.expo = expo;
        else Object.assign(app, expo);
        fs.writeFileSync(appJson, `${JSON.stringify(app, null, 2)}\n`);
        result.add("plugin", {
          changed: true,
          message: `Added Expo config plugin path to app.json`
        });
      } else {
        result.add("plugin", {
          changed: false,
          message: "Expo config plugin already present"
        });
      }
    } catch {
      result.add("plugin", {
        changed: false,
        message: "Could not parse app.json — add plugin manually"
      });
    }
  }

  result.nextSteps = [
    "Run `npm install` then `npx expo prebuild` (dev build required — not Expo Go)",
    "Import { AppTroveConfig, AppTroveSDK } from 'apptrove-expo-sdk'",
    "new AppTroveConfig(token, AppTroveConfig.EnvironmentDevelopment); AppTroveSDK.initialize(config)",
    "setDeferredDeeplinkCallbackListener receives AppTroveDeepLink object"
  ];
  return result;
}

function installCordova(context) {
  console.log("\nInstalling Cordova AppTrove SDK...\n");
  const result = new InstallResult("cordova");

  result.add("plugin", {
    changed: false,
    message: `Install with: ${constants.cordova.installCommand}`
  });

  result.nextSteps = [
    constants.cordova.installCommand,
    "Ionic: npm install @awesome-cordova-plugins/core --save && ionic cap sync",
    "Import from com.apptrove.cordova_sdk/ionic-native/apptrove/ngx",
    "Call setDeferredDeeplinkCallbackListener().subscribe(...) BEFORE initializeSDK",
    "config.setDeferredDeeplink(true); then initializeSDK(config)",
    "iOS: waitForATTUserAuthorization before init; subscribeAttributionlink after init"
  ];
  return result;
}

module.exports = {
  installReactNative,
  installExpo,
  installCordova,
  addNpmDep
};
