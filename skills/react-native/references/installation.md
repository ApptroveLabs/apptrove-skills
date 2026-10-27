# Install React Native SDK

Official source: https://developers.apptrove.com/docs/react-native-sdk/installation

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view installation instructions for your chosen SDK.

This section provides detailed instructions for installing the Apptrove React Native SDK in your React Native project, enabling tracking of user interactions, attribution, and campaign analytics for Android and iOS platforms. The installation process involves adding the SDK package, installing dependencies, and configuring platform-specific settings to support features like Google Advertising ID.

### Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- React Native 0.60 or later
- Node.js and npm for package management
- A Apptrove MMP account with access to the Apptrove Panel
- For Android:
  - Android API 21 (Android 5.0) or later
  - Gradle for dependency management
- For iOS:
  - iOS 10.0 or later
  - Xcode 12.0 or later
  - CocoaPods for dependency management
- Internet connection for downloading the SDK package

### Add Apptrove SDK to Your App[â](#add-apptrove-sdk-to-your-app "Direct link to Add Apptrove SDK to Your App")

To integrate the Apptrove React Native SDK, install the SDK package using npm and configure dependencies for both Android and iOS platforms.

#### Step 1: Install the SDK Package[â](#step-1-install-the-sdk-package "Direct link to Step 1: Install the SDK Package")

1. Open a terminal in your React Native project root directory.
2. Run the command for your chosen SDK (see tabs below).

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
npm install react-native-apptrove
```

**Package Information:**

- **NPM Package**: [react-native-apptrove](https://www.npmjs.com/package/react-native-apptrove) (check npm for latest)
- **Installation Command**: `npm i react-native-apptrove`

note

**Package:** `react-native-apptrove` Â· Use the latest v2.x version for Apptrove SDK.

Deprecation Warning

**Trackier SDK will be deprecated in August 2026**

Please migrate to Apptrove SDK before August 2026.

```
npm install react-native-trackier
```

Alternatively, install from the GitHub repository:

```
npm install trackier/react-native-sdk
```

**Package Information:**

- **NPM Package**: [react-native-trackier](https://www.npmjs.com/package/react-native-trackier)
- **Installation Command**: `npm i react-native-trackier`

note

**Package:** `react-native-trackier` Â· Latest v1.x (deprecating August 2026).

#### Step 2: Install iOS Dependencies[â](#step-2-install-ios-dependencies "Direct link to Step 2: Install iOS Dependencies")

For iOS, install CocoaPods dependencies to ensure the SDK integrates correctly.

1. Navigate to the `ios` folder in your project directory:

```
cd ios
```

1. Install CocoaPods dependencies:

```
pod install
```

1. Return to the project root directory:

```
cd ..
```

#### Expected Outcome[â](#expected-outcome "Direct link to Expected Outcome")

The SDK will be added to your project's `node_modules`, and iOS dependencies will be installed in the `ios/Pods` directory. The project is now ready for platform-specific configurations.

### Update Android Configuration[â](#update-android-configuration "Direct link to Update Android Configuration")

To support tracking features like Google Advertising ID, configure your Android project with the necessary dependencies and permissions.

#### Step 1: Add Google Advertising ID Dependency[â](#step-1-add-google-advertising-id-dependency "Direct link to Step 1: Add Google Advertising ID Dependency")

1. Open the `android/app/build.gradle` file.
2. Add the Google Play Services Ads Identifier dependency to the `dependencies` section:

```
dependencies {
    implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
}
```

#### Step 2: Update Gradle Properties (if needed)[â](#step-2-update-gradle-properties-if-needed "Direct link to Step 2: Update Gradle Properties (if needed)")

If your project uses a Gradle version lower than 7.0, update the `android/gradle.properties` file to include the following line to ensure compatibility:

```
android.jetifier.blacklist=moshi-1.13.0.jar
```

#### Step 3: Update Android Manifest[â](#step-3-update-android-manifest "Direct link to Step 3: Update Android Manifest")

1. Open the `android/app/src/main/AndroidManifest.xml` file.
2. Add the following permission to support devices running Android 12 or later:

```
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

1. Add the Google Play Services version meta-data inside the `<application>` tag (if not already present):

```
<meta-data
    android:name="com.google.android.gms.version"
    android:value="@integer/google_play_services_version" />
```

#### Step 4: Sync Gradle[â](#step-4-sync-gradle "Direct link to Step 4: Sync Gradle")

1. Open the `android` directory in a terminal:

```
cd android
```

1. Run the following command to sync the project with the updated Gradle configuration:

```
./gradlew cleanBuildCache
```

1. Return to the project root directory:

```
cd ..
```

### Update iOS Configuration[â](#update-ios-configuration "Direct link to Update iOS Configuration")

note

The React Native SDK README specifies only CocoaPods installation for iOS. Additional configurations (e.g., Info.plist updates for permissions) are not detailed. Provide specific details to refine this section.

To ensure proper iOS integration, verify the CocoaPods setup and apply any necessary project configurations.

#### Step 1: Verify CocoaPods Installation[â](#step-1-verify-cocoapods-installation "Direct link to Step 1: Verify CocoaPods Installation")

1. Confirm that the `pod install` command completed successfully, creating a `Podfile.lock` file in the `ios` directory.
2. Open the `.xcworkspace` file in Xcode (not `.xcodeproj`) to build the iOS project.

#### Step 2: Add iOS Permissions (if applicable)[â](#step-2-add-ios-permissions-if-applicable "Direct link to Step 2: Add iOS Permissions (if applicable)")

note

Add specific iOS configurations (e.g., `NSUserTrackingUsageDescription` for App Tracking Transparency) if required.

1. Open the `ios/[YourAppName]/Info.plist` file in Xcode or a text editor.
2. Add any required permissions, such as:

```
<key>NSUserTrackingUsageDescription</key>
<string>We use tracking data to improve your app experience.</string>
```

1. Save the file and rebuild the iOS project.

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Use the Latest SDK Version**: Regularly check for updates to your Apptrove React Native SDK package on npm to ensure compatibility and access to new features.
- **Backup Your Project**: Save a backup of your React Native project before installing the SDK to prevent data loss.
- **Verify Dependency Installation**: Confirm that the SDK exists in `node_modules` and that iOS Pods are installed correctly.
- **Test Platform Configurations**: Build and test on both Android and iOS to ensure the SDK and Google Advertising ID configurations work as expected.
- **Secure Manifest Files**: Store `AndroidManifest.xml` changes in version control and avoid exposing sensitive data.

### Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **NPM Installation Fails**:
  - Ensure you have an active internet connection and the correct npm version.
  - Run `npm cache clean --force` and retry the install command for your chosen SDK package.
- **CocoaPods Installation Fails**:
  - Verify that CocoaPods is installed (`pod --version`) and up to date (`gem install cocoapods`).
  - Check for errors in the terminal output during `pod install` and resolve dependency conflicts.
- **Google Advertising ID Not Retrieved**:
  - Confirm the `com.google.android.gms:play-services-ads-identifier` dependency is correctly added in `build.gradle`.
  - Ensure the `com.google.android.gms.permission.AD_ID` permission is included in `AndroidManifest.xml` for Android 12+ devices.
- **Build Errors on Android/iOS**:
  - Check Gradle sync errors in Android Studio or terminal output.
  - For iOS, ensure you're opening the `.xcworkspace` file in Xcode.
    For further assistance, refer to the [Apptrove Documentation Portal](https://help.apptrove.com/en/) or contact support at [support@apptrove.com](mailto:support@apptrove.com).
