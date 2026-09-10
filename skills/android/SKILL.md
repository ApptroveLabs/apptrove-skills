# AppTrove Android SDK Integration Skill

## Objective

Integrate the AppTrove Android SDK (`com.apptrove:android-sdk`) into an Android app for attribution, events, and deep linking.

## Project Analysis

Inspect:

- `settings.gradle` / `settings.gradle.kts`
- `app/build.gradle` / `app/build.gradle.kts`
- `app/src/main/AndroidManifest.xml`
- Application class referenced by `android:name` on `<application>`

Identify package name, application ID, Kotlin vs Java, and whether minify/ProGuard is enabled.

## SDK Dependencies

In `app/build.gradle`:

```gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation "com.apptrove:android-sdk:2.0.1"
    implementation "com.android.installreferrer:installreferrer:2.2"
    implementation "com.google.android.gms:play-services-ads-identifier:18.0.1"
}
```

Do **not** use `com.apptrove:sdk` or `com.apptrove:apptrove-sdk` — the published artifact is `com.apptrove:android-sdk`.

## Manifest Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

Register the Application class:

```xml
<application android:name=".MainApplication" ...>
```

## SDK Initialization

Package: `com.apptrove.sdk`  
Classes: `AppTroveSDK`, `AppTroveSDKConfig`

### Kotlin

```kotlin
import com.apptrove.sdk.AppTroveSDK
import com.apptrove.sdk.AppTroveSDKConfig

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val sdkConfig = AppTroveSDKConfig("YOUR_APP_TOKEN", "development")
        // Optional SDK signing (from dashboard Advanced → Add secret key):
        // sdkConfig.setAppSecret("secretId", "secretKey")
        // Optional deferred deep link:
        // sdkConfig.setDeepLinkListener(listener)
        AppTroveSDK.initialize(sdkConfig)
    }
}
```

### Java

```java
import com.apptrove.sdk.AppTroveSDK;
import com.apptrove.sdk.AppTroveSDKConfig;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        AppTroveSDKConfig sdkConfig = new AppTroveSDKConfig(this, "YOUR_APP_TOKEN", "development");
        AppTroveSDK.initialize(sdkConfig);
    }
}
```

Environment values: `"development"`, `"production"`, `"testing"` (also `"sandbox"` in constants).

## Events

```kotlin
val event = AppTroveEvent(AppTroveEvent.LOGIN) // or PURCHASE, ADD_TO_CART, etc.
AppTroveSDK.trackEvent(event)
```

## Deep Links

Add intent-filter on the activity that should open:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="YOUR_SUBDOMAIN.u9ilnk.me" />
</intent-filter>
```

In the activity:

```java
Uri data = getIntent().getData();
if (data != null) {
    AppTroveSDK.parseDeepLink(data);
}
```

Deferred: `sdkConfig.setDeepLinkListener(deepLinkListener)` before `initialize`.

## Push / FCM

Obtain FCM token yourself, then:

```kotlin
AppTroveSDK.sendFcmToken(token)
```

## Install ID / Uninstall tracking

```kotlin
val id = AppTroveSDK.getAppTroveId() // not getTrackierId()
```

## ProGuard

```
-keep class com.apptrove.sdk.** { *; }
```

## Validation Checklist

- [ ] Dependency `com.apptrove:android-sdk:2.0.1` present
- [ ] Install referrer + ads-identifier deps present
- [ ] Application registered + `AppTroveSDK.initialize(config)` called
- [ ] Permissions include INTERNET + AD_ID
- [ ] Deep link intent-filter configured (if using links)
- [ ] App token replaced (not placeholder)

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
