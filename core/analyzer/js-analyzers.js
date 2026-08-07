const fs = require("fs-extra");
const path = require("path");

function readPackageJson(projectRoot) {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  try {
    return {
      path: pkgPath,
      data: JSON.parse(fs.readFileSync(pkgPath, "utf8"))
    };
  } catch {
    return null;
  }
}

function hasDep(pkg, name) {
  if (!pkg) return false;
  const deps = {
    ...(pkg.data.dependencies || {}),
    ...(pkg.data.devDependencies || {})
  };
  return Boolean(deps[name]);
}

function analyzeReactNative(projectRoot = process.cwd()) {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) {
    return { reactNativeProject: false, projectPath: projectRoot };
  }

  const isExpo = hasDep(pkg, "expo");
  const isRn = hasDep(pkg, "react-native");

  return {
    platform: "react-native",
    reactNativeProject: isRn && !isExpo,
    packageJsonPath: pkg.path,
    hasApptrove: hasDep(pkg, "react-native-apptrove"),
    projectPath: projectRoot
  };
}

function analyzeExpo(projectRoot = process.cwd()) {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) {
    return { expoProject: false, projectPath: projectRoot };
  }

  const hasExpoDep = hasDep(pkg, "expo");
  const hasAppConfig =
    fs.existsSync(path.join(projectRoot, "app.json")) ||
    fs.existsSync(path.join(projectRoot, "app.config.js")) ||
    fs.existsSync(path.join(projectRoot, "app.config.ts"));

  const expoProject = hasExpoDep || (hasAppConfig && hasDep(pkg, "react-native"));

  return {
    platform: "expo",
    expoProject: Boolean(expoProject && hasExpoDep),
    packageJsonPath: pkg.path,
    hasApptrove: hasDep(pkg, "apptrove-expo-sdk"),
    projectPath: projectRoot
  };
}

function analyzeCordova(projectRoot = process.cwd()) {
  const configXml = path.join(projectRoot, "config.xml");
  const hasConfig = fs.existsSync(configXml);
  let isCordova = false;

  if (hasConfig) {
    const content = fs.readFileSync(configXml, "utf8");
    isCordova =
      content.includes("cordova") ||
      content.includes("widget") ||
      fs.existsSync(path.join(projectRoot, "platforms"));
  }

  const pkg = readPackageJson(projectRoot);
  if (pkg && hasDep(pkg, "cordova")) {
    isCordova = true;
  }

  return {
    platform: "cordova",
    cordovaProject: isCordova,
    configXml: hasConfig ? configXml : null,
    hasApptrove: pkg ? hasDep(pkg, "com.apptrove.cordova_sdk") : false,
    projectPath: projectRoot
  };
}

module.exports = {
  analyzeReactNative,
  analyzeExpo,
  analyzeCordova,
  readPackageJson,
  hasDep
};
