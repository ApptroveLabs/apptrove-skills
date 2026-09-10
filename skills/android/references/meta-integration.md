# Meta Install Referrer Integration

Use this reference when integrating Apptrove Android SDK with Meta Install Referrer.

## Overview

Apptrove Android SDK supports Meta Install Referrer to collect attribution data from:

- Facebook campaigns
- Instagram campaigns
- Facebook Lite campaigns

Meta Install Referrer can provide:

- Attribution data from Meta campaigns
- View-through install data
- Multiple session click-through installs
- Enhanced campaign performance measurement

## Prerequisites

A Facebook App ID from Meta for Developers is required.

Before implementing the integration:

1. Create or select the application in Meta for Developers.
2. Obtain the Facebook App ID.
3. Ensure the Android package name configured in Meta matches the application's package name.
4. Ensure the required GPIR decryption configuration has been shared/configured with Apptrove where applicable.

## SDK Configuration

Use `AppTroveSDKConfig` when configuring the Apptrove SDK.

### Kotlin

```kotlin
val sdkConfig = AppTroveSDKConfig(
    this,
    SDK_KEY,
    "development"
)

// Configure Facebook App ID for Meta Install Referrer
sdkConfig.setFacebookAppId("YOUR_FACEBOOK_APP_ID")

AppTroveSDK.initialize(sdkConfig)
```

### Java

```java
AppTroveSDKConfig sdkConfig =
        new AppTroveSDKConfig(this, "YOUR_SDK_KEY", "development");

// Configure Facebook App ID for Meta Install Referrer
sdkConfig.setFacebookAppId("YOUR_FACEBOOK_APP_ID");

AppTroveSDK.initialize(sdkConfig);
```

Replace `YOUR_FACEBOOK_APP_ID` with the Facebook App ID from Meta for Developers.
Do not hardcode or commit any private Meta credentials or decryption secrets.

## Android Dependencies

Ensure the application module includes the dependencies required by the Apptrove
SDK and install referrer flow:

```gradle
dependencies {
    implementation "com.apptrove:android-sdk:2.0.1"
    implementation "com.android.installreferrer:installreferrer:2.2"
    implementation "com.google.android.gms:play-services-ads-identifier:18.0.1"
}
```

Do not add duplicate dependencies when they already exist in the application
module.

## Manifest Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

## Validation

- Facebook App ID matches the Android application configured in Meta.
- Application package name matches the package registered in Meta.
- `setFacebookAppId()` is called before `AppTroveSDK.initialize()`.
- GPIR decryption configuration is completed with Apptrove where required.
- Meta attribution is verified with a test install from a Meta campaign.