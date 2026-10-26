# AppTrove iOS SDK — Deferred Deep Linking

Official documentation: https://developers.apptrove.com/docs/ios-sdk/advance-features/deferred-deep-linking

The documentation describes subscribing to attribution/deferred-link results after SDK setup, with an iOS 13+ availability check. Use the exact API exposed by the installed SDK version.

Example pattern from the documentation (verify the exact protocol, callback, and spelling against the package):

```swift
class AppDelegate: UIResponder, UIApplicationDelegate, DeepLinkListener {
    func onDeepLinking(result: DeepLink) {
        let params = result.getUrlParams()
        // Validate parameters and route through the app's existing router.
    }

    func configureAppTrove() {
        let config = AppTroveSDKConfig(
            appToken: "YOUR_APPTROVE_SDK_KEY",
            env: AppTroveSDKConfig.ENV_DEVELOPMENT
        )
        config.setDeeplinkListerner(listener: self)
        AppTroveSDK.initialize(config: config)

        if #available(iOS 13.0, *) {
            AppTroveSDK.subscribeAttributionlink()
        }
    }
}
```

This is a pattern, not a drop-in replacement for a complete `AppDelegate`. Preserve existing methods and avoid duplicate initialization. In particular, verify `setDeeplinkListerner` spelling in the installed API rather than silently renaming it.

## Testing notes

- Deferred deep-link attribution may depend on the install/referrer flow and test setup; repeated installs on one device may not produce identical results every time.
- Use a fresh test device or a documented clean test setup when possible.
- Test a real install flow from the configured link, then confirm the callback and expected parameters.
- Validate all returned parameters before navigating or performing account/business actions.
