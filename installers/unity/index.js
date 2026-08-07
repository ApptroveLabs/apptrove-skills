const fs = require("fs-extra");
const path = require("path");
const constants = require("../../core/constants");
const InstallResult = require("../../core/context/install-result");

/**
 * Unity installer — Trackier SDK only (no Apptrove v2 package yet).
 * Detects Unity project layout and checks whether Trackier assets are present.
 * The .unitypackage must be imported manually in the Unity Editor.
 */
function install(context) {
  console.log("\nInstalling Unity Trackier SDK (Trackier-only — no Apptrove v2)...\n");
  const result = new InstallResult("unity");

  const root = context.projectRoot;
  const isUnity = isUnityProject(root);

  if (!isUnity && context.matched === false) {
    result.add("project", {
      changed: false,
      message: context.hint || "Unity project not detected (look for Assets/ + ProjectSettings/)"
    });
  } else if (!isUnity) {
    result.add("project", {
      changed: false,
      message: "Unity project markers not found"
    });
  } else {
    result.add("project", {
      changed: false,
      message: `Unity project detected at ${root}`
    });
  }

  const trackierDir = path.join(root, "Assets", "Trackier");
  const trackierScript = path.join(trackierDir, "Trackier.cs");

  if (fs.existsSync(trackierDir) || fs.existsSync(trackierScript)) {
    result.add("package", {
      changed: false,
      message: "Trackier Unity assets already present under Assets/Trackier/"
    });
  } else {
    result.add("package", {
      changed: false,
      message:
        `Manual import required: download Trackier Unity .unitypackage (>= ${constants.unity.minVersion}, latest ${constants.unity.version}) and Import Package in Unity Editor`
    });
  }

  // Optional: scaffold a bootstrap script hint file (non-destructive README in project)
  const hintPath = path.join(root, "APPTROVE_UNITY_TRACKIER.md");
  if (isUnity && !fs.existsSync(hintPath)) {
    fs.writeFileSync(
      hintPath,
      [
        "# Trackier Unity SDK setup",
        "",
        "Unity currently uses **Trackier** (not Apptrove v2).",
        "",
        `1. Download .unitypackage (${constants.unity.version}+): ${constants.unity.downloadUrl}`,
        "2. Unity Editor → Assets → Import Package → Custom Package",
        "3. Confirm Assets/Trackier/ exists",
        "4. Android: External Dependency Manager → Resolve",
        "5. Init with TrackierConfig + TrackierUnity.initialize (see AI skill)",
        ""
      ].join("\n")
    );
    result.add("hintFile", {
      changed: true,
      message: `Wrote ${path.basename(hintPath)} with import steps`
    });
  }

  result.nextSteps = [
    `Download Trackier Unity SDK ${constants.unity.version}: ${constants.unity.downloadUrl}`,
    "Unity Editor → Assets → Import Package → Custom Package",
    "using com.trackier.sdk; → new TrackierConfig(key, env) → TrackierUnity.initialize(config)",
    "Optional: trackierConfig.setAppSecret(secretId, secretKey)",
    "Optional: setDeferredDeeplinkDelegate before initialize",
    "Android: add UniLink intent-filter in Assets/Plugins/Android/AndroidManifest.xml",
    "iOS: Associated Domains applinks:YOUR_SUBDOMAIN.unilink.me",
    "Note: No Apptrove v2 Unity SDK exists yet — keep Trackier for this platform"
  ];

  return result;
}

function isUnityProject(root) {
  return (
    fs.existsSync(path.join(root, "Assets")) &&
    fs.existsSync(path.join(root, "ProjectSettings"))
  );
}

module.exports = install;
module.exports.isUnityProject = isUnityProject;
