# Deferred Deep Linking

Official source: https://developers.apptrove.com/docs/expo-sdk/advance-features/deferred-deep-linking

---

On this page

SDK Version Selection

Use the tabs below for SDK-specific deferred deep-link setup.

## SDK-Specific Quick Setup[â](#sdk-specific-quick-setup "Direct link to SDK-Specific Quick Setup")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

SDK Version Update (v2.0.1+)

Starting from **v2.0.1**, the Apptrove SDK callback returns a structured `AppTroveDeepLink` object instead of a plain URL string.

```
import { AppTroveSDK, AppTroveConfig, AppTroveDeepLink } from 'apptrove-expo-sdk';

const appTroveConfig = new AppTroveConfig('YOUR_SDK_KEY', AppTroveConfig.EnvironmentProduction);
appTroveConfig.setDeferredDeeplinkCallbackListener((deepLink: AppTroveDeepLink) => {
  console.log('Deferred deep link received');
  console.log('URL:', deepLink.url);
  console.log('Is Deferred:', deepLink.isDeferred);
  console.log('Value:', deepLink.deepLinkValue);
  console.log('Partner ID:', deepLink.partnerId);
  console.log('Site ID:', deepLink.siteId);
  console.log('Campaign:', deepLink.campaign);
  console.log('Campaign ID:', deepLink.campaignId);
  console.log('Ad:', deepLink.ad);
  console.log('Ad ID:', deepLink.adId);
  console.log('Channel:', deepLink.channel);
  console.log('Click ID:', deepLink.clickId);
  console.log('P1-P5:', deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
  if (deepLink.sdkParams) {
    console.log('SDK Params:', JSON.stringify(deepLink.sdkParams));
  }
});

AppTroveSDK.initialize(appTroveConfig);
AppTroveSDK.subscribeDeeplink();
```

SDK Version Update (v1.6.79+)

Starting from **v1.6.79**, the Trackier SDK callback returns a structured `TrackierDeepLink` object instead of a plain URL string.

```
import { TrackierSDK, TrackierConfig, TrackierDeepLink } from 'trackier-expo-sdk';

// 1. Initialize Config
const trackierConfig = new TrackierConfig('YOUR_SDK_KEY', TrackierConfig.EnvironmentProduction);

// 2. Set up deferred deep link listener BEFORE SDK initialization
trackierConfig.setDeferredDeeplinkCallbackListener((deepLink: TrackierDeepLink) => {
  console.log('Deferred deep link received');
  console.log('URL:', deepLink.url);
  console.log('Is Deferred:', deepLink.isDeferred);
  console.log('Value:', deepLink.deepLinkValue);
  console.log('Partner ID:', deepLink.partnerId);
  console.log('Site ID:', deepLink.siteId);
  console.log('Campaign:', deepLink.campaign);
  console.log('Campaign ID:', deepLink.campaignId);
  console.log('Ad:', deepLink.ad);
  console.log('Ad ID:', deepLink.adId);
  console.log('Channel:', deepLink.channel);
  console.log('Click ID:', deepLink.clickId);
  console.log('P1-P5:', deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
  if (deepLink.sdkParams) {
    console.log('SDK Params:', JSON.stringify(deepLink.sdkParams));
  }
});

// 3. Initialize SDK
TrackierSDK.initialize(trackierConfig);

// 4. Subscribe (iOS only)
TrackierSDK.subscribeDeeplink();
```

Deferred deep linking happens when a user clicks a Trackier URL but doesn't have your app installed. The URL redirects to the app store, and when the user installs and opens the app, the SDK retrieves the deep link data.

note

**For iOS Only**: To enable deferred deep link functionality on iOS, you need to call the `subscribeDeeplink()` method after initialization. This allows our server to send the attributed data parameters to the app. For Android, deferred deep linking works automatically without this call.

## Implementation[â](#implementation "Direct link to Implementation")

### 1. Initialize SDK with Deferred Deep Link Callback[â](#1-initialize-sdk-with-deferred-deep-link-callback "Direct link to 1. Initialize SDK with Deferred Deep Link Callback")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppTroveSDK, AppTroveConfig, AppTroveDeepLink } from 'apptrove-expo-sdk';

const App = () => {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = () => {
    const appTroveConfig = new AppTroveConfig('YOUR_SDK_KEY', 'production');

    // Set deferred deep link callback
    appTroveConfig.setDeferredDeeplinkCallbackListener((deepLink: AppTroveDeepLink) => {
      console.log('Deferred Deep Link received');
      console.log('URL:', deepLink.url);
      console.log('Is Deferred:', deepLink.isDeferred);
      console.log('Deep Link Value:', deepLink.deepLinkValue);
      console.log('Partner ID:', deepLink.partnerId);
      console.log('Site ID:', deepLink.siteId);
      console.log('Sub-Site ID:', deepLink.subSiteId);
      console.log('Campaign:', deepLink.campaign);
      console.log('Campaign ID:', deepLink.campaignId);
      console.log('Ad:', deepLink.ad);
      console.log('Ad ID:', deepLink.adId);
      console.log('AdSet:', deepLink.adSet);
      console.log('AdSet ID:', deepLink.adSetId);
      console.log('Channel:', deepLink.channel);
      console.log('Click ID:', deepLink.clickId);
      console.log('Message:', deepLink.message);
      console.log('P1-P5:', deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
      if (deepLink.sdkParams) {
        console.log('SDK Params:', JSON.stringify(deepLink.sdkParams));
      }
      handleDeepLink(deepLink);
    });

    AppTroveSDK.initialize(appTroveConfig);

    // Subscribe to attribution link for deferred deep links (iOS only)
    if (Platform.OS === 'ios') {
      AppTroveSDK.subscribeDeeplink();
    }
  };

  const handleDeepLink = (deepLink: AppTroveDeepLink) => {
    console.log('Processing deep link:', deepLink.url);
    if (deepLink.deepLinkValue) {
      // Handle navigation based on value
      // Example: navigation.navigate('Product', { id: deepLink.p1 });
    }
  };

  return (
    // Your app components
  );
};

export default App;
```

Migration from v2.0.0

If you are upgrading from **v2.0.0**, the callback previously returned a plain URL string. In **v2.0.1+**, it returns a structured `AppTroveDeepLink` object. Update your callback type and logic to directly access properties instead of parsing the URL manually.

App.js

```
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { TrackierSDK, TrackierConfig, TrackierDeepLink } from 'trackier-expo-sdk';

const App = () => {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = () => {
    // 1. Initialize Config
    const trackierConfig = new TrackierConfig('YOUR_SDK_KEY', 'production');

    // 2. Set up deferred deep link listener BEFORE SDK initialization
    trackierConfig.setDeferredDeeplinkCallbackListener((deepLink: TrackierDeepLink) => {
      console.log('Deferred Deep Link received');
      console.log('URL:', deepLink.url);
      console.log('Is Deferred:', deepLink.isDeferred);
      console.log('Deep Link Value:', deepLink.deepLinkValue);
      console.log('Partner ID:', deepLink.partnerId);
      console.log('Site ID:', deepLink.siteId);
      console.log('Sub-Site ID:', deepLink.subSiteId);
      console.log('Campaign:', deepLink.campaign);
      console.log('Campaign ID:', deepLink.campaignId);
      console.log('Ad:', deepLink.ad);
      console.log('Ad ID:', deepLink.adId);
      console.log('AdSet:', deepLink.adSet);
      console.log('AdSet ID:', deepLink.adSetId);
      console.log('Channel:', deepLink.channel);
      console.log('Click ID:', deepLink.clickId);
      console.log('Message:', deepLink.message);
      console.log('P1-P5:', deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
      if (deepLink.sdkParams) {
          console.log('SDK Params:', JSON.stringify(deepLink.sdkParams));
      }
      handleDeepLink(deepLink);
    });

    // 3. Initialize SDK
    TrackierSDK.initialize(trackierConfig);

    // 4. Subscribe to attribution link (iOS only)
    if (Platform.OS === 'ios') {
      TrackierSDK.subscribeDeeplink();
    }
  };

  const handleDeepLink = (deepLink: TrackierDeepLink) => {
    console.log('Processing deep link:', deepLink.url);
    if (deepLink.deepLinkValue) {
        // Handle navigation based on value
    }
  };

  return (
    // Your app components
  );
};

export default App;
```

Migration from v1.6.78

If you are upgrading from **v1.6.78 or earlier**, the callback previously returned a plain URL string. In **v1.6.79+**, it returns a structured `TrackierDeepLink` object. Update your callback type and logic to directly access properties instead of parsing the URL manually.

### 2. Deep Link Data Structure[â](#2-deep-link-data-structure "Direct link to 2. Deep Link Data Structure")

#### Apptrove SDK (v2.0.1+)[â](#apptrove-sdk-v201 "Direct link to Apptrove SDK (v2.0.1+)")

The enhanced callback provides a comprehensive `AppTroveDeepLink` object with the following structure:

```
{
  url: "https://yourbrand.u9ilnk.me/d/NKmWH9E7b1",
  isDeferred: true,
  deepLinkValue: "product",
  partnerId: "12345",
  siteId: "67890",
  subSiteId: "11111",
  campaign: "summer_sale",
  campaignId: "camp_123",
  ad: "banner_ad",
  adId: "ad_456",
  adSet: "mobile_set",
  adSetId: "adset_789",
  channel: "facebook",
  clickId: "click_abc123",
  message: "Welcome offer",
  p1: "param1_value",
  p2: "param2_value",
  p3: "param3_value",
  p4: "param4_value",
  p5: "param5_value",
  sdkParams: {
    "custom_key": "custom_value",
    "user_id": "user123",
    "productid": "jeans",
    "quantity": "3"
  }
}
```

**Properties:**

- `url`: Original deep link URL
- `isDeferred`: Boolean indicating deferred deep link
- `deepLinkValue`: Custom value for navigation logic (dlv parameter)
- `partnerId` / `pid`: Attribution partner ID
- `siteId` / `sid`: Site ID
- `subSiteId` / `ssid`: Sub-site ID
- `campaign` / `camp`: Campaign name
- `campaignId` / `campId`: Campaign ID
- `ad`: Ad name
- `adId`: Ad ID
- `adSet`: Ad set name
- `adSetId`: Ad set ID
- `channel`: Marketing channel
- `clickId`: Click identifier
- `message`: Custom message
- `p1-p5`: Custom parameters
- `sdkParams`: Additional SDK parameters and custom query parameters (object)

#### Trackier SDK (v1.6.79+)[â](#trackier-sdk-v1679 "Direct link to Trackier SDK (v1.6.79+)")

The enhanced callback provides a comprehensive `TrackierDeepLink` object with similar structure to Apptrove SDK.

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
| Deep link not processed | Ensure `subscribeDeeplink()` is called after SDK initialization |
| Missing parameters | Verify URL includes required parameters |

For further assistance, contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com).
