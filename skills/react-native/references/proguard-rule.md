# ProGuard Configuration

Official source: https://developers.apptrove.com/docs/react-native-sdk/security/proguard-rule

---

On this page

ProGuard is a tool used in Android release builds to optimize, shrink, and obfuscate code, reducing app size and enhancing security. To ensure the Apptrove React Native SDK and its dependencies function correctly when ProGuard is enabled, specific rules must be added to prevent critical classes and methods from being removed or renamed. This section outlines how to configure ProGuard rules for your Android app.

### Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- Apptrove React Native SDK installed and initialized in your project
- A Apptrove MMP account with access to the Apptrove Panel
- React Native 0.60 or later
- Android API 21 (Android 5.0) or later
- ProGuard enabled for release builds in your Android project
- Basic knowledge of Android build configurations and ProGuard

### Configure ProGuard Rules[â](#configure-proguard-rules "Direct link to Configure ProGuard Rules")

To maintain the functionality of the Apptrove SDK and its dependencies in optimized builds, add the required ProGuard rules to your project's ProGuard configuration file.

#### Step 1: Add ProGuard Rules[â](#step-1-add-proguard-rules "Direct link to Step 1: Add ProGuard Rules")

1. Locate or create the ProGuard configuration file in your Android project, typically at `android/app/proguard-rules.pro`.
2. Add the following rules to preserve Apptrove SDK classes and dependencies. For the SDK keep rule: use `com.apptrove.sdk` for **Apptrove SDK**, or `com.trackier.sdk` for **Trackier SDK**.

android/app/proguard-rules.pro

```
# Use com.apptrove.sdk (Apptrove) or com.trackier.sdk (Trackier):
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
-keep class kotlin.Metadata { *; }
-keep class kotlin.reflect.jvm.internal.** { *; }
-keep class kotlin.** { *; }
-dontwarn kotlin.**
```

note

Replace `com.apptrove.sdk` with `com.trackier.sdk` in the first `-keep` line if you are using the Trackier SDK.

#### Step 2: Enable ProGuard in Android Build[â](#step-2-enable-proguard-in-android-build "Direct link to Step 2: Enable ProGuard in Android Build")

1. Open the `android/app/build.gradle` file in your React Native project.
2. Ensure ProGuard is enabled for release builds by verifying or adding the following configuration in the `buildTypes` section:

```
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

#### Step 3: Test the Release Build[â](#step-3-test-the-release-build "Direct link to Step 3: Test the Release Build")

1. Build the Android release APK using the following command in the project root directory:

```
cd android && ./gradlew assembleRelease
```

1. Install the APK on a device or emulator.
2. Test Apptrove SDK features (e.g., event tracking, deep linking) to ensure they function correctly in the optimized build.

#### Expected Outcome[â](#expected-outcome "Direct link to Expected Outcome")

The Apptrove SDK and its dependencies will remain fully functional in the optimized release build, with no critical classes or methods removed by ProGuard. Tracking data will continue to be sent to the Apptrove MMP without issues, verifiable in the Apptrove Panel.

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Test ProGuard Rules**: Build and test the release APK with ProGuard enabled in a development environment to verify SDK functionality before deploying to production.
- **Backup ProGuard Files**: Commit `proguard-rules.pro` to version control to track changes and ensure consistency across builds.
- **Monitor Build Logs**: Check Android build logs for ProGuard-related warnings or errors that may affect the SDK.
- **Use Default Proguard Files**: Include the default `proguard-android-optimize.txt` file in `build.gradle` to leverage Android's standard optimizations alongside Apptrove's rules.
- **Validate SDK Functionality**: After applying Proguard rules, test key SDK features like event tracking and deep linking to confirm they work as expected.
- **Keep Rules Updated**: Check for updates to Apptrove SDK ProGuard rules in the [Apptrove Documentation Portal](https://help.apptrove.com/en/) as new SDK versions are released.

### Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **SDK Features Not Working in Release Build**:
  - Confirm all required ProGuard rules are added to `proguard-rules.pro` without modifications.
  - Check build logs for warnings about missing classes or methods related to `com.apptrove.sdk`, `com.trackier.sdk`, or Google Play Services.
  - Temporarily set `minifyEnabled false` in `build.gradle` to isolate ProGuard-related issues.
- **Build Errors with ProGuard**:
  - Verify the syntax of the ProGuard rules in `proguard-rules.pro` for typos or formatting errors.
  - Ensure the `proguardFiles` line in `build.gradle` correctly references `proguard-rules.pro`.
- **Tracking Data Not Appearing in Apptrove Panel**:
  - Test the release APK to ensure the SDK is initialized and tracking events correctly.
  - Confirm the app token and environment match the Apptrove Panel configuration.

For further assistance, refer to the [Apptrove Documentation Portal](https://help.apptrove.com/en/) or contact support at [support@apptrove.com](mailto:support@apptrove.com).
