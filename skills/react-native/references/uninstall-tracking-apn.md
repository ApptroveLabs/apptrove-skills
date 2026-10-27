# iOS Uninstall Tracking with APNs

Official source: https://developers.apptrove.com/docs/react-native-sdk/advance-features/uninstall-tracking-apn

---

On this page

## Overview[â](#overview "Direct link to Overview")

Track app uninstalls using Apple Push Notification Service (APNs) to measure user retention and optimize your campaigns.

info

iOS uninstalls take **9+ days** to appear in reports due to Apple Push Notification service.

---

## Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- iOS 10.0 or higher
- Xcode 12.0 or later
- Apple Developer Account
- Apptrove React Native SDK version 1.6.x+ installed

SDK Version Selection

- **Apptrove SDK** (recommended): Use `react-native-apptrove` and `ApptroveSDK.sendAPNToken(apnsToken)`.
- **Trackier SDK** (deprecating August 2026): Use `react-native-trackier` and `TrackierSDK.sendAPNToken(apnsToken)`.

---

## Step 1: Request Certificate in Keychain Access[â](#step-1-request-certificate-in-keychain-access "Direct link to Step 1: Request Certificate in Keychain Access")

1.1. Open **Keychain Access** on your Mac.

1.2. Go to **Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority**.

1.3. Fill in the form:

- **User Email Address**: Your email
- **Common Name**: Your name
- **Request is**: Select **Saved to disk**
- Click **Continue**

1.4. Save the file to your Desktop.

---

## Step 2: Go to Apple Developer Portal - Identifiers[â](#step-2-go-to-apple-developer-portal---identifiers "Direct link to Step 2: Go to Apple Developer Portal - Identifiers")

2.1. Open [Apple Developer Portal](https://developer.apple.com/account/).

2.2. Go to **Certificates, Identifiers & Profiles**.

2.3. Click **Identifiers**.

2.4. Select your **App ID** (your app's bundle ID/package name).

---

## Step 3: Configure Push Notifications[â](#step-3-configure-push-notifications "Direct link to Step 3: Configure Push Notifications")

3.1. After clicking your App ID, you'll see the App ID Configuration page.

3.2. Scroll to **Capabilities** section.

3.3. Check **Push Notifications**.

3.4. Click **Configure**.

---

## Step 4: Upload Certificate and Download .cer[â](#step-4-upload-certificate-and-download-cer "Direct link to Step 4: Upload Certificate and Download .cer")

4.1. In the Push Notifications configuration screen, choose:

- **Production SSL Certificate** (for App Store/Production)
- Click **Create Certificate**

4.2. Click **Choose File** and upload the `.certSigningRequest` file from Step 1.

4.3. Click **Continue**.

4.4. Click **Download** to save the `.cer` file.

---

## Step 5: Go to Keychain and Export as .p12[â](#step-5-go-to-keychain-and-export-as-p12 "Direct link to Step 5: Go to Keychain and Export as .p12")

5.1. **Double-click** the downloaded `.cer` file to open it in **Keychain Access**.

5.2. In Keychain Access, click **My Certificates** in the left sidebar.

5.3. Find your Push Notification certificate (e.g., "Apple Push Services: com.yourapp.package").

5.4. **Right-click** on the certificate â Select **Export**.

5.5. Save as:

- **File Format**: Personal Information Exchange (.p12)
- **Enter a password** (you will need this later)
- Click **Save**

---

## Step 6: Upload .p12 to Apptrove Panel[â](#step-6-upload-p12-to-apptrove-panel "Direct link to Step 6: Upload .p12 to Apptrove Panel")

6.1. Log in to your [Apptrove Panel](https://panel.trackier.com/).

6.2. Go to **Settings > Uninstall Tracking**.

6.3. Select your iOS app.

6.4. Click **Upload** and select the `.p12` file.

6.5. Enter the password you created in Step 5.

6.6. Click **Save**.

---

## Step 7: Configure in Xcode[â](#step-7-configure-in-xcode "Direct link to Step 7: Configure in Xcode")

7.1. Open your project in **Xcode**.

7.2. Select your app **Target** â **Signing & Capabilities** tab.

7.3. Click **+ Capability** â Add **Push Notifications**.

7.4. Click **+ Capability** again â Add **Background Modes**.

7.5. Check **Remote notifications**.

---

## Step 8: Add User Permission in Info.plist[â](#step-8-add-user-permission-in-infoplist "Direct link to Step 8: Add User Permission in Info.plist")

8.1. Open your project in Xcode.

8.2. Open the `Info.plist` file.

8.3. Add the following key and description:

**Key**: `NSUserNotificationsUsageDescription`

**Value**: `We need permission to send you notifications and track uninstalls.`

You can also add it in the Source Code view:

```
<key>NSUserNotificationsUsageDescription</key>
<string>We need permission to send you notifications and track uninstalls.</string>
```

note

This permission message will be shown to users when your app requests notification access.

---

## Step 9: Send Token to Apptrove SDK[â](#step-9-send-token-to-apptrove-sdk "Direct link to Step 9: Send Token to Apptrove SDK")

### 9.1 Configure AppDelegate.mm[â](#91-configure-appdelegatemm "Direct link to 9.1 Configure AppDelegate.mm")

In your `ios/YourProjectName/AppDelegate.mm`, initialize Firebase manually to avoid `GoogleService-Info.plist` dependency if needed:

```
#import "AppDelegate.h"
#import <FirebaseCore/FirebaseCore.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // Manual Firebase configuration
  FIROptions *options = [[FIROptions alloc] initWithGoogleAppID:@"YOUR_APP_ID" GCMSenderID:@"YOUR_SENDER_ID"];
  options.APIKey = @"YOUR_API_KEY";
  options.projectID = @"YOUR_PROJECT_ID";
  options.storageBucket = @"YOUR_STORAGE_BUCKET";

  [FIRApp configureWithOptions:options];

  self.moduleName = @"YourProjectName";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

### 9.2 React Native Implementation[â](#92-react-native-implementation "Direct link to 9.2 React Native Implementation")

Retrieve the APN token using `@react-native-firebase/messaging` and send it to the Apptrove SDK in your `App.js`.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { ApptroveSDK } from 'react-native-apptrove';

const initializeAPNS = async () => {
  if (Platform.OS !== 'ios') return;

  try {
    await messaging().registerDeviceForRemoteMessages();
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const apnsToken = await messaging().getAPNSToken();
      if (apnsToken) {
        console.log('APN Token retrieved successfully:', apnsToken);
        ApptroveSDK.sendAPNToken(apnsToken);
      }
    }
  } catch (error) {
    console.log('Error initializing APNS:', error);
  }
};
```

```
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { TrackierSDK } from 'react-native-trackier';

const initializeAPNS = async () => {
  if (Platform.OS !== 'ios') return;

  try {
    await messaging().registerDeviceForRemoteMessages();
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const apnsToken = await messaging().getAPNSToken();
      if (apnsToken) {
        console.log('APN Token retrieved successfully:', apnsToken);
        TrackierSDK.sendAPNToken(apnsToken);
      }
    }
  } catch (error) {
    console.log('Error initializing APNS:', error);
  }
};
```

### 9.3 Initialize APNS[â](#93-initialize-apns "Direct link to 9.3 Initialize APNS")

note

**Important**: Call this function after the Apptrove SDK has been initialized.

```
// Initialize APNS after SDK initialization on iOS
if (Platform.OS === 'ios') {
  try {
    await initializeAPNS();
  } catch (apnsError) {
    console.log('Error initializing APNS:', apnsError);
  }
}
```

---

## Step 10: Testing Uninstall Tracking[â](#step-10-testing-uninstall-tracking "Direct link to Step 10: Testing Uninstall Tracking")

Important Testing Notes

**Local APN tokens do NOT work for uninstall tracking testing.** You must upload your app to TestFlight and test with TestFlight APN tokens.

### Testing with TestFlight[â](#testing-with-testflight "Direct link to Testing with TestFlight")

To properly test uninstall tracking, follow these steps:

1. **Upload your app to TestFlight** via App Store Connect
2. **Install the app from TestFlight** on a physical device
3. **Launch the app** and grant notification permissions
4. **Capture the APN token** using one of these methods:

#### Method 1: Send Token via Custom Event Parameter[â](#method-1-send-token-via-custom-event-parameter "Direct link to Method 1: Send Token via Custom Event Parameter")

Add this code to capture and send the token for testing purposes:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';

// After getting APN token
const sendTokenForTesting = async (apnsToken) => {
  // Send to Apptrove SDK
  ApptroveSDK.sendAPNToken(apnsToken);

  // TESTING ONLY: Send token via custom event parameter
  const testEvent = new ApptroveEvent("apn_token_test");
  testEvent.param1 = apnsToken;  // Send token in param1
  ApptroveSDK.trackEvent(testEvent);
};
```

```
import { TrackierSDK, TrackierEvent } from 'react-native-trackier';

// After getting APN token
const sendTokenForTesting = async (apnsToken) => {
  // Send to Trackier SDK
  TrackierSDK.sendAPNToken(apnsToken);

  // TESTING ONLY: Send token via custom event parameter
  const testEvent = new TrackierEvent("apn_token_test");
  testEvent.param1 = apnsToken;  // Send token in param1
  TrackierSDK.trackEvent(testEvent);
};
```

Why Send Token via Event?

Sending the APN token via a custom event parameter allows you to:

- Verify the token is being generated correctly
- See the token value in your dashboard for debugging
- Confirm the SDK is properly initialized and tracking events

#### Method 2: Check Xcode Console Logs[â](#method-2-check-xcode-console-logs "Direct link to Method 2: Check Xcode Console Logs")

Run your app on a **physical device** (Simulator doesn't support APNs).

Check Xcode console logs. You should see:

```
APN Token retrieved successfully: [YOUR_APN_TOKEN]
Apn token Api response saved successfully
```

| **Success**: "Apn token Api response saved successfully"

### Verify Token in Dashboard[â](#verify-token-in-dashboard "Direct link to Verify Token in Dashboard")

After sending the token, verify it in your Apptrove dashboard:

1. Go to **Apptrove Panel > Events** or **Logs**
2. Look for the `apn_token_test` event (if using Method 1)
3. Check the parameter value (p1) to see the captured token
4. Verify the token matches what you see in Xcode logs

Testing Flow

1. Upload app to TestFlight
2. Install from TestFlight on physical device
3. Launch app and grant notification permission
4. Check Xcode logs for APN token
5. Send token via custom event parameter (optional)
6. Verify token appears in Apptrove dashboard
7. Uninstall app and wait 9+ days to see uninstall event

---

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Issue: Token Not Generated[â](#issue-token-not-generated "Direct link to Issue: Token Not Generated")

- Ensure Push Notifications capability is enabled in Xcode.
- Test on a **physical device** (not Simulator).
- Verify user granted notification permission.

### Issue: "API Response Failed" Error[â](#issue-api-response-failed-error "Direct link to Issue: \"API Response Failed\" Error")

- Check `.p12` certificate and password in Apptrove panel.
- Ensure you are using a Production certificate for App Store builds.
- SDK must be initialized before calling `sendAPNToken`.

---

## Complete Flow Summary[â](#complete-flow-summary "Direct link to Complete Flow Summary")

1. **Keychain Access** â Request Certificate â Save `.certSigningRequest` file
2. **Apple Developer Portal** â Identifiers â Select your App ID
3. **Configure Push Notifications** â Enable and click Configure
4. **Upload Certificate Request** â Download `.cer` file
5. **Keychain Access** â Export `.cer` as `.p12` with password
6. **Apptrove Panel** â Upload `.p12` file + password
7. **Xcode** â Enable Push Notifications + Background Modes
8. **Info.plist** â Add user permission description
9. **React Native App** â Call `ApptroveSDK.sendAPNToken(apnsToken)` or `TrackierSDK.sendAPNToken(apnsToken)` per your SDK
10. **Check Logs** â Verify "Apn token Api response saved successfully"

---

## SDK Method[â](#sdk-method "Direct link to SDK Method")

### `sendAPNToken(token)`[â](#sendapntokentoken "Direct link to sendapntokentoken")

Send the APN token to Apptrove for uninstall tracking.

**Usage (Apptrove):**

```
if (Platform.OS === 'ios') {
  ApptroveSDK.sendAPNToken(apnsToken);
}
```

**Usage (Trackier):**

```
if (Platform.OS === 'ios') {
  TrackierSDK.sendAPNToken(apnsToken);
}
```

---

For support, contact [support@apptrove.com](mailto:support@apptrove.com).
