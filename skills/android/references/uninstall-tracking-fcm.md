# Apptrove Android SDK — Uninstall Tracking through FCM

This guide explains how to configure **uninstall tracking using Firebase Cloud Messaging (FCM)** with the Apptrove Android SDK.

FCM uninstall tracking uses the application's FCM token and FCM delivery status to identify app uninstallations.

> Uninstall detection is not immediate. Apptrove states that uninstall data typically appears in the panel within **24–48 hours**.

---

## 1. How It Works

The flow is:

```text
Android App
    ↓
Firebase Cloud Messaging
    ↓
FCM Token generated
    ↓
AppTroveSDK.sendFcmToken(token)
    ↓
Apptrove backend
    ↓
FCM silent notification
    ↓
Delivery failure after uninstall
    ↓
Apptrove identifies uninstall
    ↓
Uninstall appears in Apptrove Panel
```

Apptrove uses silent FCM notifications for uninstall measurement and inactive-user identification.

---

# 2. Prerequisites

Before implementing FCM uninstall tracking, verify:

```text
[ ] Firebase project exists
[ ] Firebase Cloud Messaging is enabled
[ ] Android application is connected to Firebase
[ ] google-services.json exists
[ ] Firebase SDK is integrated
[ ] Firebase Messaging dependency is available
[ ] Apptrove Android SDK is installed
[ ] Apptrove SDK is initialized
[ ] FCM token can be generated
```

The official documentation requires a Firebase project with Cloud Messaging enabled, Firebase integrated into the Android application, a properly initialized SDK, and token-management infrastructure.

---

# 3. Add Firebase Messaging Dependency

Open:

```text
app/build.gradle
```

or:

```text
app/build.gradle.kts
```

For Groovy:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging'
}
```

The Apptrove SDK should also already be present:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'com.apptrove:android-sdk:2.+'
}
```

Use the Firebase Messaging version/configuration appropriate for the project's existing Firebase setup.

Do not add a second Firebase dependency if Firebase Messaging is already configured.

The official Apptrove documentation lists Firebase Messaging together with the Apptrove SDK as the required dependencies.

---

# 4. Check Firebase Configuration

The agent should check whether:

```text
google-services.json
```

exists in the expected Android application location.

Typically:

```text
project/
└── app/
    ├── google-services.json
    └── build.gradle
```

If Firebase is already integrated, preserve the existing configuration.

Do not overwrite:

```text
google-services.json
```

---

# 5. Configure Firebase Messaging Service

Create or locate an existing Firebase messaging service.

Example:

```kotlin
package com.example.app

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.apptrove.sdk.AppTroveSDK

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)

        Log.d("FCM", "New FCM token: $token")

        AppTroveSDK.sendFcmToken(token)
    }
}
```

The critical Apptrove call is:

```kotlin
AppTroveSDK.sendFcmToken(token)
```

The official documentation uses `FirebaseMessagingService.onNewToken()` and sends the token to Apptrove using `AppTroveSDK.sendFcmToken(token)`.

---

# 6. Important: Existing FirebaseMessagingService

Before creating a new service, the AI agent must search the project for:

```text
FirebaseMessagingService
```

If an existing service is found:

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService()
```

do **not** create another service unnecessarily.

Instead, add:

```kotlin
AppTroveSDK.sendFcmToken(token)
```

to the existing `onNewToken()` implementation.

Example:

```kotlin
override fun onNewToken(token: String) {
    super.onNewToken(token)

    // Existing application logic
    updateApplicationToken(token)

    // Apptrove
    AppTroveSDK.sendFcmToken(token)
}
```

Preserve all existing FCM functionality.

---

# 7. AndroidManifest.xml

Register the Firebase Messaging service inside the `<application>` tag.

Example:

```xml
<application
    ...>

    <service
        android:name=".MyFirebaseMessagingService"
        android:exported="false">

        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>

    </service>

</application>
```

The official Apptrove documentation uses a `FirebaseMessagingService` registered with the `com.google.firebase.MESSAGING_EVENT` intent action.

### Important

The `<service>` must be inside:

```xml
<application>
```

It must not be placed directly under:

```xml
<manifest>
```

---

# 8. Application Initialization

Apptrove SDK initialization must already exist.

Example:

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        val sdkConfig =
            AppTroveSDKConfig(
                this,
                "YOUR_SDK_KEY",
                "production"
            )

        AppTroveSDK.initialize(sdkConfig)
    }
}
```

For troubleshooting, logging can be enabled:

```kotlin
sdkConfig.setLogLevel(Level.ALL)
```

The official documentation recommends enabling SDK logging during FCM token registration testing.

---

# 9. FCM Token Registration

The important implementation is:

```kotlin
override fun onNewToken(token: String) {
    super.onNewToken(token)

    AppTroveSDK.sendFcmToken(token)
}
```

The flow becomes:

```text
Firebase
   ↓
onNewToken(token)
   ↓
AppTroveSDK.sendFcmToken(token)
   ↓
Apptrove backend
```

---

# 10. FCM Token Behavior

The AI agent must understand that `onNewToken()` is **not called every time the application starts**.

FCM generates a token when:

```text
[ ] Application is installed
[ ] Firebase generates a new token
[ ] Application data is cleared
[ ] Application is restored on a new device
[ ] Application is uninstalled and reinstalled
[ ] Token is refreshed
```

The official documentation specifically notes that the token is generally generated on first installation or when Firebase generates a new token, rather than on every app launch.

Therefore:

**Do not assume `onNewToken()` will execute every time the application starts.**

---

# 11. Testing FCM Token Registration

Enable Apptrove SDK logging:

```kotlin
sdkConfig.setLogLevel(Level.ALL)
```

Run the application.

Open Android Studio Logcat.

Filter using:

```text
trackiersdk
```

or:

```text
apptrove
```

Look for:

```text
Fcm token Api response saved successfully
```

The official documentation identifies this message as the expected successful token-registration response.

---

# 12. Important Testing Behavior

If you already launched the application and the FCM token was generated, simply launching the application again may not generate another token.

For a clean token test:

```text
1. Uninstall application
        ↓
2. Reinstall application
        ↓
3. Launch application
        ↓
4. Check Logcat
        ↓
5. Verify FCM token
        ↓
6. Verify Apptrove token response
```

This behavior is expected because FCM does not generate a new token on every application launch.

---

# 13. Configure Firebase Console

FCM uninstall tracking also requires Firebase/Google Cloud configuration.

## Step 1 — Connect Application to Firebase

In Firebase Console:

```text
Firebase Console
    ↓
Create/select Firebase project
    ↓
Add Android application
    ↓
Configure Firebase
```

Then obtain the Firebase **Project ID**.

The official documentation instructs users to copy the Project ID from Firebase project settings.

---

# 14. Configure Apptrove Panel

In the Apptrove Panel:

```text
Settings
    ↓
Uninstall Tracking
```

Configure:

```text
Firebase Project ID
```

Then enable:

```text
Uninstall Tracking
```

The official documentation specifies the Firebase Project ID and uninstall-tracking toggle in the Apptrove Panel.

---

# 15. Enable Firebase Cloud Messaging API

In Google Cloud/Firebase:

```text
Cloud Messaging
```

Verify:

```text
Firebase Cloud Messaging API (V1)
```

is enabled.

If it is not enabled:

```text
Service Accounts
    ↓
Library
    ↓
Search:
Firebase Cloud Messaging API
    ↓
Enable
```

The official documentation requires the Firebase Cloud Messaging API (V1) to be enabled.

---

# 16. Create Apptrove Uninstall Role

Create a custom Google Cloud IAM role.

Use:

```text
Title:
Apptrove Uninstall
```

Use:

```text
ID:
at_uninstalls
```

Role launch stage:

```text
General availability
```

Add the permission:

```text
cloudmessaging.messages.create
```

The official Apptrove configuration requires this custom role and permission.

---

# 17. Assign Apptrove Service Account

In:

```text
IAM & Admin
    ↓
IAM
    ↓
Grant Access
```

Add the Apptrove production service account:

```text
at-uninstalls-tracking-tra-430@trackier-mmp.iam.gserviceaccount.com
```

Assign:

```text
Apptrove Uninstall
```

role.

The official documentation identifies this as the production service account for Apptrove uninstall tracking.

---

# 18. Development / Testing

For development testing, the official documentation also lists:

```text
mmp-dev@trackier-mmp.iam.gserviceaccount.com
```

as the testing service account.

Assign the same:

```text
Apptrove Uninstall
```

custom role when development testing is required.

---

# 19. End-to-End Flow

The complete implementation is:

```text
                    ANDROID APP
                         │
                         ▼
                 Firebase Messaging
                         │
                         ▼
                  FCM Token Generated
                         │
                         ▼
                 onNewToken(token)
                         │
                         ▼
             AppTroveSDK.sendFcmToken()
                         │
                         ▼
                  Apptrove Backend
                         │
                         ▼
                 Token Registered
                         │
                         ▼
             App is eventually uninstalled
                         │
                         ▼
              FCM delivery fails
                         │
                         ▼
              Apptrove detects uninstall
                         │
                         ▼
             Apptrove Panel / Reports
```

---

# 20. Agent Implementation Rules

The AI agent should follow these rules.

### Rule 1 — Check Firebase first

Search for:

```text
google-services.json
firebase
firebase-messaging
FirebaseMessagingService
```

before adding anything.

### Rule 2 — Reuse existing Firebase service

If a `FirebaseMessagingService` already exists, modify it instead of creating another service.

### Rule 3 — Do not duplicate token handling

If the project already contains:

```kotlin
AppTroveSDK.sendFcmToken(token)
```

do not add it again.

### Rule 4 — Preserve existing FCM logic

Do not remove:

```text
existing notification handling
existing token storage
existing server synchronization
existing analytics
```

### Rule 5 — Preserve the existing SDK initialization

Do not create a second:

```kotlin
AppTroveSDK.initialize()
```

### Rule 6 — Manifest service belongs inside `<application>`

Correct:

```xml
<application>

    <service ... />

</application>
```

Incorrect:

```xml
<manifest>

    <service ... />

</manifest>
```

### Rule 7 — Do not modify Firebase credentials

Never generate or replace:

```text
google-services.json
```

automatically.

### Rule 8 — Do not configure Firebase Console automatically

Firebase/IAM configuration requires the user's Google Cloud/Firebase environment and should be reported as a manual setup step.

---

# 21. Detection Checklist

The agent should check:

```text
FCM UNINSTALL TRACKING

Firebase:
[ ] google-services.json found
[ ] Firebase Messaging dependency found
[ ] Firebase configured

Messaging Service:
[ ] FirebaseMessagingService found
[ ] onNewToken() found
[ ] AppTroveSDK.sendFcmToken() found

Manifest:
[ ] FCM service registered
[ ] MESSAGING_EVENT intent found

Apptrove:
[ ] SDK dependency found
[ ] SDK initialization found

Panel:
[ ] Firebase Project ID configured
[ ] Uninstall Tracking enabled

Google Cloud:
[ ] FCM API enabled
[ ] Apptrove Uninstall role configured
[ ] Apptrove service account assigned
```

---

# 22. Expected Installation Result

### Already configured

```text
APPTROVE FCM UNINSTALL TRACKING

Firebase Messaging:
✓ Found

FirebaseMessagingService:
✓ Found

FCM Token:
✓ onNewToken() found

Apptrove:
✓ AppTroveSDK.sendFcmToken() found

Manifest:
✓ FCM service configured

Status:
✓ FCM uninstall tracking already configured
```

### Requires implementation

```text
APPTROVE FCM UNINSTALL TRACKING

Firebase Messaging:
✓ Found

FirebaseMessagingService:
✓ Found

FCM Token:
✗ AppTroveSDK.sendFcmToken() missing

Manifest:
✓ FCM service configured

Action:
Add AppTroveSDK.sendFcmToken(token)
to onNewToken().
```

---

# 23. Verification

After implementation:

```text
[ ] Application builds successfully
[ ] Firebase Messaging dependency resolves
[ ] Firebase service is registered
[ ] FCM token is generated
[ ] onNewToken() is triggered
[ ] AppTroveSDK.sendFcmToken(token) executes
[ ] Apptrove token response is successful
[ ] Firebase Project ID configured in Apptrove
[ ] Uninstall Tracking enabled
[ ] FCM API enabled
[ ] IAM permissions configured
```

Expected Logcat:

```text
Fcm token Api response saved successfully
```

The official documentation uses this message to verify successful token registration.

---

# 24. Test Uninstall Detection

Perform an end-to-end test:

```text
1. Install application
        ↓
2. Launch application
        ↓
3. Generate/register FCM token
        ↓
4. Verify Apptrove token response
        ↓
5. Uninstall application
        ↓
6. Wait 24–48 hours
        ↓
7. Open Apptrove Panel
        ↓
8. Check uninstall logs
```

Apptrove states that uninstall data typically takes **24–48 hours** to appear.

---

# 25. Troubleshooting

## FCM token is not received

Check:

```text
[ ] google-services.json exists
[ ] Firebase is correctly configured
[ ] Firebase Messaging dependency exists
[ ] FirebaseMessagingService is registered
[ ] onNewToken() exists
```

The official documentation specifically recommends checking Firebase configuration and `google-services.json`.

---

## AppTroveSDK.sendFcmToken() not called

Check:

```kotlin
override fun onNewToken(token: String) {
    super.onNewToken(token)

    AppTroveSDK.sendFcmToken(token)
}
```

Remember that `onNewToken()` does not execute on every application launch.

---

## Token is generated but Apptrove does not save it

Check:

```text
[ ] Apptrove SDK initialized
[ ] SDK key is correct
[ ] Internet connectivity available
[ ] Apptrove SDK logs enabled
```

Look for:

```text
Fcm token Api response saved successfully
```

---

## Uninstall is not detected

Check:

```text
[ ] FCM token successfully registered
[ ] Firebase Project ID is correct
[ ] Uninstall Tracking is enabled
[ ] Firebase Cloud Messaging API V1 enabled
[ ] Apptrove IAM role configured
[ ] Apptrove service account has permission
[ ] 24–48 hours have elapsed
```

---

# 26. Important Notes

### FCM tokens can change

The application must always forward newly generated tokens:

```kotlin
AppTroveSDK.sendFcmToken(token)
```

Do not store a token permanently and assume it will never change.

### Uninstall detection is delayed

Do not expect uninstall events immediately after removing the application.

Expected processing time:

```text
24–48 hours
```

### Silent notifications

Apptrove uses silent push notifications for uninstall measurement and inactive-user identification. These notifications are intended to be invisible to users.

### Security

FCM tokens should be handled securely and should not be unnecessarily exposed in application logs in production.

---

# 27. AI Agent Final Report

After implementation, the agent should produce:

```text
APPTROVE FCM UNINSTALL TRACKING

Firebase Messaging:
✓ Detected

FirebaseMessagingService:
✓ Detected

FCM Token Handling:
✓ onNewToken() detected

Apptrove Token Registration:
✓ AppTroveSDK.sendFcmToken(token) configured

Manifest:
✓ Firebase Messaging service configured

SDK:
✓ Apptrove SDK initialized

Status:
✓ FCM uninstall tracking configured

Manual configuration required:
- Firebase Project ID in Apptrove Panel
- Enable Uninstall Tracking
- Enable Firebase Cloud Messaging API
- Configure Apptrove IAM role
```

If already configured:

```text
APPTROVE FCM UNINSTALL TRACKING

Status:
✓ Already configured

No code changes were required.
```

If Firebase is missing:

```text
APPTROVE FCM UNINSTALL TRACKING

Status:
⚠ Firebase Messaging is not configured.

Required:
- Configure Firebase
- Add Firebase Messaging
- Add FirebaseMessagingService
- Register FCM token with Apptrove
```

---

# 28. Official Documentation

Apptrove Android SDK — FCM Uninstall Tracking:

https://developers.apptrove.com/docs/android-sdk/advance-features/uninstall-tracking-fcm
