# Apple Update Token

Official source: https://developers.apptrove.com/docs/expo-sdk/additional-features/apple-update-token

---

On this page

The Apple Update Token allows you to update Apple's Ads Attribution token for enhanced tracking on iOS devices in Expo applications.

## What is Apple Update Token?[â](#what-is-apple-update-token "Direct link to What is Apple Update Token?")

Apple's Ads Attribution token helps maintain user attribution across app updates and reinstalls, ensuring continuous tracking and data continuity.

## Library Reference[â](#library-reference "Direct link to Library Reference")

### react-native-attribution-token[â](#react-native-attribution-token "Direct link to react-native-attribution-token")

React Native module for fetching attribution token on iOS.

**Requirements:**

- AdServices framework (iOS)

**Repository:** [react-native-attribution-token](https://www.npmjs.com/package/react-native-attribution-token/v/1.0.0)

## Installation[â](#installation "Direct link to Installation")

First, install the `react-native-attribution-token` library to get the Apple Ads token:

```
npm install react-native-attribution-token
```

**Usage:**

```
import { getAttributionToken } from 'react-native-attribution-token';

const getToken = async () => {
  try {
    const token = await getAttributionToken();
    console.log(token);
  } catch (error) {
    console.log(error);
  }
};
```

**Documentation:**

- `getAttributionToken()` - Fetches the attribution token from the AdServices framework on iOS. Returns a promise that resolves to the attribution token.
- On Android, this method will return a promise that resolves to null.

### Complete Example with SDK Initialization[â](#complete-example-with-sdk-initialization "Direct link to Complete Example with SDK Initialization")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppTroveSDK, AppTroveConfig } from 'apptrove-expo-sdk';
import { getAttributionToken } from 'react-native-attribution-token';

const App = () => {
  const getAppleAdsToken = async () => {
    if (Platform.OS !== 'ios') return null;
    try {
      const token = await getAttributionToken();
      return token;
    } catch (error) {
      console.log('Error getting Apple Ads token:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      const config = new AppTroveConfig('YOUR_APP_TOKEN', AppTroveConfig.EnvironmentProduction);
      const appleAdsToken = await getAppleAdsToken();
      if (appleAdsToken) {
        AppTroveSDK.updateAppleAdsToken(appleAdsToken);
      }
      AppTroveSDK.initialize(config);
    };

    initializeSDK();
  }, []);

  return null;
};
```

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { TrackierSDK, TrackierConfig } from 'trackier-expo-sdk';
import { getAttributionToken } from 'react-native-attribution-token';

const App = () => {
  const getAppleAdsToken = async () => {
    if (Platform.OS !== 'ios') return null;
    try {
      const token = await getAttributionToken();
      console.log('Apple Ads Token:', token);
      return token;
    } catch (error) {
      console.log('Error getting Apple Ads token:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      // Initialize SDK
      const config = new TrackierConfig('YOUR_APP_TOKEN', 'production');

      // Get Apple Ads token before initializing SDK
      const appleAdsToken = await getAppleAdsToken();
      if (appleAdsToken) {
        TrackierSDK.updateAppleAdsToken(appleAdsToken);
      }

      // Initialize SDK after updating token
      TrackierSDK.initialize(config);
    };

    initializeSDK();
  }, []);

  return (
    // Your app component
  );
};
```

## Function Reference[â](#function-reference "Direct link to Function Reference")

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `updateAppleAdsToken(token)` | Update Apple Ads token | String | void |

## Where to Add[â](#where-to-add "Direct link to Where to Add")

- **App Launch**: Update token when your app starts
- **Token Refresh**: Update when you receive a new token from your server
- **Deep Link Handling**: Update token before processing deep links

## Best Practices[â](#best-practices "Direct link to Best Practices")

1. **Validate Token**: Ensure token is not empty and has proper format
2. **Error Handling**: Wrap in try-catch for network errors
3. **Storage**: Store token securely for future use
4. **Platform Check**: Only call on iOS devices
5. **Async Handling**: Use async/await for token retrieval

## Support[â](#support "Direct link to Support")

For issues with Apple Update Token implementation, refer to our [Support](/docs/expo-sdk/support) page.
