# ProGuard Configuration

Official source: https://developers.apptrove.com/docs/expo-sdk/security/proguard-rule

---

On this page

Proguard is a code optimization and obfuscation tool that reduces app size and enhances security for Android release builds. This guide provides the necessary Proguard rules to ensure the Apptrove Expo SDK functions correctly while maintaining security and performance.

---

## Purpose[â](#purpose "Direct link to Purpose")

Proguard settings are essential for:

- **Code Optimization**: Reduces app size by removing unused code
- **Security Enhancement**: Obfuscates code to prevent reverse engineering
- **Performance**: Improves app performance through code optimization
- **SDK Compatibility**: Ensures the Apptrove SDK functions correctly in release builds

---

## Proguard Configuration[â](#proguard-configuration "Direct link to Proguard Configuration")

### Step 1: Locate Proguard Configuration File[â](#step-1-locate-proguard-configuration-file "Direct link to Step 1: Locate Proguard Configuration File")

The Proguard configuration file is typically located at:

- `android/app/proguard-rules.pro` (for most projects)
- `android/app/build.gradle` (if rules are defined inline)

### Step 2: Add Proguard Rules[â](#step-2-add-proguard-rules "Direct link to Step 2: Add Proguard Rules")

Add the following rules to your Proguard configuration file:

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
-keep class kotlin.Metadata { *; }
-keep class kotlin.reflect.jvm.internal.** { *; }
-keep class kotlin.** { *; }
-dontwarn kotlin.**
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
-keep class kotlin.Metadata { *; }
-keep class kotlin.reflect.jvm.internal.** { *; }
-keep class kotlin.** { *; }
-dontwarn kotlin.**
```

### Step 3: Enable Proguard in Build Configuration[â](#step-3-enable-proguard-in-build-configuration "Direct link to Step 3: Enable Proguard in Build Configuration")

Ensure Proguard is enabled in your `android/app/build.gradle` file:

```
android {
    // ... other configurations

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## Testing Proguard Configuration[â](#testing-proguard-configuration "Direct link to Testing Proguard Configuration")

### Step 1: Build Release Version[â](#step-1-build-release-version "Direct link to Step 1: Build Release Version")

Build your app in release mode to test Proguard configuration:

```
cd android
./gradlew assembleRelease
```

### Step 2: Test SDK Functionality[â](#step-2-test-sdk-functionality "Direct link to Step 2: Test SDK Functionality")

After building, test the following SDK features:

1. **SDK Initialization**: Ensure the SDK initializes without errors
2. **Event Tracking**: Test tracking events in release build
3. **Deep Linking**: Verify deep linking functionality
4. **Uninstall Tracking**: Test uninstall tracking integration

### Step 3: Check for Issues[â](#step-3-check-for-issues "Direct link to Step 3: Check for Issues")

Look for these common issues:

- **ClassNotFoundException**: Missing Proguard rules for required classes
- **MethodNotFoundException**: Missing rules for specific methods
- **Runtime Errors**: SDK functionality not working in release build

---

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Common Issues[â](#common-issues "Direct link to Common Issues")

**Problem**: SDK not working in release build
**Solution**: Check that all required classes are kept in Proguard rules

**Problem**: Advertising ID not available
**Solution**: Ensure Google Play Services rules are included

**Problem**: Deep linking not working
**Solution**: Verify that all SDK classes are preserved

**Problem**: Build errors with Proguard
**Solution**: Check for conflicting rules or missing dependencies

### Debug Steps[â](#debug-steps "Direct link to Debug Steps")

1. **Enable Proguard Logging**: Add `-printmapping mapping.txt` to see what's being removed
2. **Check Build Logs**: Review build output for warnings and errors
3. **Test Incrementally**: Add rules one by one to identify issues
4. **Verify Dependencies**: Ensure all required dependencies are included

---

## Best Practices[â](#best-practices "Direct link to Best Practices")

- **Test Thoroughly**: Always test Proguard configuration in release builds
- **Keep Rules Minimal**: Only keep classes that are actually needed
- **Monitor App Size**: Check that Proguard is reducing app size as expected
- **Update Regularly**: Keep Proguard rules updated with SDK updates
- **Document Changes**: Keep track of any custom Proguard rules you add

---

## Next Steps[â](#next-steps "Direct link to Next Steps")

After configuring Proguard:

1. Test your app in release mode to ensure all features work
2. Monitor app size and performance improvements
3. For assistance, contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com)
