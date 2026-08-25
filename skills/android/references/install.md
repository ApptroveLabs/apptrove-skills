# Apptrove Android SDK Installation

## Overview

This document describes how to integrate the Apptrove Android SDK into a native Android application.

The integration includes:

* Apptrove SDK Gradle dependency
* Required Android permissions
* Google Advertising ID configuration
* Google Play Services metadata
* Google Play Install Referrer
* Xiaomi GetApps Referrer
* ProGuard/R8 configuration
* SDK initialization

When modifying an existing Android application, make additive changes only. Preserve the application's existing configuration, activities, services, providers, permissions, deep links, and other SDK integrations.

---

## 1. Add Maven Central

Ensure Maven Central is configured in the project's repository configuration.

For Groovy Gradle:

```gradle
repositories {
    mavenCentral()
}
```

If `mavenCentral()` already exists, do not add it again.

---

## 2. Add Apptrove SDK Dependency

Add the Apptrove SDK dependency to the application module's `build.gradle`:

```gradle
dependencies {
    implementation 'com.apptrove:android-sdk:2.+'
}
```

For Kotlin DSL:

```kotlin
dependencies {
    implementation("com.apptrove:android-sdk:2.+")
}
```

Before adding the dependency, check whether an Apptrove dependency already exists.

Do not add duplicate dependencies.

---

## 3. Required Manifest Permissions

Locate:

```text
app/src/main/AndroidManifest.xml
```

Add the required permissions directly under the `<manifest>` element.

```xml
<uses-permission android:name="android.permission.INTERNET" />

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

Do not place permissions inside `<application>`.

Do not add a permission if it already exists.

### Optional READ_PHONE_STATE

If required by the integration:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

Do not add optional permissions unnecessarily.

---

## 4. Google Advertising ID

Add the Google Play Services Advertising ID dependency:

```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
}
```

Use the version supported by the project and current Apptrove documentation.

For Android 12 and higher, ensure the following permission exists:

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

---

## 5. Google Play Services Metadata

Add the following metadata inside the existing `<application>` element:

```xml
<meta-data
    android:name="com.google.android.gms.version"
    android:value="@integer/google_play_services_version" />
```

Example:

```xml
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MyApplication">

        <meta-data
            android:name="com.google.android.gms.version"
            android:value="@integer/google_play_services_version" />

    </application>

</manifest>
```

Important:

* `<meta-data>` must be inside `<application>`.
* Do not create a second `<application>` element.
* Do not place the metadata directly under `<manifest>`.
* Do not duplicate existing metadata.

---

## 6. Google Play Install Referrer

For Google Play attribution, add:

```gradle
dependencies {
    implementation 'com.android.installreferrer:installreferrer:2.2'
}
```

If the dependency already exists, do not add it again.

The Apptrove SDK uses the Install Referrer library for Google Play attribution.

---

## 7. Xiaomi GetApps Referrer

For Xiaomi GetApps attribution, add:

```gradle
dependencies {
    implementation 'com.miui.referrer:homereferrer:1.0.0.6'
}
```

Only add this dependency when Xiaomi GetApps attribution is required.

Do not add duplicate dependencies.

---

## 8. SDK Initialization

The Apptrove SDK must be initialized from the application's `Application.onCreate()`.

Example in Kotlin:

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        val sdkConfig = AppTroveSDKConfig(
            this,
            SDK_KEY,
            "development"
        )

        AppTroveSDK.initialize(sdkConfig)
    }
}
```

Environment values:

```text
development
testing
production
```

Use the environment configured for the application.

### Existing Application Class

If the project already has an `Application` class:

* Reuse the existing class.
* Do not create a second `Application` class unnecessarily.
* Preserve the existing `onCreate()` implementation.
* Add Apptrove initialization without removing existing initialization logic.
* Ensure `super.onCreate()` remains present.

### Application Class Not Declared

If the project has an existing Application class but it is not declared in the manifest, add:

```xml
<application
    android:name=".MyApplication">
```

Do not replace an existing `android:name` value without understanding the existing application architecture.

---

## 9. ProGuard / R8

If the application uses R8 or ProGuard, include the required Apptrove rules.

```proguard
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

Do not duplicate rules that are already present.

---

## 10. Existing Client Project

Client applications may already contain:

* Multiple activities
* Multiple intent filters
* Deep links
* Firebase services
* Other attribution SDKs
* Existing permissions
* Existing metadata
* Existing ProGuard rules
* Custom `Application` classes

The Apptrove integration must be additive.

### Example

If the manifest already contains:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

do not add another one.

If this metadata already exists:

```xml
<meta-data
    android:name="com.google.android.gms.version"
    android:value="@integer/google_play_services_version" />
```

do not add another copy.

---

## 11. Manifest Modification Rules

When modifying `AndroidManifest.xml`:

### Permissions

Permissions belong directly under `<manifest>`:

```xml
<manifest>

    <uses-permission ... />

    <application>
        ...
    </application>

</manifest>
```

### Metadata

Metadata belongs inside `<application>`:

```xml
<application>

    <meta-data
        android:name="..."
        android:value="..." />

</application>
```

Never produce:

```xml
<manifest>

    <application>
        ...
    </application>

    <uses-permission ... />

</manifest>
```

or:

```xml
<manifest>

    <meta-data ... />

</manifest>
```

---

## 12. Deep Links

Do not modify or replace existing deep-link intent filters during the basic SDK installation.

Client applications may already have:

* HTTPS App Links
* Custom URL schemes
* Firebase Dynamic Links
* Other attribution/deep-link integrations

Deep-link configuration should be handled separately using the Apptrove deep-link integration instructions.

Existing intent filters must be preserved.

---

## 13. Installation Validation

After installation, validate:

### Gradle

* Maven Central is available.
* Apptrove SDK dependency exists.
* Google Advertising ID dependency exists when required.
* Google Play Install Referrer exists when required.
* Xiaomi referrer exists when required.
* No duplicate dependencies exist.

### Manifest

Verify:

```text
INTERNET
ACCESS_NETWORK_STATE
ACCESS_WIFI_STATE
AD_ID
```

when applicable.

Verify:

```xml
<meta-data
    android:name="com.google.android.gms.version"
    android:value="@integer/google_play_services_version" />
```

is inside `<application>`.

### Application

Verify:

* Application class exists.
* `onCreate()` exists.
* `super.onCreate()` is preserved.
* `AppTroveSDK.initialize()` exists.
* SDK is initialized only once.
* Existing application initialization code is preserved.

### Project Integrity

Verify:

* Existing activities remain unchanged.
* Existing services remain unchanged.
* Existing providers remain unchanged.
* Existing deep links remain unchanged.
* Existing permissions remain unchanged.
* Existing SDK configurations remain unchanged.

---

## 14. Idempotency

The installation must be idempotent.

Running the installation multiple times must not create duplicate configuration.

For example:

```text
First run:
✓ Apptrove dependency added
✓ Application initialization added
✓ Manifest configuration added

Second run:
✓ Apptrove dependency already exists
✓ Application initialization already exists
✓ Manifest configuration already exists
```

The second installation should not modify files unnecessarily.

---

## 15. Expected Installation Result

A successful installation should report:

```text
Apptrove Android SDK Installation

✓ SDK dependency
✓ Required dependencies
✓ Manifest permissions
✓ Google Play Services metadata
✓ SDK initialization
✓ ProGuard/R8 configuration

Installation completed successfully.
```

If configuration already exists:

```text
✓ Apptrove SDK dependency already exists
✓ Required permissions already exist
✓ Google Play Services metadata already exists
✓ SDK initialization already exists
```

Existing correct configuration should be treated as success.

---

## 16. AI Agent Instructions

When an AI coding agent is asked to install Apptrove Android SDK:

1. Detect the Android project structure.
2. Identify the application module.
3. Locate the module-level Gradle file.
4. Locate `AndroidManifest.xml`.
5. Identify the existing `Application` class.
6. Inspect existing Gradle dependencies.
7. Inspect existing manifest permissions.
8. Inspect existing application metadata.
9. Inspect existing SDK initialization.
10. Make only the required changes.
11. Preserve existing application code.
12. Preserve existing manifest configuration.
13. Preserve existing deep links.
14. Avoid duplicate dependencies.
15. Avoid duplicate permissions.
16. Avoid duplicate metadata.
17. Validate the resulting configuration.
18. Report what was changed and what was already configured.

Do not blindly overwrite project files.

Do not create duplicate Application classes.

Do not remove existing integrations.

---

## 17. Completion Criteria

The Android SDK installation is considered complete when:

```text
✓ Apptrove dependency configured
✓ Required dependencies configured
✓ Required manifest permissions configured
✓ Google Play Services metadata configured
✓ Application initialization configured
✓ Existing application configuration preserved
✓ Existing manifest configuration preserved
✓ Existing deep links preserved
✓ No duplicate configuration exists
✓ Project is ready for the next Apptrove integration step
```
