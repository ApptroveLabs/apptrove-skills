# Deferred Deep Linking

Official source: https://developers.apptrove.com/docs/react-native-sdk/advance-features/deferred-deep-linking

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view deferred deep linking code for your chosen SDK.

Deferred deep linking happens when a user clicks a Apptrove URL but doesn't have your app installed. The URL redirects to the app store, and when the user installs and opens the app, the SDK retrieves the deep link data.

note

**For iOS Only**: To enable deferred deep link functionality on iOS, you need to call the `subscribeAttributionlink()` method after initialization. This allows our server to send the attributed data parameters to the app. For Android, deferred deep linking works automatically without this call.

## Implementation[â](#implementation "Direct link to Implementation")

### 1. Initialize SDK with Deferred Deep Link Callback[â](#1-initialize-sdk-with-deferred-deep-link-callback "Direct link to 1. Initialize SDK with Deferred Deep Link Callback")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { ApptroveSDK, ApptroveConfig } from 'react-native-apptrove';

const App = () => {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = () => {
    const sdkConfig = new ApptroveConfig('YOUR_SDK_KEY', 'production');
    sdkConfig.setDeferredDeeplinkCallbackListener(function(deepLinkData) {
      console.log("Deferred Deeplink Callback received");
      console.log("DeepLink Data: " + JSON.stringify(deepLinkData));
      console.log("URL: " + deepLinkData.url);
      console.log("Is Deferred: " + deepLinkData.isDeferred);
      console.log("Deep Link Value: " + deepLinkData.deepLinkValue);
      console.log("Partner ID: " + deepLinkData.partnerId);
      console.log("Campaign: " + deepLinkData.campaign);
      console.log("P1-P5: " + deepLinkData.p1, deepLinkData.p2, deepLinkData.p3, deepLinkData.p4, deepLinkData.p5);
      if (deepLinkData.sdkParams) console.log("SDK Parameters: " + JSON.stringify(deepLinkData.sdkParams));
      handleDeepLink(deepLinkData);
    });
    ApptroveSDK.initialize(sdkConfig);
    if (Platform.OS === 'ios') {
      ApptroveSDK.subscribeAttributionlink();
    }
  };

  const handleDeepLink = (deepLinkData) => {
    console.log('Handling deep link with data:', deepLinkData);
    if (deepLinkData.deepLinkValue) {
      switch (deepLinkData.deepLinkValue) {
        case 'product': navigateToProduct(deepLinkData.campaign, deepLinkData.p1); break;
        case 'profile': navigateToProfile(deepLinkData.p1); break;
        default: navigateToHome();
      }
    }
  };

  const navigateToProduct = (campaign, productId) => { console.log(`Navigating to product: ${productId} from campaign: ${campaign}`); };
  const navigateToProfile = (userId) => { console.log(`Navigating to profile: ${userId}`); };
  const navigateToHome = () => { console.log('Navigating to home screen'); };

  return (/* Your app components */);
};
```

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { TrackierSDK, TrackierConfig } from 'react-native-trackier';

const App = () => {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = () => {
    const sdkConfig = new TrackierConfig('YOUR_SDK_KEY', 'production');
    sdkConfig.setDeferredDeeplinkCallbackListener(function(deepLinkData) {
      console.log("Deferred Deeplink Callback received");
      console.log("DeepLink Data: " + JSON.stringify(deepLinkData));
      console.log("URL: " + deepLinkData.url);
      console.log("Is Deferred: " + deepLinkData.isDeferred);
      console.log("Deep Link Value: " + deepLinkData.deepLinkValue);
      console.log("Partner ID: " + deepLinkData.partnerId);
      console.log("Campaign: " + deepLinkData.campaign);
      console.log("P1-P5: " + deepLinkData.p1, deepLinkData.p2, deepLinkData.p3, deepLinkData.p4, deepLinkData.p5);
      if (deepLinkData.sdkParams) console.log("SDK Parameters: " + JSON.stringify(deepLinkData.sdkParams));
      handleDeepLink(deepLinkData);
    });
    TrackierSDK.initialize(sdkConfig);
    if (Platform.OS === 'ios') {
      TrackierSDK.subscribeAttributionlink();
    }
  };

  const handleDeepLink = (deepLinkData) => {
    console.log('Handling deep link with data:', deepLinkData);
    if (deepLinkData.deepLinkValue) {
      switch (deepLinkData.deepLinkValue) {
        case 'product': navigateToProduct(deepLinkData.campaign, deepLinkData.p1); break;
        case 'profile': navigateToProfile(deepLinkData.p1); break;
        default: navigateToHome();
      }
    }
  };

  const navigateToProduct = (campaign, productId) => { console.log(`Navigating to product: ${productId} from campaign: ${campaign}`); };
  const navigateToProfile = (userId) => { console.log(`Navigating to profile: ${userId}`); };
  const navigateToHome = () => { console.log('Navigating to home screen'); };

  return (/* Your app components */);
};
```

### 2. Deep Link Data Structure[â](#2-deep-link-data-structure "Direct link to 2. Deep Link Data Structure")

The enhanced callback provides a comprehensive data object with the following structure:

```
{
  url: "https://trackier58.u9ilnk.me/d/NKmWH9E7b1",
  isDeferred: true,
  deepLinkValue: "product",
  partnerId: "12345",
  campaign: "summer_sale",
  p1: "param1_value",
  p2: "param2_value",
  p3: "param3_value",
  p4: "param4_value",
  p5: "param5_value",
  sdkParams: {
    "custom_key": "custom_value",
    "user_id": "user123"
  }
}
```

**Properties:**

- `url`: Original deep link URL
- `isDeferred`: Boolean indicating deferred deep link
- `deepLinkValue`: Custom value for navigation logic
- `partnerId`: Attribution partner ID
- `campaign`: Campaign name
- `p1-p5`: Custom parameters
- `sdkParams`: Additional SDK parameters (object)

## Testing[â](#testing "Direct link to Testing")

### Android Testing[â](#android-testing "Direct link to Android Testing")

1. **Prepare APK**: Build APK with SDK integration
2. **Click Link**: Open test URL in browser - redirects to Play Store
3. **Install APK**: Install APK manually (not from Play Store)
4. **Launch App**: Open app - deferred deep link should be processed

Known Install Referrer Limitations

A manually-installed APK (step 3) never carries referrer data â Google only populates it for installs via the Play Store app. Other known gaps: managed Google Workspace accounts; apps not yet live on a Play Store track or organic installs (both get the organic default `utm_source=google-play&utm_medium=organic` instead of real campaign data); Play Store versions below 8.3.73; and reinstalling on the same device without resetting the Google Advertising ID (GAID) first.

### iOS Testing[â](#ios-testing "Direct link to iOS Testing")

1. **Prepare IPA**: Build IPA with SDK integration
2. **Click Link**: Open test URL in Safari - redirects to App Store
3. **Install App**: Install via TestFlight or direct installation
4. **Launch App**: Open app - deferred deep link should be processed

**Example Test URL:**

```
https://yourdomain.u9ilnk.me/d/Af2xeLPI77?pid=Ron+Media+Source&cost_value=0&cost_currency=GBP&lbw=1d&camp=Ron+Referral+Test&dlv=RonTestClass&p2=param_2_value&sdk_param=sdk_param_value
```

## Common Issues[â](#common-issues "Direct link to Common Issues")

| Issue | Solution |
| --- | --- |
| No app store redirect | Check Store Redirect in Apptrove Panel |
| Deep link callback not triggered | Ensure `setDeferredDeeplinkCallbackListener()` is called before SDK initialization |
| Missing deep link data properties | Verify URL includes required parameters and SDK version is 1.6.x+ |
| SDK parameters not received | Check if `sdkParams` object exists before accessing properties |
| Navigation not working | Implement proper null checks for deep link data properties |

**Enhanced Debugging:**

```
// Add comprehensive logging for debugging
sdkConfig.setDeferredDeeplinkCallbackListener(function(deepLinkData) {
  if (!deepLinkData) {
    console.log("No deep link data received");
    return;
  }

  console.log("=== Deep Link Debug Info ===");
  console.log("Full Data:", JSON.stringify(deepLinkData, null, 2));
  console.log("Has URL:", !!deepLinkData.url);
  console.log("Has Deep Link Value:", !!deepLinkData.deepLinkValue);
  console.log("Has SDK Params:", !!deepLinkData.sdkParams);
  console.log("========================");
});
```

For further assistance, contact support at [support@apptrove.com](mailto:support@apptrove.com).
