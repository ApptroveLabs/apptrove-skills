# AppTrove AI Skills & SDK Installer

One CLI for AppTrove clients: install **AI coding skills** into Claude / Cursor / Windsurf / Copilot, and **wire the AppTrove SDK** into your mobile or game project.

```bash
npx @apptrove/skills add android --sdk-key YOUR_APP_TOKEN
```

---

## How clients use this

### Who this is for

App developers integrating AppTrove MMP attribution into:

- Android, iOS, Flutter, React Native, Expo, Cordova/Ionic, .NET MAUI
- Unity (Trackier SDK only — see note below)

You need:

1. **Node.js 18+**
2. Your app / game project on disk
3. An **SDK key** from the [AppTrove dashboard](https://dashboard.apptrove.com/) → your app → **SDK Integration**

### Step-by-step (recommended flow)

#### Step 1 — Open your app project

```bash
cd /path/to/your-android-or-flutter-or-rn-app
```

#### Step 2 — Run the installer for your platform

```bash
# After the package is published on npm:
npx @apptrove/skills add <platform> --sdk-key YOUR_APP_TOKEN

# Or run from a local clone of this repo:
node /path/to/apptrove-skills/bin/install.js add <platform> --sdk-key YOUR_APP_TOKEN
```

Replace `<platform>` with one of:

`android` · `ios` · `flutter` · `react-native` · `expo` · `cordova` · `maui` · `unity`

#### Step 3 — What the CLI does for you

| Step | What happens |
| --- | --- |
| 1 | Detects your AI coding agent (Claude Code, Cursor, Windsurf, Copilot, or creates `AGENTS.md`) |
| 2 | Installs the platform **AI skill** so the agent knows correct AppTrove APIs |
| 3 | Detects your project type |
| 4 | Applies SDK integration (dependency / Podfile / pubspec / etc., depending on platform) |
| 5 | Prints an **integration report** + remaining manual steps |

#### Step 4 — Finish the few manual items

The report always lists next steps (replace UniLink host, run `pod install`, call `parseDeepLink`, etc.). Complete those, then rebuild the app.

#### Step 5 — Use your AI agent for the rest

Ask your coding agent things like:

- *“Finish AppTrove deep link handling in MainActivity”*
- *“Track a purchase event with AppTrove”*
- *“Add setAppSecret for SDK signing”*

The agent follows the installed skill (real `AppTrove*` APIs — not old Trackier names, except Unity).

---

## Client command cheat sheet

```bash
# Integrate SDK + AI skill
npx @apptrove/skills add android --sdk-key YOUR_TOKEN
npx @apptrove/skills add ios --sdk-key YOUR_TOKEN
npx @apptrove/skills add flutter --sdk-key YOUR_TOKEN
npx @apptrove/skills add react-native --sdk-key YOUR_TOKEN
npx @apptrove/skills add expo --sdk-key YOUR_TOKEN
npx @apptrove/skills add cordova
npx @apptrove/skills add maui
npx @apptrove/skills add unity

# Useful options
npx @apptrove/skills add android --sdk-key YOUR_TOKEN --env production
npx @apptrove/skills add android --deep-link-host myapp.u9ilnk.me
npx @apptrove/skills add flutter --skill-only          # AI skill only (no file edits)
npx @apptrove/skills add ios --all-agents              # install skill into every detected agent
npx @apptrove/skills add android --cwd ../my-app       # run against another folder

# Helpers
npx @apptrove/skills list      # show package names + versions
npx @apptrove/skills detect    # show detected AI agents + project type
```

---

## Per-platform: what clients get & what they do next

### Android

**CLI does:**

- Adds `com.apptrove:android-sdk:2.0.1`
- Adds install referrer + Google ads identifier deps
- Injects `AppTroveSDK.initialize(config)` into your Application class (when found)
- Adds permissions + https deep-link intent-filter

**You do next:**

1. Confirm / replace SDK key in Application class
2. Replace `YOUR_SUBDOMAIN.u9ilnk.me` with your UniLink domain
3. Call `AppTroveSDK.parseDeepLink(uri)` in the activity that opens links
4. Sync Gradle and rebuild

```bash
npx @apptrove/skills add android --sdk-key YOUR_TOKEN --deep-link-host yourapp.u9ilnk.me
```

### iOS

**CLI does:**

- Adds `pod 'apptrove-ios-sdk'` when a `Podfile` exists
- Installs the iOS AI skill

**You do next:**

1. `pod install` (or add SPM product `ApptroveSDK` from docs)
2. In `AppDelegate`: `AppTroveSDKConfig` + `AppTroveSDK.initialize(config:)`
3. Call `waitForATTUserAuthorization` **before** init; `subscribeAttributionlink()` **after** init (deferred links)
4. Add Associated Domains + `NSUserTrackingUsageDescription`

```bash
npx @apptrove/skills add ios --sdk-key YOUR_TOKEN
```

### Flutter

**CLI does:**

- Adds `apptrove_sdk_flutter` to `pubspec.yaml`
- Installs the Flutter AI skill

**You do next:**

1. `flutter pub get` then `cd ios && pod install`
2. At app start: `AppTroveSDKConfig` + `AppTroveFlutterSdk.initializeSDK(config)`
3. Set `deferredDeeplinkCallback` **before** init if you need deferred links
4. Configure native Android/iOS deep links as needed

```bash
npx @apptrove/skills add flutter --sdk-key YOUR_TOKEN
```

### React Native

**CLI does:**

- Adds `react-native-apptrove` to `package.json`
- Installs the RN AI skill

**You do next:**

1. `npm install` / `yarn` then `cd ios && pod install`
2. `new ApptroveConfig(key, ApptroveConfig.EnvironmentDevelopment)` + `ApptroveSDK.initialize(config)`
3. Note RN class spelling: **`Apptrove*`** (not `AppTrove*`)

```bash
npx @apptrove/skills add react-native --sdk-key YOUR_TOKEN
```

### Expo

**CLI does:**

- Adds `apptrove-expo-sdk` to `package.json`
- Adds Expo config plugin to `app.json`
- Installs the Expo AI skill

**You do next:**

1. `npm install` then `npx expo prebuild` (**dev client required** — not Expo Go)
2. `new AppTroveConfig(...)` + `AppTroveSDK.initialize(config)`

```bash
npx @apptrove/skills add expo --sdk-key YOUR_TOKEN
```

### Cordova / Ionic

**CLI does:**

- Installs the Cordova AI skill
- Prints the official install command

**You do next:**

1. `npm install ApptroveLabs/cordova_sdk#ApptroveSDK`
2. Ionic: `npm install @awesome-cordova-plugins/core --save` then `ionic cap sync`
3. Subscribe to deferred deeplink **before** `initializeSDK`
4. Call `initializeSDK(config)`

```bash
npx @apptrove/skills add cordova
```

### .NET MAUI

**CLI does:**

- Adds `AppTroveSDK.Maui` `2.1.0` PackageReference to your `.csproj` when found
- Installs the MAUI AI skill

**You do next:**

1. `AppTroveSDK.Initialize(new AppTroveSDKConfig(key, env))`
2. iOS: `WaitForATTUserAuthorization` before init; `SubscribeAttributionLink` after init
3. Add Android permissions + ATT usage string

```bash
npx @apptrove/skills add maui --sdk-key YOUR_TOKEN
```

### Unity (Trackier only)

> Unity has **no Apptrove v2 SDK** yet. Clients must use the **Trackier Unity SDK**.

**CLI does:**

- Installs the Trackier Unity AI skill
- Detects a Unity project (`Assets/` + `ProjectSettings/`)
- Writes `APPTROVE_UNITY_TRACKIER.md` with import steps

**You do next:**

1. Download Trackier `.unitypackage` (**1.6.74+**) from the [releases Drive folder](https://drive.google.com/drive/folders/1VExFSHH3aSGqVpN8DZR_o_t4GMS4vXIB?usp=sharing)
2. Unity Editor → **Assets → Import Package → Custom Package**
3. Init with `TrackierConfig` + `TrackierUnity.initialize` (see skill)
4. Android Resolver → Resolve; configure UniLink / Associated Domains

```bash
npx @apptrove/skills add unity
```

```csharp
using com.trackier.sdk;

var config = new TrackierConfig("YOUR_SDK_KEY", "development");
TrackierUnity.initialize(config);
```

---

## Where the AI skill is installed

| Coding agent | Location after `add` |
| --- | --- |
| Claude Code | `.claude/skills/apptrove/<platform>/SKILL.md` |
| Cursor | `.cursor/rules/apptrove-<platform>.mdc` |
| Windsurf | `.windsurf/rules/apptrove-<platform>.md` |
| GitHub Copilot | appended to `.github/copilot-instructions.md` |
| Other / none detected | `AGENTS.md` (created if missing) |

Use `--all-agents` to install into every detected agent at once.

---

## How it works (architecture)

```text
Client app repo
      │
      ▼
apptrove-skills add <platform> [--sdk-key ...]
      │
      ├─► Detect AI agent
      ├─► Copy skills/<platform>/SKILL.md into agent config
      ├─► Analyze project files
      ├─► Run platform installer (Gradle / Podfile / pubspec / npm / NuGet / Unity hint)
      └─► Print report + next steps
```

---

## Supported SDK packages

| Platform | Package | Version | Brand |
| --- | --- | --- | --- |
| Android | `com.apptrove:android-sdk` | `2.0.1` | AppTrove |
| iOS CocoaPods | `apptrove-ios-sdk` | `2.0.6` | AppTrove |
| iOS SPM | `ApptroveSDK` | `2.0.4` | AppTrove |
| Flutter | `apptrove_sdk_flutter` | `^2.0.5` | AppTrove |
| React Native | `react-native-apptrove` | `2.0.1` | AppTrove (`Apptrove*` classes) |
| Expo | `apptrove-expo-sdk` | `2.0.3` | AppTrove |
| Cordova | `ApptroveLabs/cordova_sdk#ApptroveSDK` | `2.0.5` | AppTrove |
| MAUI | `AppTroveSDK.Maui` | `2.1.0` | AppTrove |
| Unity | Trackier `.unitypackage` | `1.6.74` | **Trackier only** |

Official integration docs: [AppTrove Development Center](https://dev.apptrove.com) (`mmp-dev-docs`).

---

## FAQ for clients

**Do I need an AI agent?**  
No. The CLI still integrates the SDK. Without Claude/Cursor/etc., instructions are written to `AGENTS.md`.

**Can I only install the AI skill?**  
Yes: `--skill-only`.

**Wrong platform folder?**  
Use `--cwd /path/to/app`.

**Unity vs AppTrove?**  
Unity is Trackier-only today. All other platforms in this tool use AppTrove v2.

**Secret key / SDK signing?**  
Optional. Generate Secret ID + Key in the dashboard (SDK Integration → Advanced), then call `setAppSecret` on the platform config class. Your AI skill documents the exact call.

---

## Develop this repo (internal)

```bash
cd apptrove-skills
npm install
npm test
node bin/install.js list
node bin/install.js add android --cwd ./sample --sdk-key demo-token
```

```text
apptrove-skills/
├── bin/install.js          # CLI entry
├── core/                   # analyzers, modifiers, constants
├── installers/             # per-platform automation
├── skills/                 # AI skill markdown (source of truth)
├── tests/
└── sample/                 # Android sample
```

## License

MIT
