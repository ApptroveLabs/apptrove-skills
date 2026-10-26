const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const detectAgent = require("../core/utils/detect-agent");
const installSkill = require("../core/utils/install-skill");
const analyzeProject = require("../core/analyzer/project-analyzer");
const analyzeAndroid = require("../core/analyzer/android-analyzer");
const addApptroveDependency = require("../core/modifier/gradle-modifier");
const injectApptrove = require("../installers/android/application-modifier");
const installDeepLink = require("../installers/android/deeplink");
const install = require("../installers");
const ProjectContext = require("../core/context/project-context");
const constants = require("../core/constants");

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe("constants", () => {
  it("exposes all platforms", () => {
    assert.deepEqual(constants.platforms, [
      "android",
      "ios",
      "flutter",
      "react-native",
      "expo",
      "cordova",
      "maui",
      "unity"
    ]);
  });

  it("uses correct Android Maven coordinate", () => {
    assert.equal(constants.android.artifactId, "android-sdk");
    assert.match(constants.android.dependency, /com\.apptrove:android-sdk:2\.0\.1/);
  });

  it("marks Unity as Trackier-only", () => {
    assert.equal(constants.unity.brand, "trackier");
    assert.equal(constants.unity.sdkClass, "TrackierUnity");
    assert.equal(constants.unity.configClass, "TrackierConfig");
  });
});

describe("detectAgent", () => {
  it("detects claude and cursor", () => {
    const dir = makeTempDir("apptrove-agent-");
    fs.mkdirSync(path.join(dir, ".claude"));
    fs.mkdirSync(path.join(dir, ".cursor"));
    const agents = detectAgent(dir);
    assert.ok(agents.includes("claude-code"));
    assert.ok(agents.includes("cursor"));
    fs.removeSync(dir);
  });
});

// describe("installSkill", () => {
//   it("copies android skill for claude-code", () => {
//     const dir = makeTempDir("apptrove-skill-");
//     fs.mkdirSync(path.join(dir, ".claude"));
//     const dest = installSkill("claude-code", "android", dir);
//     assert.ok(fs.existsSync(dest));
//     const content = fs.readFileSync(dest, "utf8");
//     assert.match(content, /com\.apptrove:android-sdk/);
//     assert.match(content, /AppTroveSDK\.initialize/);
//     fs.removeSync(dir);
//   });

//   it("has skills for every platform", () => {
//     for (const platform of constants.platforms) {
//       const skill = path.join(__dirname, "..", "skills", platform, "SKILL.md");
//       assert.ok(fs.existsSync(skill), `missing skill: ${platform}`);
//     }
//   });
// });


describe("installSkill", () => {
  it("copies android skill for claude-code", () => {
    const dir = makeTempDir("apptrove-skill-");
    const dest = installSkill("claude-code", "android", dir);

    assert.ok(fs.existsSync(dest));
    assert.ok(fs.statSync(dest).isDirectory());

    const skillFile = path.join(dest, "SKILL.md");
    assert.ok(fs.existsSync(skillFile));

    const content = fs.readFileSync(skillFile, "utf8");
    const source = fs.readFileSync(
      path.join(__dirname, "..", "skills", "android", "SKILL.md"),
      "utf8"
    );

    assert.equal(content, source);
    assert.ok(fs.existsSync(path.join(dest, "references")));
    assert.ok(fs.existsSync(path.join(dest, "templates")));
    assert.ok(fs.existsSync(path.join(dest, "validators")));

    fs.removeSync(dir);
  });

  it("has skills for every platform", () => {
    for (const platform of constants.platforms) {
      const skill = path.join(
        __dirname,
        "..",
        "skills",
        platform,
        "SKILL.md"
      );

      assert.ok(fs.existsSync(skill), `missing skill: ${platform}`);
    }
  });
});


describe("android analyzer + gradle modifier", () => {
  let dir;

  before(() => {
    dir = makeTempDir("apptrove-android-");
    fs.mkdirSync(path.join(dir, "app/src/main/kotlin"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "settings.gradle"),
      "rootProject.name = 'demo'\n"
    );
    fs.writeFileSync(
      path.join(dir, "app/build.gradle"),
      `android {}\n\ndependencies {\n    implementation("androidx.core:core-ktx:1.16.0")\n}\n`
    );
    fs.writeFileSync(
      path.join(dir, "app/src/main/AndroidManifest.xml"),
      `<?xml version="1.0" encoding="utf-8"?>
<manifest package="com.example.app">
    <application android:name=".MyApplication">
        <activity android:name=".MainActivity" android:exported="true">
        </activity>
    </application>
</manifest>
`
    );
    fs.writeFileSync(
      path.join(dir, "app/src/main/kotlin/MyApplication.kt"),
      `package com.example.app

import android.app.Application

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
`
    );
  });

  after(() => {
    fs.removeSync(dir);
  });

  it("detects android project", () => {
    const report = analyzeAndroid(dir);
    assert.equal(report.androidProject, true);
    assert.ok(report.gradleFile);
  });

  it("adds correct SDK dependencies", () => {
    const result = addApptroveDependency({ projectRoot: dir });
    assert.equal(result.changed, true);
    const gradle = fs.readFileSync(path.join(dir, "app/build.gradle"), "utf8");
    assert.match(gradle, /com\.apptrove:android-sdk:2\.0\.1/);
    assert.match(gradle, /installreferrer/);
    assert.match(gradle, /play-services-ads-identifier/);
  });

  it("is idempotent on second dependency add", () => {
    const result = addApptroveDependency({ projectRoot: dir });
    assert.equal(result.changed, false);
  });

  it("injects AppTroveSDK init into Application", () => {
    const file = path.join(dir, "app/src/main/kotlin/MyApplication.kt");
    const result = injectApptrove(file, { sdkKey: "test-token", env: "development" });
    assert.equal(result.changed, true);
    const content = fs.readFileSync(file, "utf8");
    assert.match(content, /AppTroveSDKConfig\(this, "test-token", "development"\)/);
    assert.match(content, /sdkConfig\.setAppSecret\("YOUR_SECRET_ID", "YOUR_SECRET_KEY"\)/);
    assert.match(content, /AppTroveSDK\.initialize/);
    assert.match(content, /import com\.apptrove\.sdk\.AppTroveSDK/);
  });

  it("adds SDK signing credentials when provided", () => {
    const dir = makeTempDir("apptrove-signing-");
    const file = path.join(dir, "MyApplication.kt");
    fs.writeFileSync(
      file,
      `package com.example.app\n\nimport android.app.Application\n\nclass MyApplication : Application() {\n}`
    );

    injectApptrove(file, {
      sdkSecretId: "secret-id",
      sdkSecretKey: "secret-key"
    });

    const content = fs.readFileSync(file, "utf8");
    assert.match(content, /sdkConfig\.setAppSecret\("secret-id", "secret-key"\)/);
    fs.removeSync(dir);
  });

  it("generates Java-compatible SDK signing code", () => {
    const dir = makeTempDir("apptrove-java-signing-");
    const file = path.join(dir, "MyApplication.java");
    fs.writeFileSync(
      file,
      `package com.example.app;\n\nimport android.app.Application;\n\npublic class MyApplication extends Application {\n}`
    );

    injectApptrove(file, {
      sdkSecretId: "secret-id",
      sdkSecretKey: "secret-key"
    });

    const content = fs.readFileSync(file, "utf8");
    assert.match(content, /sdkConfig\.setAppSecret\("secret-id", "secret-key"\);/);
    fs.removeSync(dir);
  });

  it("adds deep link intent-filter", () => {
    const result = installDeepLink(dir, { host: "demo.u9ilnk.me" });
    assert.equal(result.changed, true);
    const manifest = fs.readFileSync(
      path.join(dir, "app/src/main/AndroidManifest.xml"),
      "utf8"
    );
    assert.match(manifest, /demo\.u9ilnk\.me/);
    assert.match(manifest, /android\.intent\.action\.VIEW/);
    assert.match(manifest, /AD_ID/);
  });

  it("runs full android installer", () => {
    // Fresh dir for full flow
    const full = makeTempDir("apptrove-full-");
    fs.mkdirSync(path.join(full, "app/src/main/kotlin"), { recursive: true });
    fs.writeFileSync(path.join(full, "settings.gradle"), "include ':app'\n");
    fs.writeFileSync(
      path.join(full, "app/build.gradle"),
      "dependencies {\n}\n"
    );
    fs.writeFileSync(
      path.join(full, "app/src/main/AndroidManifest.xml"),
      `<manifest package="com.example.app">
  <application android:name=".MyApplication">
    <activity android:name=".MainActivity"></activity>
  </application>
</manifest>`
    );
    fs.writeFileSync(
      path.join(full, "app/src/main/kotlin/MyApplication.kt"),
      `package com.example.app
import android.app.Application
class MyApplication : Application() {
  override fun onCreate() { super.onCreate() }
}`
    );

    const analysis = analyzeProject(full, "android");
    const context = new ProjectContext(analysis);
    const result = install(context, { sdkKey: "abc", env: "production" });

    assert.equal(result.platform, "android");
    assert.equal(result.steps.dependency.changed, true);
    assert.equal(result.steps.initialization.changed, true);
    assert.equal(result.steps.deepLink.changed, true);

    fs.removeSync(full);
  });
});

describe("flutter installer", () => {
  it("adds pubspec dependency", () => {
    const dir = makeTempDir("apptrove-flutter-");
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      "name: demo\ndependencies:\n  flutter:\n    sdk: flutter\n"
    );
    const analysis = analyzeProject(dir, "flutter");
    assert.equal(analysis.platform, "flutter");
    const result = install(new ProjectContext(analysis));
    assert.equal(result.steps.dependency.changed, true);
    const pub = fs.readFileSync(path.join(dir, "pubspec.yaml"), "utf8");
    assert.match(pub, /apptrove_sdk_flutter/);
    fs.removeSync(dir);
  });
});

describe("react-native / expo installers", () => {
  it("adds react-native-apptrove to package.json", () => {
    const dir = makeTempDir("apptrove-rn-");
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify(
        { name: "rn-demo", dependencies: { "react-native": "0.76.0" } },
        null,
        2
      )
    );
    const analysis = analyzeProject(dir, "react-native");
    const result = install(new ProjectContext(analysis));
    assert.equal(result.steps.dependency.changed, true);
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    assert.ok(pkg.dependencies["react-native-apptrove"]);
    fs.removeSync(dir);
  });

  it("adds expo sdk + plugin", () => {
    const dir = makeTempDir("apptrove-expo-");
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify(
        { name: "expo-demo", dependencies: { expo: "52.0.0", "react-native": "0.76.0" } },
        null,
        2
      )
    );
    fs.writeFileSync(
      path.join(dir, "app.json"),
      JSON.stringify({ expo: { name: "demo", plugins: [] } }, null, 2)
    );
    const analysis = analyzeProject(dir, "expo");
    const result = install(new ProjectContext(analysis));
    assert.equal(result.steps.dependency.changed, true);
    assert.equal(result.steps.plugin.changed, true);
    const app = JSON.parse(fs.readFileSync(path.join(dir, "app.json"), "utf8"));
    assert.ok(app.expo.plugins.some((p) => String(p).includes("apptrove-expo-sdk")));
    fs.removeSync(dir);
  });
});

describe("maui installer", () => {
  it("adds AppTroveSDK.Maui PackageReference", () => {
    const dir = makeTempDir("apptrove-maui-");
    fs.writeFileSync(
      path.join(dir, "Demo.csproj"),
      `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <UseMaui>true</UseMaui>
  </PropertyGroup>
  <ItemGroup>
  </ItemGroup>
</Project>
`
    );
    const analysis = analyzeProject(dir, "maui");
    const result = install(new ProjectContext(analysis));
    assert.equal(result.steps.nuget.changed, true);
    const csproj = fs.readFileSync(path.join(dir, "Demo.csproj"), "utf8");
    assert.match(csproj, /AppTroveSDK\.Maui/);
    assert.match(csproj, /2\.1\.0/);
    fs.removeSync(dir);
  });
});

describe("unity installer (Trackier-only)", () => {
  it("detects Unity project and writes Trackier hint file", () => {
    const dir = makeTempDir("apptrove-unity-");
    fs.mkdirSync(path.join(dir, "Assets"));
    fs.mkdirSync(path.join(dir, "ProjectSettings"));
    const analysis = analyzeProject(dir, "unity");
    assert.equal(analysis.platform, "unity");
    assert.equal(analysis.unityProject, true);
    assert.equal(analysis.brand, "trackier");

    const result = install(new ProjectContext(analysis));
    assert.ok(result.steps.package.message.includes("Trackier"));
    assert.equal(result.steps.hintFile.changed, true);
    assert.ok(fs.existsSync(path.join(dir, "APPTROVE_UNITY_TRACKIER.md")));

    const skill = path.join(__dirname, "..", "skills", "unity", "SKILL.md");
    const skillText = fs.readFileSync(skill, "utf8");
    assert.match(skillText, /TrackierUnity\.initialize/);
    assert.match(skillText, /TrackierConfig/);
    assert.doesNotMatch(skillText, /AppTroveSDK\.initialize/);
    fs.removeSync(dir);
  });
});

describe("ios installer", () => {
  it("adds pod to Podfile", () => {
    const dir = makeTempDir("apptrove-ios-");
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '13.0'\ntarget 'Demo' do\n  use_frameworks!\nend\n`
    );
    const analysis = analyzeProject(dir, "ios");
    const result = install(new ProjectContext(analysis));
    assert.equal(result.steps.pod.changed, true);
    const pod = fs.readFileSync(path.join(dir, "Podfile"), "utf8");
    assert.match(pod, /apptrove-ios-sdk/);
    fs.removeSync(dir);
  });
});

describe("legacy gradle coordinate upgrade", () => {
  it("replaces com.apptrove:sdk with android-sdk", () => {
    const dir = makeTempDir("apptrove-legacy-");
    fs.mkdirSync(path.join(dir, "app"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "app/build.gradle"),
      `dependencies {\n    implementation "com.apptrove:sdk:latest"\n}\n`
    );
    const result = addApptroveDependency({ projectRoot: dir });
    assert.equal(result.changed, true);
    const gradle = fs.readFileSync(path.join(dir, "app/build.gradle"), "utf8");
    assert.match(gradle, /com\.apptrove:android-sdk:2\.0\.1/);
    assert.doesNotMatch(gradle, /com\.apptrove:sdk:latest/);
    fs.removeSync(dir);
  });
});
