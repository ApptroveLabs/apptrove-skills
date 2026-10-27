# Deep Linking

Official source: https://developers.apptrove.com/docs/react-native-sdk/advance-features/deep-linking

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view deep linking code for your chosen SDK.

Deep linking enables seamless navigation to specific in-app content, enhancing user engagement by directing users to targeted screens within your React Native application. The Apptrove React Native SDK supports two types of deep linking: **Normal Deep Linking** (for users with the app installed) and **Deferred Deep Linking** (for users who install the app via a deep link). This section outlines the setup and implementation for both Android and iOS platforms.

### Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- Apptrove React Native SDK installed and initialized in your project
- A Apptrove MMP account with access to the Apptrove Panel
- React Native 0.60 or later
- For Android:
  - Android API 21 (Android 5.0) or later
- For iOS:
  - iOS 10.0 or later
  - Xcode 12.0 or later
- Basic knowledge of JavaScript, React Native, and platform-specific configurations (e.g., `AndroidManifest.xml`, Xcode)

### Overview[â](#overview "Direct link to Overview")

Deep linking redirects users to specific app content using URLs. The Apptrove SDK handles two scenarios:

- **Normal Deep Linking**: When the app is already installed, the deep link opens the app and navigates to the specified screen.
- **Deferred Deep Linking**: When the app is not installed, the deep link directs users to the app store. After installation, the SDK navigates to the specified screen upon first app launch.

### Normal Deep Linking[â](#normal-deep-linking "Direct link to Normal Deep Linking")

Normal deep linking allows users with the app installed to open specific app screens directly via a deep link URL. Configuration is required for both Android and iOS.

#### Android Configuration[â](#android-configuration "Direct link to Android Configuration")

To handle deep links on Android, configure an activity in the `AndroidManifest.xml` file to respond to deep link URLs.

##### Step 1: Update AndroidManifest.xml[â](#step-1-update-androidmanifestxml "Direct link to Step 1: Update AndroidManifest.xml")

1. Open the `android/app/src/main/AndroidManifest.xml` file in your React Native project.
2. Add an activity with an intent-filter to handle deep links, specifying a unique scheme and host.

##### Example AndroidManifest.xml[â](#example-androidmanifestxml "Direct link to Example AndroidManifest.xml")

AndroidManifest.xml

```
<activity
    android:name=".Activity.FirstProduct"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:host="trackier.u9ilnk.me"
            android:pathPrefix="/product"
            android:scheme="https" />
    </intent-filter>
</activity>
```

##### Example Deep Link URL[â](#example-deep-link-url "Direct link to Example Deep Link URL")

```
https://trackier.u9ilnk.me/product?dlv=FirstProduct&quantity=10&pid=sms
```

##### Step 2: Test the Deep Link[â](#step-2-test-the-deep-link "Direct link to Step 2: Test the Deep Link")

1. Build your React Native project for Android using `npm run android`.
2. Install the APK on a device or emulator.
3. Open the deep link URL in a browser or via an ad to verify it opens the specified activity.

#### iOS Configuration[â](#ios-configuration "Direct link to iOS Configuration")

For iOS, configure Universal Links to enable deep linking, allowing the app to open directly from web URLs.

##### Step 1: Get App Bundle ID and Prefix ID[â](#step-1-get-app-bundle-id-and-prefix-id "Direct link to Step 1: Get App Bundle ID and Prefix ID")

1. Log into your [Apple Developer Account](https://developer.apple.com/).
2. Navigate to **Certificates, IDs & Profiles** > **Identifiers** > **App IDs**.
3. Select your app and copy the **Prefix ID** and **App Bundle ID**.

##### Step 2: Add IDs in Apptrove Panel[â](#step-2-add-ids-in-apptrove-panel "Direct link to Step 2: Add IDs in Apptrove Panel")

1. Log in to your Apptrove Panel.
2. Select your application and click the **Action** button.
3. Navigate to **UniLink** in the Dashboard.
4. Create a template by clicking the **Action** button in the header.
5. Edit the template and add the **Prefix ID** and **App Bundle ID** under **Link Behaviour (When application is installed)**.

##### Step 3: Configure Associated Domains in Xcode[â](#step-3-configure-associated-domains-in-xcode "Direct link to Step 3: Configure Associated Domains in Xcode")

1. Build your React Native project for iOS using `npm run ios` or open the `ios/[YourAppName].xcworkspace` file in Xcode.
2. In Xcode, select your project and target.
3. Go to the **Capabilities** tab and enable **Associated Domains**.
4. Add the unilink subdomain from the Apptrove MMP app settings in the format: `applinks:subdomain.unilink.me`.

note

Apptrove hosts the `apple-app-site-association` file to support Universal Links. Ensure the unilink subdomain is correctly configured in both Apptrove MMP and Xcode.

##### Step 4: Test Universal Links[â](#step-4-test-universal-links "Direct link to Step 4: Test Universal Links")

1. Build and install the app on an iOS device or simulator.
2. Open a Universal Link (e.g., `https://yourbrand.u9ilnk.me`) in Safari to verify it opens the app.

### Deferred Deep Linking[â](#deferred-deep-linking "Direct link to Deferred Deep Linking")

Deferred deep linking directs users to the app store if the app is not installed. After installation, the SDK navigates to the specified screen upon first app launch. This requires setting a callback to handle the deep link URL.

#### Steps to Implement Deferred Deep Linking[â](#steps-to-implement-deferred-deep-linking "Direct link to Steps to Implement Deferred Deep Linking")

1. Capture Deep Link Data in useEffect: capture the deep link URL and forward it to the SDK (`ApptroveSDK.parseDeepLink` or `TrackierSDK.parseDeepLink`).
2. Configure a callback listener on the config object using `setDeferredDeeplinkCallbackListener`.
3. Initialize the SDK with the configured config.
4. Handle the deep link URL in the callback to navigate to the desired screen.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

##### Capture initial URL and forward to SDK[â](#capture-initial-url-and-forward-to-sdk "Direct link to Capture initial URL and forward to SDK")

App.js

```
useEffect(() => {
  const getUrlAsync = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) ApptroveSDK.parseDeepLink(initialUrl);
    setTimeout(() => {
      setUrl(initialUrl);
      setProcessing(false);
    }, 1000);
  };
  getUrlAsync();
}, []);
```

##### Initialize SDK with deferred deep link callback[â](#initialize-sdk-with-deferred-deep-link-callback "Direct link to Initialize SDK with deferred deep link callback")

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("abcf2270-xxxxxxx-xxxx-34903c6e1d53", ApptroveConfig.EnvironmentDevelopment);
  apptroveConfig.setDeferredDeeplinkCallbackListener(function(deepLinkData) {
    console.log("DeepLink Data: " + JSON.stringify(deepLinkData));
    console.log("URL: " + deepLinkData.url);
    console.log("Is Deferred: " + deepLinkData.isDeferred);
    console.log("Deep Link Value: " + deepLinkData.deepLinkValue);
    console.log("Partner ID: " + deepLinkData.partnerId);
    console.log("Campaign: " + deepLinkData.campaign);
    console.log("P1-P5: " + deepLinkData.p1, deepLinkData.p2, deepLinkData.p3, deepLinkData.p4, deepLinkData.p5);
    if (deepLinkData.sdkParams) console.log("SDK Parameters: " + JSON.stringify(deepLinkData.sdkParams));
    handleDeepLinkNavigation(deepLinkData);
  });
  ApptroveSDK.initialize(apptroveConfig);

  const handleDeepLinkNavigation = (deepLinkData) => {
    if (deepLinkData.deepLinkValue) {
      switch (deepLinkData.deepLinkValue) {
        case 'product': console.log('Navigating to product screen'); break;
        case 'profile': console.log('Navigating to profile screen'); break;
        default: console.log('Navigating to home screen');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

##### Capture initial URL and forward to SDK[â](#capture-initial-url-and-forward-to-sdk-1 "Direct link to Capture initial URL and forward to SDK")

App.js

```
useEffect(() => {
  const getUrlAsync = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) TrackierSDK.parseDeepLink(initialUrl);
    setTimeout(() => {
      setUrl(initialUrl);
      setProcessing(false);
    }, 1000);
  };
  getUrlAsync();
}, []);
```

##### Initialize SDK with deferred deep link callback[â](#initialize-sdk-with-deferred-deep-link-callback-1 "Direct link to Initialize SDK with deferred deep link callback")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("abcf2270-xxxxxxx-xxxx-34903c6e1d53", TrackierConfig.EnvironmentDevelopment);
  trackierConfig.setDeferredDeeplinkCallbackListener(function(deepLinkData) {
    console.log("DeepLink Data: " + JSON.stringify(deepLinkData));
    console.log("URL: " + deepLinkData.url);
    console.log("Is Deferred: " + deepLinkData.isDeferred);
    console.log("Deep Link Value: " + deepLinkData.deepLinkValue);
    console.log("Partner ID: " + deepLinkData.partnerId);
    console.log("Campaign: " + deepLinkData.campaign);
    console.log("P1-P5: " + deepLinkData.p1, deepLinkData.p2, deepLinkData.p3, deepLinkData.p4, deepLinkData.p5);
    if (deepLinkData.sdkParams) console.log("SDK Parameters: " + JSON.stringify(deepLinkData.sdkParams));
    handleDeepLinkNavigation(deepLinkData);
  });
  TrackierSDK.initialize(trackierConfig);

  const handleDeepLinkNavigation = (deepLinkData) => {
    if (deepLinkData.deepLinkValue) {
      switch (deepLinkData.deepLinkValue) {
        case 'product': console.log('Navigating to product screen'); break;
        case 'profile': console.log('Navigating to profile screen'); break;
        default: console.log('Navigating to home screen');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

#### Expected Outcome[â](#expected-outcome "Direct link to Expected Outcome")

When a user installs the app via a deep link, the `setDeferredDeeplinkCallbackListener` callback receives a comprehensive deep link data object with the following structure:

note

**Deep Link vs Deferred Deep Link Data**:

- **Regular Deep Link**: You will only get the `deepLinkValue` (dlv) and `sdkParams`
- **Deferred Deep Link**: You will get all parameters including campaign data, partner information, and custom parameters (p1-p5)

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

**Deep Link Data Properties:**

- `url`: The original deep link URL
- `isDeferred`: Boolean indicating if this is a deferred deep link
- `deepLinkValue`: Custom value for app navigation logic
- `partnerId`: ID of the attribution partner
- `campaign`: Campaign name from the deep link
- `p1-p5`: Custom parameters passed in the deep link
- `sdkParams`: Additional SDK-specific parameters (object)

This allows you to implement sophisticated navigation logic based on the comprehensive data provided.

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Test Deep Links Thoroughly**: Test both normal and deferred deep links on Android and iOS to ensure correct navigation.
- **Use Unique Schemes for Android**: Choose a unique `android:scheme` value in `AndroidManifest.xml` to avoid conflicts with other apps.
- **Secure Unilink Subdomain**: Verify the unilink subdomain is correctly configured in Apptrove MMP and Xcode to prevent Universal Link failures.
- **Handle Null URLs**: Add fallback logic in the deferred deep link callback to handle cases where `uri` is null or undefined.
- **Log Deep Link Data**: Use `console.log` to verify deep link URLs during development.
- **Comply with Privacy Regulations**: Ensure deep link data handling complies with GDPR, CCPA, and other privacy laws.

### Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **Deep Links Not Opening App (Android)**:
  - Verify the `AndroidManifest.xml` intent-filter configuration matches the deep link URL structure.
  - Ensure `android:exported="true"` is set for the activity.
  - Test the deep link URL in a browser or via an ad.
- **Universal Links Not Working (iOS)**:
  - Confirm the `applinks:subdomain.unilink.me` entry is correct in Xcode's Associated Domains.
  - Check that the `apple-app-site-association` file is hosted by Apptrove and accessible.
  - Ensure the Prefix ID and App Bundle ID are correctly set in Apptrove MMP.
- **Deferred Deep Link Callback Not Triggered**:
  - Verify the `setDeferredDeeplinkCallbackListener` method is called before SDK initialize.
  - Test the deferred deep link by uninstalling the app, clicking the deep link, and installing via the app store.
  - Check console logs for errors in the callback.
- **General Issues**: Check console logs for SDK or deep link errors.

### Deep Link Resolver[â](#deep-link-resolver "Direct link to Deep Link Resolver")

The Apptrove React Native SDK provides a `resolveDeeplinkUrl` method to resolve deferred deep links and get instant access to the deep link URL.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

#### Using the Deep Link Resolver[â](#using-the-deep-link-resolver "Direct link to Using the Deep Link Resolver")

Deep Link Resolver Example

```
import { ApptroveSDK } from 'react-native-apptrove';

ApptroveSDK.resolveDeeplinkUrl("https://your-domain.u9ilnk.me/d/NKmWH9E7b1")
  .then(result => {
    console.log("Resolved URL:", result);
    handleResolvedDeepLink(result);
  })
  .catch(error => console.error("Failed to resolve deep link:", error));

function handleResolvedDeepLink(resolvedUrl) {
  console.log("Resolved Deep Link URL:", resolvedUrl);
}
```

#### Example Implementation[â](#example-implementation "Direct link to Example Implementation")

App.js

```
import React, { useEffect } from 'react';
import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    const apptroveConfig = new ApptroveConfig("your-app-token", ApptroveConfig.EnvironmentDevelopment);
    ApptroveSDK.initialize(apptroveConfig);
    resolveExampleDeepLink();
  }, []);

  const resolveExampleDeepLink = () => {
    const deepLinkUrl = "https://your-domain.u9ilnk.me/d/NKmWH9E7b1";
    ApptroveSDK.resolveDeeplinkUrl(deepLinkUrl)
      .then(result => console.log("Successfully resolved deep link:", result))
      .catch(error => console.error("Failed to resolve deep link:", error));
  };

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
```

#### Using the Deep Link Resolver[â](#using-the-deep-link-resolver-1 "Direct link to Using the Deep Link Resolver")

Deep Link Resolver Example

```
import { TrackierSDK } from 'react-native-trackier';

TrackierSDK.resolveDeeplinkUrl("https://trackier58.u9ilnk.me/d/NKmWH9E7b1")
  .then(result => {
    console.log("Resolved URL:", result);
    handleResolvedDeepLink(result);
  })
  .catch(error => console.error("Failed to resolve deep link:", error));

function handleResolvedDeepLink(resolvedUrl) {
  console.log("Resolved Deep Link URL:", resolvedUrl);
}
```

#### Example Implementation[â](#example-implementation-1 "Direct link to Example Implementation")

App.js

```
import React, { useEffect } from 'react';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    const trackierConfig = new TrackierConfig("your-app-token", TrackierConfig.EnvironmentDevelopment);
    TrackierSDK.initialize(trackierConfig);
    resolveExampleDeepLink();
  }, []);

  const resolveExampleDeepLink = () => {
    const deepLinkUrl = "https://trackier58.u9ilnk.me/d/NKmWH9E7b1";
    TrackierSDK.resolveDeeplinkUrl(deepLinkUrl)
      .then(result => console.log("Successfully resolved deep link:", result))
      .catch(error => console.error("Failed to resolve deep link:", error));
  };

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
```

For further assistance, refer to the [Apptrove Documentation Portal](https://help.apptrove.com/en/) or contact support at [support@apptrove.com](mailto:support@apptrove.com).
