# Android Uninstall Tracking with FCM

Official source: https://developers.apptrove.com/docs/react-native-sdk/advance-features/uninstall-tracking-fcm

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view FCM uninstall tracking code for your chosen SDK.

Firebase Cloud Messaging (FCM) uninstall tracking detects app uninstalls by monitoring FCM delivery receipts. This method is ideal for React Native apps that already use push notifications.

## How FCM Uninstall Tracking Works[â](#how-fcm-uninstall-tracking-works "Direct link to How FCM Uninstall Tracking Works")

- **Purpose**: Tracks app uninstalls using FCM delivery receipts to assess user engagement and campaign performance
- **Mechanism**: Uses FCM to send silent push notifications and monitors delivery receipts for failed deliveries
- **Detection**: Uninstall data typically appears in the panel within 24-48 hours
- **Use Case**: Measure uninstall rates for campaigns to refine targeting and improve user retention

Alternative Method

For Firebase Analytics-based uninstall tracking, see [Through Firebase Analytics](/docs/react-native-sdk/advance-features/track-uninstall).

## Prerequisites[â](#prerequisites "Direct link to Prerequisites")

Before implementing FCM uninstall tracking, ensure you have:

- **Firebase project** with Cloud Messaging enabled
- **React Native app** with Firebase SDK integrated
- **Apptrove SDK** properly initialized (Apptrove v2.0.0+ or Trackier v1.x)
- **@react-native-firebase** packages installed (version 23.5.0+)
- **Android platform** (FCM uninstall tracking is Android-only)

## Implementation[â](#implementation "Direct link to Implementation")

### 1. Add Dependencies[â](#1-add-dependencies "Direct link to 1. Add Dependencies")

Add Firebase packages to your project:

```
npm install @react-native-firebase/app @react-native-firebase/messaging
```

**package.json:** Use `react-native-apptrove` (Apptrove) or `react-native-trackier` (Trackier) per your SDK.

```
{
  "dependencies": {
    "@react-native-firebase/app": "^23.5.0",
    "@react-native-firebase/messaging": "^23.5.0",
    "react-native-apptrove": "^2.0.0"
  }
}
```

Latest Version

Check the [React Native Firebase](https://rnfirebase.io/) documentation for the latest version and setup instructions.

### 2. Configure Firebase[â](#2-configure-firebase "Direct link to 2. Configure Firebase")

#### Android Configuration[â](#android-configuration "Direct link to Android Configuration")

**android/build.gradle:**

```
buildscript {
  dependencies {
    classpath("com.google.gms:google-services:4.4.0")
  }
}
```

**android/app/build.gradle:**

```
apply plugin: "com.google.gms.google-services"
```

Download `google-services.json` from Firebase Console and place it in `android/app/` directory.

### 3. Initialize FCM[â](#3-initialize-fcm "Direct link to 3. Initialize FCM")

Create the FCM initialization function in your `App.js`:

Important FCM Token Behavior

**FCM tokens are generated only once** when the app is first installed or when Firebase generates a new token. If you run the app once and don't see the token in logs, you won't see it again on subsequent runs. To see the token again, you need to:

1. **Uninstall the app completely**
2. **Reinstall the app**
3. **Check logs immediately** for the token

This is normal FCM behavior - tokens are not generated on every app launch, only when:

- App is first installed
- Firebase generates a new token (rare)
- App data is cleared
- App is restored on a new device

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove';
import messaging from '@react-native-firebase/messaging';
import { getApp, getApps } from '@react-native-firebase/app';

const App = () => {
  const initializeFCM = async () => {
    if (Platform.OS !== 'android') return;
    try {
      const apps = getApps();
      if (apps.length === 0) return;
      const app = getApp();
      const messagingInstance = messaging(app);
      const authStatus = await messagingInstance.requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        messagingInstance.onTokenRefresh((newToken) => {
          console.log('FCM token refreshed:', newToken);
          ApptroveSDK.sendFcmToken(newToken);
        });
      }
    } catch (error) {
      console.log('Error initializing FCM:', error);
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const apptroveConfig = new ApptroveConfig('YOUR_SDK_KEY', ApptroveConfig.EnvironmentDevelopment);
        ApptroveSDK.initialize(apptroveConfig);
        if (Platform.OS === 'android') {
          try { await initializeFCM(); } catch (fcmError) { console.log('Error initializing FCM:', fcmError); }
        }
      } catch (error) {
        console.error('Error initializing SDK:', error);
      }
    };
    initializeSDK();
  }, []);

  return (/* Your app components */);
};

export default App;
```

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import messaging from '@react-native-firebase/messaging';
import { getApp, getApps } from '@react-native-firebase/app';

const App = () => {
  const initializeFCM = async () => {
    if (Platform.OS !== 'android') return;
    try {
      const apps = getApps();
      if (apps.length === 0) return;
      const app = getApp();
      const messagingInstance = messaging(app);
      const authStatus = await messagingInstance.requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        messagingInstance.onTokenRefresh((newToken) => {
          console.log('FCM token refreshed:', newToken);
          TrackierSDK.sendFcmToken(newToken);
        });
      }
    } catch (error) {
      console.log('Error initializing FCM:', error);
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const trackierConfig = new TrackierConfig('YOUR_SDK_KEY', TrackierConfig.EnvironmentDevelopment);
        TrackierSDK.initialize(trackierConfig);
        if (Platform.OS === 'android') {
          try { await initializeFCM(); } catch (fcmError) { console.log('Error initializing FCM:', fcmError); }
        }
      } catch (error) {
        console.error('Error initializing Trackier SDK:', error);
      }
    };
    initializeSDK();
  }, []);

  return (/* Your app components */);
};

export default App;
```

FCM Token Behavior

- **Token Generation**: FCM tokens are generated when the app is first installed or when the token is refreshed
- **Token Refresh**: Tokens can change when: app is restored on a new device, app data is cleared, app is uninstalled and reinstalled, or token expires (rare)
- **One-Time Call**: The `onTokenRefresh` listener is called only when a new token is generated, not on every app launch
- **SDK Integration**: Call `ApptroveSDK.sendFcmToken(newToken)` or `TrackierSDK.sendFcmToken(newToken)` when the token is generated or refreshed (similar to Android's `onNewToken()`)

### 4. Firebase Console Configuration[â](#4-firebase-console-configuration "Direct link to 4. Firebase Console Configuration")

#### Step 1: Connect Product to Firebase[â](#step-1-connect-product-to-firebase "Direct link to Step 1: Connect Product to Firebase")

If you haven't already connected your product to Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add your Android app to the project
4. After setting up the project on console, go to **Settings**
5. In the **General** tab, see the **Project ID** and copy it

#### Step 2: Configure in Apptrove Panel[â](#step-2-configure-in-apptrove-panel "Direct link to Step 2: Configure in Apptrove Panel")

1. Go to your **Apptrove panel**
2. Navigate to **Settings** page
3. Go to **Uninstall Tracking** tab
4. Paste the **Project ID** you copied from Firebase Console
5. **Enable the toggle** for uninstall tracking

#### Step 3: Enable Cloud Messaging API[â](#step-3-enable-cloud-messaging-api "Direct link to Step 3: Enable Cloud Messaging API")

1. Go to the **Cloud Messaging** tab
2. Check if **Firebase Cloud Messaging API (V1)** is enabled

If not enabled:

1. Go to **Service accounts** tab

2. Go to **Library**
3. Search for **Firebase Cloud Messaging API**
4. Click **Enable**

#### Step 4: Create Custom Role for Apptrove[â](#step-4-create-custom-role-for-apptrove "Direct link to Step 4: Create Custom Role for Apptrove")

1. In the side menu, select **Roles**
2. Click **+Create role**

3. Complete the form as follows:
   - **Title**: Enter `Apptrove Uninstall`
   - **ID**: Enter `at_uninstalls`
   - **Role launch stage**: Select `General availability`
4. Click **Add permissions**

5. In the **Filter** field, search for: `cloudmessaging.messages.create`
6. Select the permission and click **Add**
7. Click **Create**

Verify Role Creation

After creating the role, check and verify that the **Apptrove Uninstall** role has been added successfully with the `cloudmessaging.messages.create` permission.

#### Step 5: Assign Apptrove the FCM Uninstall Role[â](#step-5-assign-apptrove-the-fcm-uninstall-role "Direct link to Step 5: Assign Apptrove the FCM Uninstall Role")

1. In the side menu, select **IAM**
2. Click **Grant Access**

3. In **Add Principals** â **New principals**, enter: `at-uninstalls-tracking-tra-430@trackier-mmp.iam.gserviceaccount.com`
4. In **Assign roles** â **Role** select **Custom** and choose **Apptrove Uninstall** (the role we created earlier)
5. Click **Save**

Production Service Account

Use this exact email address for production: `at-uninstalls-tracking-tra-430@trackier-mmp.iam.gserviceaccount.com`

#### Step 6: Verify Permissions[â](#step-6-verify-permissions "Direct link to Step 6: Verify Permissions")

1. Go to **IAM & Admin** â **IAM**
2. Search for the service account you just added
3. Verify that the **Apptrove Uninstall** role is assigned

For Testing/Development

If you need to test uninstall tracking in a development environment, you can also add the testing service account:

**Testing Service Account**: `mmp-dev@trackier-mmp.iam.gserviceaccount.com`

Repeat Step 5 with this email address and assign the same **Apptrove Uninstall** custom role. This allows the development team to test the uninstall tracking flow without affecting production data.

## Verification and Testing[â](#verification-and-testing "Direct link to Verification and Testing")

### 1. Test FCM Token Registration[â](#1-test-fcm-token-registration "Direct link to 1. Test FCM Token Registration")

When your app starts, check the logs to verify the FCM token is being sent to Apptrove:

```
npx react-native run-android
```

**Check the console logs for:**

```
SDK initialized successfully
FCM token refreshed: [YOUR_FCM_TOKEN]
```

**Check Token Response**: Look for the log message `Fcm token Api response saved successfully` in Android Studio Logcat (log tag may be SDK-specific, e.g. `trackiersdk` for Trackier).

**Expected Log Output (example for Trackier):**

```
D/trackiersdk: Fcm token Api response saved successfully
```

### 2. Verify Setup in Dashboard[â](#2-verify-setup-in-dashboard "Direct link to 2. Verify Setup in Dashboard")

After successfully sending the FCM token, verify the complete setup in your Apptrove dashboard:

1. Go to **Apptrove Panel > Settings > Uninstall Tracking**
2. Verify your Firebase Project ID is correctly configured
3. Check that the toggle for uninstall tracking is enabled
4. Confirm the service account has proper permissions in Firebase Console (IAM section)

The image above shows a successful uninstall tracking setup with:

- â Firebase Project ID configured
- â Uninstall tracking toggle enabled
- â Service account permissions verified
- â FCM API enabled

### 3. Test Uninstall Detection[â](#3-test-uninstall-detection "Direct link to 3. Test Uninstall Detection")

1. Install your app and register FCM token
2. Uninstall the app
3. Wait 24-48 hours for the uninstall data to be processed
4. Check Apptrove dashboard for uninstall event

### 4. Monitor Apptrove Dashboard[â](#4-monitor-apptrove-dashboard "Direct link to 4. Monitor Apptrove Dashboard")

1. Log in to your [Apptrove dashboard](https://dashboard.apptrove.com/)
2. Navigate to uninstall logs
3. Confirm the uninstall event was received (typically within 24-48 hours)

Uninstall Data Processing Time

Uninstall events are not detected immediately. It typically takes **24-48 hours** for uninstall data to appear in the Apptrove panel after an app is uninstalled. This is normal behavior for FCM-based uninstall tracking.

## Important Notes[â](#important-notes "Direct link to Important Notes")

FCM Token Behavior

- **Token Generation**: FCM tokens are generated when the app is first installed or when the token is refreshed
- **Token Refresh**: Tokens can change when: app is restored on a new device, app data is cleared, app is uninstalled and reinstalled, or token expires (rare)
- **One-Time Call**: The `onTokenRefresh` listener is called only when a new token is generated, not on every app launch
- **SDK Integration**: Call `ApptroveSDK.sendFcmToken(newToken)` or `TrackierSDK.sendFcmToken(newToken)` when the token is generated or refreshed (similar to Android's `onNewToken()`)

Silent Notifications Only

Apptrove uses silent push notifications solely to measure uninstalls or identify inactive users and does not use them for any other purposes. These notifications are invisible to users and don't affect app performance.

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Common Issues[â](#common-issues "Direct link to Common Issues")

- **FCM token not received**: Ensure Firebase is properly configured with `google-services.json` in `android/app/` directory and `@react-native-firebase` packages are installed
- **Uninstall not detected**: Check server logs for FCM delivery failures and verify token registration
- **Token not sent to SDK**: Ensure `initializeFCM()` is called **after** SDK initialization
- **Rate limiting**: Implement proper delays between FCM sends to avoid Google's rate limits
- **Token expiration**: The `onTokenRefresh` listener automatically handles token updates
- **Permission denied**: Verify push notification permission is granted

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Silent notifications**: Use silent push notifications to avoid user disruption
- **Rate limiting**: Implement proper delays to avoid FCM rate limits
- **Token management**: Handle FCM token refresh and updates properly
- **Error handling**: Implement comprehensive error handling for FCM failures
- **Security**: Store FCM tokens securely on your server
- **Call Order**: Always initialize FCM **after** Apptrove SDK initialization

### Debug Steps[â](#debug-steps "Direct link to Debug Steps")

1. **Verify Firebase Setup**:

   ```
   cd android && ./gradlew signingReport
   cd .. && npx react-native run-android
   ```
2. **Check Logs**:

   ```
   npx react-native log-android
   # or (Trackier: tag is trackiersdk; Apptrove may use a different tag)
   adb logcat -s trackiersdk
   ```
3. **Verify Dependencies**: Ensure both `@react-native-firebase/app` and `@react-native-firebase/messaging` are properly installed
4. **Check Firebase Console**: Verify your app is registered and FCM API is enabled
5. **Test Token Listener**: Add debug prints to verify the `onTokenRefresh` listener is active (use `ApptroveSDK.sendFcmToken` or `TrackierSDK.sendFcmToken` per your SDK):

   ```
   messagingInstance.onTokenRefresh((newToken) => {
     console.log('DEBUG: FCM Token received:', newToken);
     ApptroveSDK.sendFcmToken(newToken); // or TrackierSDK.sendFcmToken(newToken)
   });
   ```
6. **Verify Platform**: Ensure you're testing on Android device/emulator, as iOS doesn't support FCM uninstall tracking

---

For additional help, contact Apptrove support or refer to the [React Native Firebase Documentation](https://rnfirebase.io/).
