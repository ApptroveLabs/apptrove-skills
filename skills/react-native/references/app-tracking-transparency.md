# App Tracking Transparency (ATT)

Official source: https://developers.apptrove.com/docs/react-native-sdk/additional-features/app-tracking-transparency

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view ATT implementation code for your chosen SDK.

This guide provides comprehensive instructions for implementing Apple's App Tracking Transparency (ATT) framework with the Apptrove React Native SDK. ATT is required for iOS 14.5+ apps that want to access the Identifier for Advertisers (IDFA) for accurate attribution and tracking.

## Overview[â](#overview "Direct link to Overview")

App Tracking Transparency (ATT) is Apple's privacy framework that requires apps to request user permission before accessing the IDFA. This is crucial for accurate attribution and tracking on iOS 14.5 and later.

## Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- iOS 14.5 or later
- Xcode 12.0 or later
- Apptrove React Native SDK installed
- Access to your app's `Info.plist` file
- `react-native-permissions` package installed

## Installation[â](#installation "Direct link to Installation")

Install the permissions package:

```
npm install react-native-permissions@^5.4.4
```

### Configure iOS Podfile[â](#configure-ios-podfile "Direct link to Configure iOS Podfile")

Add permissions setup to your `ios/Podfile`:

ios/Podfile

```
# Setup permissions for react-native-permissions
setup_permissions([
  'AppTrackingTransparency',
])
```

Then install pods:

```
cd ios && pod install && cd ..
```

**Package Link:** [react-native-permissions on npm](https://www.npmjs.com/package/react-native-permissions)

## Implementation[â](#implementation "Direct link to Implementation")

### Step 1: Add Permission Description[â](#step-1-add-permission-description "Direct link to Step 1: Add Permission Description")

Add the following key-value pair to your `Info.plist` to describe why your app needs tracking permission:

ios/YourApp/Info.plist

```
<key>NSUserTrackingUsageDescription</key>
<string>We use tracking to personalize your experience and improve our services.</string>
```

### Step 2: Complete Implementation[â](#step-2-complete-implementation "Direct link to Step 2: Complete Implementation")

note

**Important**: On iOS, request ATT permission first, then call `waitForATTUserAuthorization(20)` between creating the SDK config and initializing. Once the user grants permission, the SDK will automatically fetch and send IDFA to the panel.

Here's the complete implementation:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ApptroveSDK, ApptroveConfig } from 'react-native-apptrove';

const App = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await initializeSDK();
  };

  const requestATTPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        switch (result) {
          case RESULTS.GRANTED:
            console.log('ATT permission granted');
            break;
          case RESULTS.DENIED:
            console.log('ATT permission denied');
            break;
          case RESULTS.BLOCKED:
            console.log('ATT permission blocked');
            break;
          case RESULTS.UNAVAILABLE:
            console.log('ATT is not available on this device');
            break;
          case RESULTS.LIMITED:
            console.log('ATT permission limited');
            break;
        }

        return result;
      } catch (error) {
        console.log('Error requesting ATT permission:', error);
        return null;
      }
    }
  };

  const initializeSDK = async () => {
    try {
      const sdkConfig = new ApptroveConfig('YOUR_SDK_KEY', 'production');
      if (Platform.OS === 'ios') {
        await requestATTPermission();
        ApptroveSDK.waitForATTUserAuthorization(20);
      }
      ApptroveSDK.initialize(sdkConfig);
    } catch (error) {
      console.log('Error in SDK initialization:', error);
    }
  };

  return (/* Your app components */);
};

export default App;
```

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { TrackierSDK, TrackierConfig } from 'react-native-trackier';

const App = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await initializeSDK();
  };

  const requestATTPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        switch (result) {
          case RESULTS.GRANTED:
          case RESULTS.DENIED:
          case RESULTS.BLOCKED:
          case RESULTS.UNAVAILABLE:
          case RESULTS.LIMITED:
            break;
        }
        return result;
      } catch (error) {
        console.log('Error requesting ATT permission:', error);
        return null;
      }
    }
  };

  const initializeSDK = async () => {
    try {
      const sdkConfig = new TrackierConfig('YOUR_SDK_KEY', 'production');
      if (Platform.OS === 'ios') {
        await requestATTPermission();
        TrackierSDK.waitForATTUserAuthorization(20);
      }
      TrackierSDK.initialize(sdkConfig);
    } catch (error) {
      console.log('Error in SDK initialization:', error);
    }
  };

  return (/* Your app components */);
};

export default App;
```

## How It Works[â](#how-it-works "Direct link to How It Works")

1. **Create SDK Config**: Create config with your SDK key (`ApptroveConfig` or `TrackierConfig`)
2. **Request ATT Permission** (iOS only): Request permission using `react-native-permissions`
3. **Set Timeout**: Call `waitForATTUserAuthorization(20)` - sets 20 second timeout
4. **Initialize SDK**: Call SDK `initialize(config)`
5. **Auto IDFA**: When user allows, SDK automatically fetches and sends IDFA to panel

info

**The order is important:** Create Config â Request Permission â Set Timeout â Initialize SDK

## Key Features[â](#key-features "Direct link to Key Features")

- **`waitForATTUserAuthorization(timeoutInterval)`**: Configures the SDK to wait for user's ATT decision before starting tracking. The timeout can be adjusted based on your app's needs.
- **Automatic IDFA Handling**: Once permission is granted, the SDK automatically fetches and sends IDFA to the panel.
- **Manual Permission Request**: You control when to show the ATT permission dialog to users.
- **Platform-Specific**: Only runs on iOS, gracefully skips on other platforms.

warning

Always replace `"YOUR_SDK_KEY"` with your actual SDK token from the Apptrove Panel. Using an incorrect token will cause attribution issues.

## Visual Examples[â](#visual-examples "Direct link to Visual Examples")

**ATT Permission Dialog:**



**IDFA Console Logs:**




**IDFA Panel in Trackier Dashboard:**
When tracking is properly configured with ATT, you can see the IDFA details in the Trackier panel for installs and events:

This panel shows the IDFA information when users grant tracking permission, allowing for accurate attribution and detailed tracking analytics.

## ATT Permission Result Values[â](#att-permission-result-values "Direct link to ATT Permission Result Values")

| Result | Description | SDK Behavior |
| --- | --- | --- |
| `RESULTS.GRANTED` | User granted permission | Full tracking enabled, IDFA available |
| `RESULTS.DENIED` | User denied permission | Limited tracking, no IDFA |
| `RESULTS.BLOCKED` | Permission blocked (settings) | Limited tracking, no IDFA |
| `RESULTS.LIMITED` | Limited tracking permission | Limited tracking |
| `RESULTS.UNAVAILABLE` | ATT not available on device | Continue without IDFA |

## Best Practices[â](#best-practices "Direct link to Best Practices")

- **Timing**: Request permission after app launch (1-2 second delay)
- **User Experience**: Explain why tracking is needed before requesting permission
- **Timeout Configuration**: Adjust timeout based on your app's flow (default 20 seconds)
- **Platform Check**: Always check if running on iOS before calling ATT methods
- **Check Status First**: Always check if permission has already been determined before requesting
- **Handle All Cases**: Implement proper handling for all ATT status values

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Common Issues[â](#common-issues "Direct link to Common Issues")

**ATT Permission Not Requested**

- Ensure `NSUserTrackingUsageDescription` is added to `Info.plist`
- Check that the app targets iOS 14.5 or later
- Verify `setup_permissions(['AppTrackingTransparency'])` is added to Podfile
- Ensure `react-native-permissions` package is properly installed (version 5.4.4+)
- Run `cd ios && pod install` after adding to Podfile

**IDFA Not Available**

- Check if user granted permission (status should be `authorized`)
- Ensure the device supports IDFA (not available on simulator)
- Verify the app is not restricted by parental controls

**SDK Initialization Issues**

- Make sure `waitForATTUserAuthorization` is called before SDK initialization
- Check that the timeout value is appropriate for your app flow
- Verify the SDK token is correct

**Platform Check Not Working**

- Ensure `Platform.OS === 'ios'` is correctly implemented
- Verify the Platform import from `react-native`

## Support[â](#support "Direct link to Support")

For technical support and questions:

- **Support Email**: [support@apptrove.com](mailto:support@apptrove.com)
- **Documentation**: [Apptrove Documentation Portal](https://help.apptrove.com/en/)

---

This guide provides comprehensive implementation of App Tracking Transparency with the Trackier React Native SDK, ensuring compliance with Apple's privacy requirements while maintaining accurate attribution and tracking capabilities.
