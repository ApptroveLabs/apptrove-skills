# SDK Signing

Official source: https://developers.apptrove.com/docs/react-native-sdk/security/sdk-signing

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view SDK signing code for your chosen SDK.

SDK signing enhances the security of the Apptrove React Native SDK by authenticating requests sent to the Apptrove MMP using a secret ID and secret key. This ensures data integrity and prevents unauthorized access to your tracking data. This section outlines how to configure SDK signing in your React Native application.

### Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- Apptrove React Native SDK installed and initialized in your project
- A Apptrove MMP account with access to the Apptrove Panel
- React Native 0.60 or later
- Basic knowledge of JavaScript and React Native development

### Configure SDK Signing[â](#configure-sdk-signing "Direct link to Configure SDK Signing")

To enable SDK signing, retrieve the secret ID and secret key from the Apptrove Panel and add them to the SDK configuration during initialization.

#### Step 1: Retrieve Secret ID and Secret Key[â](#step-1-retrieve-secret-id-and-secret-key "Direct link to Step 1: Retrieve Secret ID and Secret Key")

1. Log in to your Apptrove Panel.
2. Select your application from the Dashboard.
3. Navigate to **SDK Integration** via the left-side navigation menu.
4. Click on the **Advanced** tab under SDK Integration.
5. Copy the **Secret ID** and **Secret Key** displayed.

#### Step 2: Add Signing to SDK Initialization[â](#step-2-add-signing-to-sdk-initialization "Direct link to Step 2: Add Signing to SDK Initialization")

Modify your SDK initialization code to include the secret ID and secret key using the `setAppSecret` method of the config object (e.g., `ApptroveConfig` or `TrackierConfig`).

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

##### JavaScript Example[â](#javascript-example "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("67607dc5-xxxx-xxxx-xxxx-b577324d97ce", ApptroveConfig.EnvironmentDevelopment);
  apptroveConfig.setAppSecret("640710587xxxx6ac0cb370", "9e043b7e-7f44-403c-xxxx-8cf6bfe8daa0"); // Pass secretId and secretKey
  ApptroveSDK.initialize(apptroveConfig);

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK with Signing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

##### JavaScript Example[â](#javascript-example-1 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("67607dc5-xxxx-xxxx-xxxx-b577324d97ce", TrackierConfig.EnvironmentDevelopment);
  trackierConfig.setAppSecret("640710587xxxx6ac0cb370", "9e043b7e-7f44-403c-xxxx-8cf6bfe8daa0"); // Pass secretId and secretKey
  TrackierSDK.initialize(trackierConfig);

  return (
    <View style={styles.container}>
      <Text>Apptrove React Native SDK with Signing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

#### Parameters[â](#parameters "Direct link to Parameters")

- **Secret ID**: The unique identifier for request authentication (e.g., `"640710587xxxx6ac0cb370"`).
- **Secret Key**: The secure key paired with the secret ID (e.g., `"9e043b7e-7f44-403c-xxxx-8cf6bfe8daa0"`).

#### Expected Outcome[â](#expected-outcome "Direct link to Expected Outcome")

The SDK will sign all requests with the provided secret ID and key, ensuring secure communication with the Apptrove MMP. You can verify successful authentication by checking tracking data (e.g., events, user data) in the Apptrove Panel without errors.

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Secure Secret Credentials**: Store the secret ID and key securely in environment variables or a configuration file, avoiding hardcoding in source code.
- **Validate Credentials**: Ensure the secret ID and key are correctly copied from the Apptrove Panel to prevent authentication failures.
- **Test in Development Mode**: Use `ApptroveConfig.EnvironmentDevelopment` or `TrackierConfig.EnvironmentDevelopment` to test SDK signing without affecting production data.
- **Initialize Early**: Call `setAppSecret` during SDK initialization (before `ApptroveSDK.initialize` or `TrackierSDK.initialize`) to ensure all subsequent requests are signed.
- **Monitor Authentication**: Check the Apptrove Panel for any authentication-related issues during testing.
- **Comply with Privacy Regulations**: Ensure secure handling of tracking data complies with GDPR, CCPA, and other privacy laws.

### Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **Authentication Errors**:
  - Verify the secret ID and key match the values in the Apptrove Panel's **Advanced** tab.
  - Ensure `setAppSecret` is called before `ApptroveSDK.initialize` or `TrackierSDK.initialize`.
  - Check console logs for authentication-related errors.
- **Tracking Data Not Appearing**:
  - Confirm the SDK is initialized with the correct app token and environment.
  - Ensure the secret ID and key are associated with the correct application in the Apptrove Panel.
- **General Issues**:
  - Check console logs for errors related to SDK initialize (`ApptroveSDK.initialize` or `TrackierSDK.initialize`).

For further assistance, refer to the [Apptrove Documentation Portal](https://help.apptrove.com/en/) or contact support at [support@apptrove.com](mailto:support@apptrove.com).
