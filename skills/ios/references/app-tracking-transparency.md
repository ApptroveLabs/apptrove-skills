# AppTrove iOS SDK — App Tracking Transparency (ATT) and IDFA

Official documentation: https://developers.apptrove.com/docs/ios-sdk/additional-features/app-tracking-transparency

## Usage description

If the app requests tracking authorization, add `NSUserTrackingUsageDescription` to `Info.plist` with a truthful explanation of why the app asks for permission. Do not use generic or misleading copy.

## Waiting for ATT

The AppTrove documentation describes calling this before SDK initialization:

```swift
AppTroveSDK.waitForATTUserAuthorization(timeoutInterval: 20)
```

Then initialize the SDK using the normal configuration. Verify this API and its exact behavior against the installed SDK version before using it.

## Important behavior

- ATT authorization may be authorized, denied, restricted, or not determined.
- Do not assume IDFA will be available. The app must handle the user's choice and SDK behavior without breaking core functionality.
- Do not repeatedly show the system prompt; iOS controls when it can be presented.
- Avoid waiting indefinitely for the prompt or blocking app startup.
- Test both authorized and denied flows on supported devices/OS versions.
- If deferred deep linking or initialization timing is affected by ATT waiting, validate the complete startup and attribution flow instead of adding the wait blindly.
