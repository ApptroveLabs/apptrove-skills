# AppTrove iOS SDK — Integration and Initialization

Official documentation: https://developers.apptrove.com/docs/ios-sdk/integration

## SDK key

Get the SDK key for the correct app and environment from the AppTrove dashboard. Use the exact key supplied for the integration; the wrong key can lead to incorrect or missing attribution/reporting.

## Initialize

The documentation recommends initialization from `AppDelegate` early in app startup. Adapt this to the app's existing UIKit or SwiftUI lifecycle and initialize only once.

Example pattern documented for the v2 API family (verify names against the installed SDK):

```swift
import UIKit
import ApptroveSDK // alternatively, the module name for the installed package

let config = AppTroveSDKConfig(
    appToken: "YOUR_APPTROVE_SDK_KEY",
    env: AppTroveSDKConfig.ENV_DEVELOPMENT
)
AppTroveSDK.initialize(config: config)
```

Environment values documented include development, production, and testing. Use the exact enum/constants available in the installed version; do not assume the sample's constant spelling is universal.

## Safe integration rules

- Do not add a second initialization call if one already exists.
- Do not log or commit real SDK keys unnecessarily.
- Preserve existing `didFinishLaunchingWithOptions` return behavior and other setup calls.
- For a SwiftUI `@main` app, inspect any existing `UIApplicationDelegateAdaptor` before adding an app delegate.
- Build after the change and report whether the build was actually run.
