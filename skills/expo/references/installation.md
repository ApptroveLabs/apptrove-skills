# Install Expo SDK

Official source: https://developers.apptrove.com/docs/expo-sdk/installation

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below for SDK-specific installation snippets.

## SDK-Specific Quick Setup[â](#sdk-specific-quick-setup "Direct link to SDK-Specific Quick Setup")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
npm install apptrove-expo-sdk
```

imports

```
import { AppTroveConfig, AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';
```

app.json

```
{
  "expo": {
    "plugins": ["./node_modules/apptrove-expo-sdk/app.plugin.js"]
  }
}
```

```
npm install trackier-expo-sdk
```

imports

```
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';
```

app.json

```
{
  "expo": {
    "plugins": ["./node_modules/trackier-expo-sdk/app.plugin.js"]
  }
}
```

This guide provides step-by-step instructions to install the Apptrove Expo SDK into your Expo application. It covers adding dependencies, configuring platform-specific settings, and setting up support for Google Advertising ID and deep linking.

---

## Installing the SDK[â](#installing-the-sdk "Direct link to Installing the SDK")

Install the Expo SDK using your preferred method: Via `npm`, or `yarn`.

### Method 1: Install using npm[â](#method-1-install-using-npm "Direct link to Method 1: Install using npm")

To install the SDK, run the following command in your project root:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
npm install apptrove-expo-sdk
```

```
npm install trackier-expo-sdk
```

**Package Information:**

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

- **NPM Package**: [apptrove-expo-sdk](https://www.npmjs.com/package/apptrove-expo-sdk)
- **Installation Command**: `npm i apptrove-expo-sdk`

- **NPM Package**: [trackier-expo-sdk](https://www.npmjs.com/package/trackier-expo-sdk)
- **Installation Command**: `npm i trackier-expo-sdk`

### Method 2: Install using yarn[â](#method-2-install-using-yarn "Direct link to Method 2: Install using yarn")

To install the SDK using yarn, run the following command in your project root:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
yarn add apptrove-expo-sdk
```

```
yarn add trackier-expo-sdk
```

note

Sync your project to download the SDK dependencies.

---

## Platform-Specific Configuration[â](#platform-specific-configuration "Direct link to Platform-Specific Configuration")

### Android Configuration[â](#android-configuration "Direct link to Android Configuration")

To support tracking features like Google Advertising ID, configure your Android project with the necessary dependencies and permissions.

#### Step 1: Add Google Advertising ID Dependency[â](#step-1-add-google-advertising-id-dependency "Direct link to Step 1: Add Google Advertising ID Dependency")

Expo provides built-in plugin support for auto-linking libraries. For Google Mobile Services (GMS), add the Trackier plugin to your `app.json` file:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
{
  "expo": {
    "plugins": [
      "./node_modules/apptrove-expo-sdk/app.plugin.js"
    ]
  }
}
```

```
{
  "expo": {
    "plugins": [
      "./node_modules/trackier-expo-sdk/app.plugin.js"
    ]
  }
}
```

After adding the plugin, run the following command to auto-link the GMS dependency:

```
npx expo prebuild
```

The GMS dependency will be automatically added to your `android/app/build.gradle` file:

```
dependencies {
    implementation "com.google.android.gms:play-services-ads-identifier:18.2.0"
}
```

note

After running `npx expo prebuild`, the GMS dependency will be automatically linked via Gradle. You can verify this by checking the `android/app/build.gradle` file.

#### Step 2: Update Gradle Properties (if needed)[â](#step-2-update-gradle-properties-if-needed "Direct link to Step 2: Update Gradle Properties (if needed)")

If your project uses a Gradle version lower than 7.0, update the `android/gradle.properties` file to include the following line to ensure compatibility:

```
android.jetifier.blacklist=moshi-1.13.0.jar
```

#### Step 3: Update Android Manifest[â](#step-3-update-android-manifest "Direct link to Step 3: Update Android Manifest")

In your `android/app/src/main/AndroidManifest.xml` file, add the following permission to support devices running Android 12 or later:

```
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

Add the Google Play Services version meta-data inside the `<application>` tag (if not already present):

```
<meta-data
    android:name="com.google.android.gms.version"
    android:value="@integer/google_play_services_version" />
```

#### Step 4: Sync Gradle[â](#step-4-sync-gradle "Direct link to Step 4: Sync Gradle")

Run the following command to sync the project with the updated Gradle configuration:

```
cd android && ./gradlew cleanBuildCache && cd ..
```

### iOS Configuration (Bare Workflow Only)[â](#ios-configuration-bare-workflow-only "Direct link to iOS Configuration (Bare Workflow Only)")

For iOS in bare workflow, install CocoaPods dependencies to ensure the SDK integrates correctly.

#### Step 1: Install iOS Dependencies[â](#step-1-install-ios-dependencies "Direct link to Step 1: Install iOS Dependencies")

Navigate to the `ios` folder in your project directory and install CocoaPods dependencies:

```
cd ios && pod install && cd ..
```

#### Step 2: Add iOS Permissions (if applicable)[â](#step-2-add-ios-permissions-if-applicable "Direct link to Step 2: Add iOS Permissions (if applicable)")

Open the `ios/[YourAppName]/Info.plist` file in Xcode or a text editor and add any required permissions:

```
<key>NSUserTrackingUsageDescription</key>
<string>We use tracking data to improve your app experience.</string>
```

### Expo Managed Workflow Configuration[â](#expo-managed-workflow-configuration "Direct link to Expo Managed Workflow Configuration")

For Expo managed workflow, the SDK is automatically configured and no additional setup is required. The SDK will work out of the box with Expo's build system.

---

## ProGuard Configuration[â](#proguard-configuration "Direct link to ProGuard Configuration")

If your app uses ProGuard for code optimization, add the following rules to your ProGuard configuration file (e.g., `proguard-rules.pro`) to prevent the removal of required classes:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
-keep class com.apptrove.sdk.** { *; }
-keep class com.google.android.gms.common.ConnectionResult {
    int SUCCESS;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
    com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
    java.lang.String getId();
    boolean isLimitAdTrackingEnabled();
}
-keep public class com.android.installreferrer.** { *; }
```

```
-keep class com.trackier.sdk.** { *; }
-keep class com.google.android.gms.common.ConnectionResult {
    int SUCCESS;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
    com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
    java.lang.String getId();
    boolean isLimitAdTrackingEnabled();
}
-keep public class com.android.installreferrer.** { *; }
```

---

## Next Steps[â](#next-steps "Direct link to Next Steps")

After completing the installation:

1. Initialize the SDK in your app (refer to the [Integrate SDK](/docs/expo-sdk/initialization) guide)
2. Test your integration to ensure proper tracking of installs, events, and other features
3. For assistance, contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com)
