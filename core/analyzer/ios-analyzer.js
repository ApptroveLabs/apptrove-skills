const fs = require("fs-extra");
const path = require("path");

function analyzeIos(projectRoot = process.cwd()) {
  const hasPodfile = fs.existsSync(path.join(projectRoot, "Podfile"));
  const hasXcodeproj = fs
    .readdirSync(projectRoot)
    .some((f) => f.endsWith(".xcodeproj") || f.endsWith(".xcworkspace"));
  const hasPackageSwift = fs.existsSync(path.join(projectRoot, "Package.swift"));

  // Avoid treating Flutter/RN ios/ folder alone as a bare iOS project
  const hasPubspec = fs.existsSync(path.join(projectRoot, "pubspec.yaml"));
  const hasPackageJson = fs.existsSync(path.join(projectRoot, "package.json"));

  const iosProject =
    (hasPodfile || hasXcodeproj || hasPackageSwift) &&
    !hasPubspec &&
    !(
      hasPackageJson &&
      (fs.readFileSync(path.join(projectRoot, "package.json"), "utf8").includes(
        "react-native"
      ) ||
        fs
          .readFileSync(path.join(projectRoot, "package.json"), "utf8")
          .includes('"expo"'))
    );

  return {
    platform: "ios",
    iosProject,
    hasPodfile,
    hasXcodeproj,
    hasPackageSwift,
    projectPath: projectRoot
  };
}

module.exports = analyzeIos;
