# AppTrove iOS SDK Integration Skill

## Objective

Integrate the AppTrove iOS SDK for attribution, events, SKAN, ATT, and deep linking.

## Distribution Options

### CocoaPods (recommended for most apps)

Pod: `apptrove-ios-sdk` version `~> 2.0.6`

```ruby
pod 'apptrove-ios-sdk', '~> 2.0.6'
```

```bash
pod install
```

Swift import: `import apptrove_ios_sdk`

### Swift Package Manager

- URL: `https://github.com/ApptroveLabs/Trackier_iOS_SDK.git`
- Product: `ApptroveSDK`
- Version: from `2.0.4`

Swift import: `import ApptroveSDK`

Do **not** use the old pod name `trackier-ios-sdk` or class names `TrackierSDK` / `TrackierSDKConfig`.

## SDK Initialization

Classes: `AppTroveSDK`, `AppTroveSDKConfig`, `AppTroveEvent`, `DeepLinkListener`

```swift
import apptrove_ios_sdk // or import ApptroveSDK for SPM
import AppTrackingTransparency

class AppDelegate: UIResponder, UIApplicationDelegate, DeepLinkListener {

    func onDeepLinking(result: DeepLink) {
        print(result.getUrl())
    }

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let config = AppTroveSDKConfig(
            appToken: "YOUR_APP_TOKEN",
            env: AppTroveSDKConfig.ENV_DEVELOPMENT
        )
        config.setDeeplinkListerner(listener: self) // API spelling is Listerner
        config.enableSkanAttribution()
        AppTroveSDK.waitForATTUserAuthorization(timeoutInterval: 20)
        AppTroveSDK.initialize(config: config)
        return true
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        AppTroveSDK.trackSession()
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { _ in }
        }
    }
}
```

Environments: `ENVIRONMENT_PRODUCTION`, `ENV_DEVELOPMENT`, `ENV_TESTING`.

## User + Events

```swift
AppTroveSDK.setUserID(userId: "user-123") // Swift API is setUserID (docs sometimes show setUserId)
AppTroveSDK.setUserEmail(userEmail: "a@b.com")

let event = AppTroveEvent(id: AppTroveEvent.LOGIN)
event.addEventValue(prop: "key", val: "value")
event.setRevenue(revenue: 10.0, currency: "INR")
AppTroveSDK.trackEvent(event: event)
```

## Deep Links / Universal Links

1. Xcode → Signing & Capabilities → Associated Domains: `applinks:YOUR_SUBDOMAIN.unilink.me`
2. Configure prefix + bundle ID in AppTrove MMP UniLink panel
3. When URL is received: `AppTroveSDK.parseDeepLink(uri: url.absoluteString)`
4. Deferred install: `AppTroveSDK.subscribeAttributionlink()` (iOS 13+)

## Info.plist

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads.</string>
```

## Push

```swift
AppTroveSDK.sendAPNToken(token: deviceTokenString)
// or
AppTroveSDK.setDeviceToken(deviceToken: token)
```

## Apple Search Ads

```swift
if #available(iOS 14.3, *) {
    if let token = try? AAAttribution.attributionToken() {
        AppTroveSDK.updateAppleAdsToken(token: token)
    }
}
```

## Validation Checklist

- [ ] Pod or SPM product added
- [ ] `AppTroveSDK.initialize(config:)` in AppDelegate
- [ ] Correct import for distribution channel
- [ ] ATT usage description present
- [ ] Associated Domains configured if using Universal Links
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
