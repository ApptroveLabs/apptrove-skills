# AppTrove iOS SDK — SDK Signing

Official documentation: https://developers.apptrove.com/docs/ios-sdk/security/sdk-signing

## Credentials

The documentation describes obtaining `secretId` and `secretKey` from the AppTrove dashboard under the application's SDK key/advanced settings.

Example API pattern (verify the exact names/constants in the installed SDK):

```swift
let config = AppTroveSDKConfig(
    appToken: "YOUR_APPTROVE_SDK_KEY",
    env: AppTroveSDKConfig.ENVIRONMENT_PRODUCTION
)
config.setAppSecret(
    secretId: "YOUR_SECRET_ID",
    secretKey: "YOUR_SECRET_KEY"
)
AppTroveSDK.initialize(config: config)
```

Use the correct environment and current API exposed by the installed version.

## Security handling

- Never commit real secret values into a repository, sample app, logs, or screenshots.
- Use your organization's approved secret handling and release process.
- Assume secrets embedded in a mobile application binary may be recoverable by a determined analyst; follow AppTrove's current recommendations for key management and key rotation.
- Do not create, rotate, or replace production credentials without authorization.
- Test signing configuration in a controlled environment and verify expected requests in AppTrove.
