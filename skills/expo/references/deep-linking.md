# Deep Linking

Official source: https://developers.apptrove.com/docs/expo-sdk/advance-features/deep-linking

---

On this page

SDK Version Selection

Use the tabs below for SDK-specific deep-link implementation.

## SDK-Specific Quick Deep Link Setup[â](#sdk-specific-quick-deep-link-setup "Direct link to SDK-Specific Quick Deep Link Setup")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

SDK Version Update (v2.0.1+)

Starting from **v2.0.1**, the Apptrove SDK callback returns a structured `AppTroveDeepLink` object instead of a plain URL string.

```
import { AppTroveConfig, AppTroveSDK, AppTroveDeepLink } from 'apptrove-expo-sdk';

const config = new AppTroveConfig('YOUR_SDK_KEY', AppTroveConfig.EnvironmentDevelopment);
config.setDeferredDeeplinkCallbackListener((deepLink: AppTroveDeepLink) => {
  console.log('Deferred deep link received');
  console.log('URL:', deepLink.url);
  console.log('Is Deferred:', deepLink.isDeferred);
  console.log('Value:', deepLink.deepLinkValue);
  console.log('Partner:', deepLink.partnerId);
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
AppTroveSDK.initialize(config);
```

SDK Version Update (v1.6.79+)

Starting from **v1.6.79**, the Trackier SDK callback returns a structured `TrackierDeepLink` object instead of a plain URL string.

```
import { TrackierConfig, TrackierSDK, TrackierDeepLink } from 'trackier-expo-sdk';

// 1. Initialize Config
const config = new TrackierConfig('YOUR_SDK_KEY', TrackierConfig.EnvironmentDevelopment);

// 2. Set up listener BEFORE initialization
config.setDeferredDeeplinkCallbackListener((deepLink: TrackierDeepLink) => {
  console.log('Deferred deep link received');
  console.log('URL:', deepLink.url);
  console.log('Is Deferred:', deepLink.isDeferred);
  console.log('Value:', deepLink.deepLinkValue);
  console.log('Partner:', deepLink.partnerId);
  console.log('Site ID:', deepLink.siteId);
  console.log('Campaign:', deepLink.campaign);
  console.log('Campaign ID:', deepLink.campaignId);
  console.log('Ad:', deepLink.ad);
  console.log('Ad ID:', deepLink.adId);
  console.log('Channel:', deepLink.channel);
  console.log('Click ID:', deepLink.clickId);
  console.log('P1-P5:', deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
});

// 3. Initialize SDK
TrackierSDK.initialize(config);

// 4. Parse immediate deep links AFTER initialization
// (See detailed implementation below)
```

Deep linking is a technique that allows users to navigate directly to specific content within your app by clicking on a link. The Apptrove Expo SDK supports deferred deep linking, which handles cases where users need to install your app first.

---

## Understanding Deferred Deep Linking[â](#understanding-deferred-deep-linking "Direct link to Understanding Deferred Deep Linking")

Deferred deep linking occurs when a user does not have your app installed on their device. When this is the case, the deep link will first send the user to the device app store to install the app. Once the user has installed and opened the app, the SDK will redirect them to the screen specified in the link.

---

## Deep Linking Scenario[â](#deep-linking-scenario "Direct link to Deep Linking Scenario")

---

## Overview[â](#overview "Direct link to Overview")

Deferred deep linking ensures users reach intended content seamlessly:

- **Immediate Deep Link**: When the app is already installed, the app captures the URL and navigates to the specified screen.
- **Deferred Deep Link**: When the app is not installed, Trackier redirects to the app store. After installation, the SDK navigates to the specified screen.
- **Use Case**: Show "Product: jeans, Quantity: 3" after clicking a link like `https://trackier.u9ilnk.me/d/PGJ2m4NtPd?dlv=standard&productid=jeans&quantity=3`.

### Example URLs:[â](#example-urls "Direct link to Example URLs:")

- **Short**: `https://trackier.u9ilnk.me/d/PGJ2m4NtPd`
- **Long**: `https://trackier.u9ilnk.me/d/PGJ2m4NtPd?pid=QR_Code&cost_value=100343&cost_currency=USD&lbw=1h&camp=VistMarketCampaign&dlv=standard&p1=reewrwrwerwe&p2=New+Product&productid=jeans&quantity=3&id=3234234`

---

## Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- **Apptrove Expo SDK**: `trackier-expo-sdk` installed in your project
- **Expo**: Expo SDK 48+ or later
- **Apptrove Panel**: Configured through Panel with deep link settings
- **App Store/Play Store**: App available for testing
- **Dependencies**: Internet permission

---

## Configuration via Expo Config (`app.json`)[â](#configuration-via-expo-config-appjson "Direct link to configuration-via-expo-config-appjson")

To handle deep links without manually editing `AndroidManifest.xml` or `Info.plist`, configure your deep link settings directly in your `app.json` or `app.config.js`.

### Step 1: Configure URL Scheme[â](#step-1-configure-url-scheme "Direct link to Step 1: Configure URL Scheme")

Define a custom URL scheme for your app. This allows your app to be opened via URIs like `my-scheme://`.

app.json

```
{
  "expo": {
    "scheme": "my-scheme",
    // ...
  }
}
```

### Step 2: Configure Android App Links[â](#step-2-configure-android-app-links "Direct link to Step 2: Configure Android App Links")

To support Android App Links (e.g., `https://yourbrand.u9ilnk.me/...`), add `intentFilters` to the `android` section of your `app.json`.

app.json

```
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "yourbrand.u9ilnk.me",
              "pathPrefix": "/product"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Step 3: Configure iOS Universal Links[â](#step-3-configure-ios-universal-links "Direct link to Step 3: Configure iOS Universal Links")

To support iOS Universal Links, add your associated domain to the `ios` section of your `app.json`.

app.json

```
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:yourbrand.u9ilnk.me"
      ]
    }
  }
}
```

### Step 4: Apply Configuration[â](#step-4-apply-configuration "Direct link to Step 4: Apply Configuration")

After updating `app.json`, you must regenerate your native project files (if using Bare workflow or CNG) to apply the changes.

```
npx expo prebuild
```

---

## Deep Link Handling[â](#deep-link-handling "Direct link to Deep Link Handling")

The SDK handles deep links in two scenarios:

1. **Immediate Deep Link**: When the app is already installed and opened via deep link
2. **Deferred Deep Link**: When the app is installed via deep link and opened for the first time

### Step 1: Handle Immediate Deep Links[â](#step-1-handle-immediate-deep-links "Direct link to Step 1: Handle Immediate Deep Links")

When the app opens via deep link, pass the URL to the Trackier SDK for tracking:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { AppTroveConfig, AppTroveSDK, AppTroveDeepLink } from 'apptrove-expo-sdk';

export default function App() {
  useEffect(() => {
    // Handle immediate deep links when app opens
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Pass the deep link to AppTrove SDK for tracking
        AppTroveSDK.parseDeepLink(initialUrl);
      }
    };

    getUrlAsync();
  }, []);

  return (
    // Your app content
  );
}
```

```
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { TrackierConfig, TrackierSDK } from 'trackier-expo-sdk';

export default function App() {
  useEffect(() => {
    // Handle immediate deep links when app opens
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Pass the deep link to Trackier SDK for tracking
        TrackierSDK.parseDeepLink(initialUrl);
      }
    };

    getUrlAsync();
  }, []);

  return (
    // Your app content
  );
}
```

### Step 2: Configure Deferred Deep Link Callback[â](#step-2-configure-deferred-deep-link-callback "Direct link to Step 2: Configure Deferred Deep Link Callback")

Set up the deferred deep link callback during SDK initialization to handle cases where users install the app via deep link:

#### Step 2.1: Initialize SDK with Deferred Deep Link Callback[â](#step-21-initialize-sdk-with-deferred-deep-link-callback "Direct link to Step 2.1: Initialize SDK with Deferred Deep Link Callback")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { AppTroveConfig, AppTroveSDK, AppTroveDeepLink } from 'apptrove-expo-sdk';

export default function App() {
  useEffect(() => {
    // Handle immediate deep links
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        AppTroveSDK.parseDeepLink(initialUrl);
      }
    };

    getUrlAsync();

    // Initialize SDK with deferred deep link callback
    const appTroveConfig = new AppTroveConfig("XXXXXXX-XXXX-XXXX-80e3-5938fadff", AppTroveConfig.EnvironmentDevelopment);

    // Configure deferred deep link callback
    appTroveConfig.setDeferredDeeplinkCallbackListener((deepLink: AppTroveDeepLink) => {
      console.log("Deferred Deeplink Callback received");
      console.log("URL:", deepLink.url);
      console.log("Is Deferred:", deepLink.isDeferred);
      console.log("Deep Link Value:", deepLink.deepLinkValue);
      console.log("Partner ID:", deepLink.partnerId);
      console.log("Campaign:", deepLink.campaign);
      console.log("P1-P5:", deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
      if (deepLink.sdkParams) {
        console.log("SDK Params:", JSON.stringify(deepLink.sdkParams));
      }

      // Handle the deferred deep link
      handleDeferredDeepLink(deepLink);
    });

    AppTroveSDK.initialize(appTroveConfig);
  }, []);

  function handleDeferredDeepLink(deepLink: AppTroveDeepLink) {
    console.log('Processing deferred deep link:', deepLink.url);

    if (deepLink.deepLinkValue === 'FirstProduct') {
      // Use structured data instead of parsing URL
      const productId = deepLink.sdkParams?.productid;
      const quantity = deepLink.sdkParams?.quantity;
      console.log('Product details:', { productId, quantity });
      // navigation.navigate('Product', { productId, quantity });
    }
  }

  return (
    // Your app content
  );
}
```

Migration from v2.0.0

If you are upgrading from **v2.0.0**, the callback previously returned a plain URL string. In **v2.0.1+**, it returns a structured `AppTroveDeepLink` object. Update your callback handler to access properties directly without manual URL parsing.

```
import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierDeepLink } from 'trackier-expo-sdk';

export default function App() {
  useEffect(() => {
    const initializeSDK = async () => {
      // 1. Initialize SDK with deferred deep link callback
      const trackierConfig = new TrackierConfig("XXXXXXX-XXXX-XXXX-80e3-5938fadff", TrackierConfig.EnvironmentDevelopment);

      // 2. Configure deferred deep link callback BEFORE initialization
      trackierConfig.setDeferredDeeplinkCallbackListener((deepLink: TrackierDeepLink) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL:", deepLink.url);
        console.log("Is Deferred:", deepLink.isDeferred);
        console.log("Deep Link Value:", deepLink.deepLinkValue);
        console.log("Partner ID (pid):", deepLink.partnerId);
        console.log("Site ID (sid):", deepLink.siteId);
        console.log("Sub-Site ID (ssid):", deepLink.subSiteId);
        console.log("Campaign (camp):", deepLink.campaign);
        console.log("Campaign ID (campId):", deepLink.campaignId);
        console.log("Ad:", deepLink.ad);
        console.log("Ad ID:", deepLink.adId);
        console.log("AdSet:", deepLink.adSet);
        console.log("AdSet ID:", deepLink.adSetId);
        console.log("Channel:", deepLink.channel);
        console.log("Click ID:", deepLink.clickId);
        console.log("Message:", deepLink.message);
        console.log("P1-P5:", deepLink.p1, deepLink.p2, deepLink.p3, deepLink.p4, deepLink.p5);
        if (deepLink.sdkParams) {
          console.log("SDK Params:", JSON.stringify(deepLink.sdkParams));
        }

        // Handle the deferred deep link
        handleDeepLink(deepLink);
      });

      // 3. Initialize SDK
      TrackierSDK.initialize(trackierConfig);

      // 4. Handle immediate deep links AFTER initialization
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        TrackierSDK.parseDeepLink(initialUrl);
      }

      // 5. Subscribe to attribution link (iOS only)
      if (Platform.OS === 'ios') {
        TrackierSDK.subscribeDeeplink();
      }
    };

    initializeSDK();
  }, []);

  function handleDeepLink(deepLink: TrackierDeepLink) {
    console.log('Processing deep link:', deepLink.url);
    if (deepLink.deepLinkValue) {
        // Navigate using deepLink.deepLinkValue
    }
  }

  return (
    // Your app content
  );
}
```

#### Step 2.2: Test Your Implementation[â](#step-22-test-your-implementation "Direct link to Step 2.2: Test Your Implementation")

1. **Test Immediate Deep Links**:

   - Install your app on a device
   - Click a deep link URL (e.g., `https://trackier.u9ilnk.me/product?dlv=FirstProduct&productid=jeans&quantity=3`)
   - Verify the app opens and logs the deep link
2. **Test Deferred Deep Links**:

   - Uninstall your app from the device
   - Click a deep link URL
   - Verify redirection to the app store
   - Install and open the app
   - Verify the app navigates to the correct screen based on the deep link

---

## Deep Link URL Structure[â](#deep-link-url-structure "Direct link to Deep Link URL Structure")

Deep links follow this structure:

```
https://yourbrand.u9ilnk.me/product?dlv=FirstProduct&quantity=10&pid=sms
```

Where:

- `dlv`: Deep link value (screen identifier)
- `quantity`: Product quantity
- `pid`: Product ID

---

## Resolving Deep Link URLs[â](#resolving-deep-link-urls "Direct link to Resolving Deep Link URLs")

The SDK provides a utility method to resolve dynamic links and extract SDK parameters. Use `resolveDeeplinkUrl` to resolve deep link URLs:

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { AppTroveConfig, AppTroveSDK, AppTroveDeepLink } from 'apptrove-expo-sdk';

async function resolveDeepLink() {
  try {
    const deepLinkUrl = "https://yourbrand.u9ilnk.me/d/PGJ2m4NtPd?dlv=standard&productid=jeans&quantity=3";

    const result = await AppTroveSDK.resolveDeeplinkUrl(deepLinkUrl);

    console.log("Resolved URL:", result.url);
    console.log("SDK Parameters:", result.sdkParams);
  } catch (error) {
    console.error("Error resolving deep link:", error);
  }
}
```

```
import { TrackierConfig, TrackierSDK } from 'trackier-expo-sdk';

async function resolveDeepLink() {
  try {
    const deepLinkUrl = "https://trackier.u9ilnk.me/d/PGJ2m4NtPd?dlv=standard&productid=jeans&quantity=3";

    const result = await TrackierSDK.resolveDeeplinkUrl(deepLinkUrl);

    console.log("Resolved URL:", result.url);
    console.log("SDK Parameters:", result.sdkParams);
  } catch (error) {
    console.error("Error resolving deep link:", error);
  }
}
```

---

## Steps to Test Deferred Deep Linking[â](#steps-to-test-deferred-deep-linking "Direct link to Steps to Test Deferred Deep Linking")

Follow these comprehensive steps to properly test deferred deep linking functionality:

**Prerequisites**

- **APK File**: Ensure you have the APK file integrated with the Apptrove SDK
- **Test Device**: Android device with File Manager or WhatsApp access
- **Test URL**: Valid deferred deep link URL with all required parameters

#### Step-by-Step Testing Process[â](#step-by-step-testing-process "Direct link to Step-by-Step Testing Process")

**1. Prepare the APK**

- Store the APK file locally on your device
- Keep it accessible in File Manager or WhatsApp (as a file message)
- Ensure the APK contains the latest SDK integration

**2. Trigger the Deferred Link**
Click on the test deep link containing all required parameters:

```
https://yourdomain.u9ilnk.me/d/Af2xeLPI77?pid=Ron+Media+Source&cost_value=0&cost_currency=GBP&lbw=1d&camp=Ron+Referral+Test&dlv=RonTestClass&p2=param_2_value&sdk_param=sdk_param_value
```

**Expected Behavior**

The link should redirect you to the Google Play Store page of your app.

**3. Install from Local APK (Instead of Play Store)**

- Once redirected to the Play Store, **minimize it** (don't install from there)
- Open the File Manager (or WhatsApp) where the prepared APK is stored
- This simulates the deferred deep link scenario without using the actual Play Store

**4. Install the APK Manually**

- Tap on the APK file and install it on the device
- Grant necessary permissions during installation
- Complete the installation process

**5. Launch the App**

- Open the freshly installed app
- The SDK should automatically process the deferred deep link
- Verify that the deep link parameters are correctly received and processed

**Important Notes**

- Always test with fresh app installations to simulate real user scenarios
- Verify that the SDK is properly initialized before processing deep links
- Test on both development and production environments
- Ensure network connectivity during testing

## Best Practices[â](#best-practices "Direct link to Best Practices")

- **URL Parsing**: Implement robust URL parsing to handle various deep link formats
- **Error Handling**: Add error handling for malformed URLs or missing parameters
- **Navigation**: Use your app's navigation system to properly route users to the correct screens
- **Testing**: Test deep links thoroughly on both Android and iOS devices
- **Fallbacks**: Provide fallback navigation for cases where deep link parameters are missing or invalid

---

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **Deep Links Not Opening App**: Verify the deep link URL structure and ensure the app is properly configured
- **Deferred Deep Link Callback Not Triggered**: Verify the `setDeferredDeeplinkCallbackListener` method is called before `TrackierSDK.initialize`
- **Missing Parameters**: Confirm URL includes required parameters like `dlv`, `productid`, and `quantity`
- **No Events Logged**: Validate SDK key and network connectivity

---

## Next Steps[â](#next-steps "Direct link to Next Steps")

After implementing deep linking:

1. Test deep links on both Android and iOS devices
2. Implement uninstall tracking to monitor user retention
3. For assistance, contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com)
