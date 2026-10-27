# Android Uninstall Tracking with FCM

Official source: https://developers.apptrove.com/docs/expo-sdk/advance-features/uninstall-tracking-fcm

---

On this page

Apptrove SDK Only

This feature is only available in **Apptrove SDK v2.0.2+**. Trackier SDK does not support direct FCM token methods. For Trackier SDK, use the [Firebase Analytics method](/docs/expo-sdk/advance-features/uninstall-tracking-analytics).

Firebase Cloud Messaging (FCM) uninstall tracking detects app uninstalls by monitoring FCM delivery receipts. This method is ideal for Expo apps that already use push notifications.

## How FCM Uninstall Tracking Works[â](#how-fcm-uninstall-tracking-works "Direct link to How FCM Uninstall Tracking Works")

- **Purpose**: Tracks app uninstalls using FCM delivery receipts to assess user engagement and campaign performance
- **Mechanism**: Uses FCM to send silent push notifications and monitors delivery receipts for failed deliveries
- **Detection**: Uninstall data typically appears in the panel within 24-48 hours
- **Use Case**: Measure uninstall rates for campaigns to refine targeting and improve user retention

Alternative Method

For Firebase Analytics-based uninstall tracking (works with both Apptrove and Trackier SDKs), see [Through Firebase Analytics](/docs/expo-sdk/advance-features/uninstall-tracking-analytics).

## Prerequisites[â](#prerequisites "Direct link to Prerequisites")

Before implementing FCM uninstall tracking, ensure you have:

- **Firebase project** with Cloud Messaging enabled
- **Expo app** with EAS Build configured
- **Apptrove SDK v2.0.2+** properly initialized
- **expo-notifications** package installed
- **Android platform** (FCM uninstall tracking is Android-only)

## Implementation[â](#implementation "Direct link to Implementation")

### 1. Add Dependencies[â](#1-add-dependencies "Direct link to 1. Add Dependencies")

Add Firebase and notifications packages to your project:

```
npx expo install expo-notifications
```

**package.json:**

```
{
  "dependencies": {
    "expo-notifications": "~0.28.0",
    "apptrove-expo-sdk": "^2.0.2"
  }
}
```

Latest Version

Check the [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) documentation for the latest version and setup instructions.

### 2. Configure Firebase[â](#2-configure-firebase "Direct link to 2. Configure Firebase")

#### Android Configuration[â](#android-configuration "Direct link to Android Configuration")

**app.json:**

```
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": []
        }
      ]
    ]
  }
}
```

Download `google-services.json` from Firebase Console and place it in your project root directory.

### 3. Initialize FCM[â](#3-initialize-fcm "Direct link to 3. Initialize FCM")

Create the FCM initialization function in your `App.tsx` or `App.js`:

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

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AppTroveConfig, AppTroveSDK } from 'apptrove-expo-sdk';

export default function App() {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      // Initialize AppTrove SDK
      const config = new AppTroveConfig(
        'YOUR_SDK_KEY',
        AppTroveConfig.EnvironmentDevelopment
      );
      AppTroveSDK.initialize(config);

      // Register push notifications for Android
      if (Platform.OS === 'android') {
        await registerPushNotifications();
      }
    } catch (error) {
      console.error('Error initializing SDK:', error);
    }
  };

  const registerPushNotifications = async () => {
    try {
      console.log('[FCM] Requesting push notification permissions...');

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[FCM] Push notification permission denied');
        return;
      }

      console.log('[FCM] Permission granted');

      // Get the device push token (FCM token for Android)
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      const fcmToken = deviceToken.data;

      console.log('[FCM] Token retrieved:', fcmToken);

      // Send FCM token to AppTrove SDK
      AppTroveSDK.sendFcmToken(fcmToken);
      console.log('[FCM] Token sent to AppTrove SDK successfully');
    } catch (error) {
      console.error('[FCM] Error registering push notifications:', error);
    }
  };

  return (
    // Your app components
  );
}
```

FCM Token Behavior

- **Token Generation**: FCM tokens are generated when the app is first installed or when the token is refreshed
- **Token Refresh**: Tokens can change when: app is restored on a new device, app data is cleared, app is uninstalled and reinstalled, or token expires (rare)
- **One-Time Call**: The token is retrieved once during app initialization
- **SDK Integration**: Call `AppTroveSDK.sendFcmToken(fcmToken)` when the token is generated

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
npx expo run:android
```

**Check the console logs for:**

```
[FCM] Requesting push notification permissions...
[FCM] Permission granted
[FCM] Token retrieved: [YOUR_FCM_TOKEN]
[FCM] Token sent to AppTrove SDK successfully
```

**Check Token Response in Logcat**: In Android Studio Logcat, filter by `apptrove` or `trackier` to see SDK-specific logs. Look for the log message `Fcm token Api response saved successfully`.

**Expected Log Output:**

```
D/apptrove: Fcm token Api response saved successfully
```

#### Method 1: Send Token via Custom Event Parameter (Optional Testing)[â](#method-1-send-token-via-custom-event-parameter-optional-testing "Direct link to Method 1: Send Token via Custom Event Parameter (Optional Testing)")

Add this code to capture and send the token for testing purposes:

```
import { AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';

// After getting FCM token
const sendTokenForTesting = async (fcmToken) => {
  // Send to AppTrove SDK
  AppTroveSDK.sendFcmToken(fcmToken);

  // TESTING ONLY: Send token via custom event parameter
  const testEvent = new AppTroveEvent("fcm_token_test");
  testEvent.param1 = fcmToken;  // Send token in param1
  AppTroveSDK.trackEvent(testEvent);
};
```

Why Send Token via Event?

Sending the FCM token via a custom event parameter allows you to:

- Verify the token is being generated correctly
- See the token value in your dashboard for debugging
- Confirm the SDK is properly initialized and tracking events

### 2. Verify Setup in Dashboard[â](#2-verify-setup-in-dashboard "Direct link to 2. Verify Setup in Dashboard")

After successfully sending the FCM token, verify the complete setup in your Apptrove dashboard:

1. Go to **Apptrove Panel > Settings > Uninstall Tracking**
2. Verify your Firebase Project ID is correctly configured
3. Check that the toggle for uninstall tracking is enabled
4. Confirm the service account has proper permissions in Firebase Console (IAM section)
5. **(Optional)** If using Method 1, check **Events** or **Logs** for the `fcm_token_test` event to verify the token value

The image above shows a successful uninstall tracking setup with:

- â Firebase Project ID configured
- â Uninstall tracking toggle enabled
- â Service account permissions verified
- â FCM API enabled

### 3. Test Uninstall Detection[â](#3-test-uninstall-detection "Direct link to 3. Test Uninstall Detection")

1. Install your app and register FCM token
2. Verify token is sent (check logs for "Token sent to AppTrove SDK successfully" and logcat for "Fcm token Api response saved successfully")
3. Uninstall the app
4. Wait 24-48 hours for the uninstall data to be processed
5. Check Apptrove dashboard for uninstall event

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
- **One-Time Call**: Token retrieval happens once during app initialization
- **SDK Integration**: Call `AppTroveSDK.sendFcmToken(fcmToken)` when the token is generated

Silent Notifications Only

Apptrove uses silent push notifications solely to measure uninstalls or identify inactive users and does not use them for any other purposes. These notifications are invisible to users and don't affect app performance.

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Common Issues[â](#common-issues "Direct link to Common Issues")

- **FCM token not received**: Ensure Firebase is properly configured with `google-services.json` in your project root and `expo-notifications` package is installed
- **Uninstall not detected**: Check server logs for FCM delivery failures and verify token registration
- **Token not sent to SDK**: Ensure `registerPushNotifications()` is called **after** SDK initialization
- **Rate limiting**: Implement proper delays between FCM sends to avoid Google's rate limits
- **Token expiration**: Tokens are automatically refreshed by Firebase
- **Permission denied**: Verify push notification permission is granted
- **Expo Go limitations**: FCM tokens require a development or production build (not Expo Go)
- **Token not visible in logs**: FCM tokens are generated only once on first install. To see the token again, uninstall and reinstall the app

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Silent notifications**: Use silent push notifications to avoid user disruption
- **Rate limiting**: Implement proper delays to avoid FCM rate limits
- **Token management**: Handle FCM token refresh and updates properly
- **Error handling**: Implement comprehensive error handling for FCM failures
- **Security**: Store FCM tokens securely on your server
- **Call Order**: Always initialize FCM **after** Apptrove SDK initialization
- **Use EAS Build**: Always use EAS Build for testing FCM functionality (not Expo Go)

### Debug Steps[â](#debug-steps "Direct link to Debug Steps")

1. **Verify Firebase Setup**:

   ```
   npx expo run:android
   ```
2. **Check Console Logs**:

   - Look for `[FCM]` prefixed logs in console
   - Verify token is retrieved and sent successfully
3. **Check Android Studio Logcat**:

   - Open Android Studio
   - Go to **Logcat** tab
   - Filter by `apptrove` or `trackier` (depending on your SDK)
   - Look for `Fcm token Api response saved successfully`
4. **Verify Dependencies**: Ensure `expo-notifications` is properly installed:

   ```
   npx expo install expo-notifications
   ```
5. **Check Firebase Console**:

   - Verify your app is registered in Firebase Console
   - Ensure FCM API is enabled
   - Confirm `google-services.json` is in project root
6. **Test with EAS Build**: Build and test with EAS Build:

   ```
   eas build --profile development --platform android
   ```
7. **Verify Platform**: Ensure you're testing on Android device/emulator, as iOS doesn't support FCM uninstall tracking
8. **Test Token Event** (Optional): If using Method 1, check your dashboard for the `fcm_token_test` event to verify the token is being captured correctly

---

## SDK Method[â](#sdk-method "Direct link to SDK Method")

### `sendFcmToken(token)`[â](#sendfcmtokentoken "Direct link to sendfcmtokentoken")

Send the FCM token to Apptrove for uninstall tracking.

**Usage:**

```
AppTroveSDK.sendFcmToken(fcmToken);
```

**Parameters:**

- `fcmToken` (string): The FCM device token retrieved from `expo-notifications`

**Returns:** void

**Example:**

```
const deviceToken = await Notifications.getDevicePushTokenAsync();
const fcmToken = deviceToken.data;
AppTroveSDK.sendFcmToken(fcmToken);
```

---

For additional help, contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com).
