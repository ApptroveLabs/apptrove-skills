const fs = require("fs-extra");
const path = require("path");
const analyzeAndroid = require("./android-analyzer");
const analyzeIos = require("./ios-analyzer");
const analyzeFlutter = require("./flutter-analyzer");
const {
  analyzeReactNative,
  analyzeExpo,
  analyzeCordova
} = require("./js-analyzers");

function analyzeMaui(projectRoot = process.cwd()) {
  try {
    const entries = fs.readdirSync(projectRoot);
    const csproj = entries.find((f) => f.endsWith(".csproj"));
    if (!csproj) return { mauiProject: false, projectPath: projectRoot };
    const content = fs.readFileSync(path.join(projectRoot, csproj), "utf8");
    const mauiProject =
      content.includes("Microsoft.Maui") ||
      content.includes("UseMaui") ||
      content.includes("AppTroveSDK.Maui");
    return {
      platform: "maui",
      mauiProject,
      csprojPath: path.join(projectRoot, csproj),
      hasApptrove: content.includes("AppTroveSDK.Maui"),
      projectPath: projectRoot
    };
  } catch {
    return { mauiProject: false, projectPath: projectRoot };
  }
}

function analyzeUnity(projectRoot = process.cwd()) {
  const assets = path.join(projectRoot, "Assets");
  const projectSettings = path.join(projectRoot, "ProjectSettings");
  const unityProject =
    fs.existsSync(assets) && fs.existsSync(projectSettings);
  const hasTrackier =
    fs.existsSync(path.join(assets, "Trackier")) ||
    fs.existsSync(path.join(assets, "Trackier", "Trackier.cs"));

  return {
    platform: "unity",
    unityProject,
    hasTrackier,
    brand: "trackier",
    projectPath: projectRoot
  };
}

/**
 * Detect project platform. Prefer explicit platform when provided.
 * Detection order: flutter → expo → react-native → cordova → maui → android → ios
 * @param {string} projectRoot
 * @param {string} [preferredPlatform]
 */
function analyzeProject(projectRoot = process.cwd(), preferredPlatform) {
  const flutter = analyzeFlutter(projectRoot);
  const expo = analyzeExpo(projectRoot);
  const rn = analyzeReactNative(projectRoot);
  const cordova = analyzeCordova(projectRoot);
  const maui = analyzeMaui(projectRoot);
  const unity = analyzeUnity(projectRoot);
  const android = analyzeAndroid(projectRoot);
  const ios = analyzeIos(projectRoot);

  const candidates = {
    flutter: flutter.flutterProject
      ? { platform: "flutter", projectRoot, ...flutter }
      : null,
    expo: expo.expoProject
      ? { platform: "expo", projectRoot, ...expo }
      : null,
    "react-native": rn.reactNativeProject
      ? { platform: "react-native", projectRoot, ...rn }
      : null,
    cordova: cordova.cordovaProject
      ? { platform: "cordova", projectRoot, ...cordova }
      : null,
    maui: maui.mauiProject
      ? { platform: "maui", projectRoot, ...maui }
      : null,
    unity: unity.unityProject
      ? { platform: "unity", projectRoot, ...unity }
      : null,
    android: android.androidProject
      ? { platform: "android", projectRoot, ...android }
      : null,
    ios: ios.iosProject
      ? { platform: "ios", projectRoot, ...ios }
      : null
  };

  if (preferredPlatform && candidates[preferredPlatform]) {
    return candidates[preferredPlatform];
  }

  if (preferredPlatform) {
    return {
      platform: preferredPlatform,
      projectRoot,
      matched: false,
      hint: `No ${preferredPlatform} project detected at ${projectRoot}. Skill will still be installed.`
    };
  }

  return (
    candidates.flutter ||
    candidates.expo ||
    candidates["react-native"] ||
    candidates.cordova ||
    candidates.maui ||
    candidates.unity ||
    candidates.android ||
    candidates.ios ||
    null
  );
}

module.exports = analyzeProject;
