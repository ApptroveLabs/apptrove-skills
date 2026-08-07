const installAndroid = require("./android");
const installIos = require("./ios");
const installFlutter = require("./flutter");
const installMaui = require("./maui");
const installUnity = require("./unity");
const {
  installReactNative,
  installExpo,
  installCordova
} = require("./js-installers");

/**
 * Route to the correct platform installer.
 * @param {object} context
 * @param {object} [options]
 */
function install(context, options = {}) {
  switch (context.platform) {
    case "android":
      return installAndroid(context, options);
    case "ios":
      return installIos(context, options);
    case "flutter":
      return installFlutter(context, options);
    case "react-native":
      return installReactNative(context, options);
    case "expo":
      return installExpo(context, options);
    case "cordova":
      return installCordova(context, options);
    case "maui":
      return installMaui(context, options);
    case "unity":
      return installUnity(context, options);
    default:
      throw new Error(`Unsupported platform: ${context.platform}`);
  }
}

module.exports = install;
