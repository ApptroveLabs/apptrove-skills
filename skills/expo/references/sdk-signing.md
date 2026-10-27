# SDK Signing

Official source: https://developers.apptrove.com/docs/expo-sdk/security/sdk-signing

---

On this page

SDK Version Selection

Use the tabs below for SDK-specific signing implementation.

## SDK-Specific Quick Signing Setup[â](#sdk-specific-quick-signing-setup "Direct link to SDK-Specific Quick Signing Setup")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import { AppTroveConfig, AppTroveSDK } from 'apptrove-expo-sdk';

const sdkConfig = new AppTroveConfig(TR_SDK_KEY, AppTroveConfig.EnvironmentDevelopment);
sdkConfig.setAppSecret('your_secret_id', 'your_secret_key');
AppTroveSDK.initialize(sdkConfig);
```

```
import { TrackierConfig, TrackierSDK } from 'trackier-expo-sdk';

const sdkConfig = new TrackierConfig(TR_SDK_KEY, TrackierConfig.EnvironmentDevelopment);
sdkConfig.setAppSecret('your_secret_id', 'your_secret_key');
TrackierSDK.initialize(sdkConfig);
```

SDK signing enhances the security of your Apptrove Expo SDK integration by authenticating API requests with a secretId and secretKey. This ensures that tracking data is securely attributed to your app, preventing unauthorized access.

## Purpose[â](#purpose "Direct link to Purpose")

SDK signing provides security for your attribution implementation:

- **Request Authentication**: All API requests are signed with unique credentials
- **Data Integrity**: Ensures tracking data cannot be tampered with
- **Fraud Prevention**: Prevents unauthorized access to your attribution data

## Retrieving Your Secret ID and Key[â](#retrieving-your-secret-id-and-key "Direct link to Retrieving Your Secret ID and Key")

1. Login to your Apptrove Panel and select your application
2. In the Dashboard, click the three dots in the left bottom corner
3. Click on the "Advanced" tab to access signing credentials
4. Click on the "Add secret key" button to generate your secret ID and key

important

Keep your secret credentials secure and never expose them in client-side code.

## Implementation[â](#implementation "Direct link to Implementation")

SDK signing is configured during SDK initialization using the `setAppSecret` method.

### Basic Configuration[â](#basic-configuration "Direct link to Basic Configuration")

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

```
import React, { useEffect } from 'react';
import { AppTroveConfig, AppTroveSDK } from 'apptrove-expo-sdk';

export default function App() {
  useEffect(() => {
    const TR_SDK_KEY = "XXXXXXX-XXXX-XXXX-80e3-5938fadff";

    const appTroveConfig = new AppTroveConfig(TR_SDK_KEY, AppTroveConfig.EnvironmentDevelopment);

    // Configure SDK signing
    appTroveConfig.setAppSecret("your_secret_id", "your_secret_key");

    AppTroveSDK.initialize(appTroveConfig);
  }, []);

  return (
    // Your app content
  );
}
```

```
import React, { useEffect } from 'react';
import { TrackierConfig, TrackierSDK } from 'trackier-expo-sdk';

export default function App() {
  useEffect(() => {
    const TR_SDK_KEY = "XXXXXXX-XXXX-XXXX-80e3-5938fadff";

    const trackierConfig = new TrackierConfig(TR_SDK_KEY, TrackierConfig.EnvironmentDevelopment);

    // Configure SDK signing
    trackierConfig.setAppSecret("your_secret_id", "your_secret_key");

    TrackierSDK.initialize(trackierConfig);
  }, []);

  return (
    // Your app content
  );
}
```

## How It Works[â](#how-it-works "Direct link to How It Works")

1. **Secret Configuration**: Your secret ID and secret key are configured during SDK initialization
2. **Request Signing**: All requests sent to Trackier servers are automatically signed
3. **Server Verification**: Trackier servers verify the signature to ensure authenticity

info

SDK signing is applied automatically to all tracking requests once configured.

## Security Benefits[â](#security-benefits "Direct link to Security Benefits")

- **Request Authenticity**: Ensures requests come from your authorized app
- **Data Integrity**: Prevents tampering with request data
- **Unauthorized Access Prevention**: Blocks requests from unauthorized sources

## Best Practices[â](#best-practices "Direct link to Best Practices")

- **Secure Storage**: Store secrets securely using environment variables
- **Environment Separation**: Use different secrets for development and production
- **Regular Updates**: Update secrets periodically for enhanced security
- **Access Control**: Limit access to your secret credentials

## Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

### Common Issues[â](#common-issues "Direct link to Common Issues")

- **Invalid Secrets**: Verify your secret ID and secret key in the Apptrove Panel
- **Configuration Errors**: Ensure `setAppSecret` is called before `initialize`
- **Network Issues**: Check network connectivity to Trackier servers

### Debug Steps[â](#debug-steps "Direct link to Debug Steps")

1. Verify your secret ID and secret key in the Apptrove Panel
2. Check that `setAppSecret` is called before `initialize`
3. Monitor network requests to ensure they're being signed
4. Check Apptrove Panel for authentication errors

## Next Steps[â](#next-steps "Direct link to Next Steps")

After implementing SDK signing:

1. Test the feature to ensure requests are properly signed
2. Monitor your Apptrove Panel for authentication issues
3. Contact Apptrove support at [support@apptrove.com](mailto:support@apptrove.com) if needed
