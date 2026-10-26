# AppTrove iOS SDK — Installation

Official documentation: https://developers.apptrove.com/docs/ios-sdk/installation

## Before you start

- Confirm the app exists in AppTrove and obtain the SDK key for the correct app and environment.
- Inspect the current deployment target, Xcode version, Swift version, and dependency manager.
- The documentation has listed iOS 10+ and Xcode 12+ as requirements, but the actual requirements can vary by SDK release and dependencies. Verify the installed SDK's current release requirements rather than raising or lowering the app's deployment target without checking.

## CocoaPods

Add the dependency to the existing `Podfile`:

```ruby
pod 'apptrove-ios-sdk'
```

Then run:

```bash
pod install
```

Open the generated `.xcworkspace` in Xcode, not the `.xcodeproj`.

Swift import shown by the documentation:

```swift
import apptrove_ios_sdk
```

Objective-C import shown by the documentation:

```objc
@import apptrove_ios_sdk;
```

Do not add a second copy of the dependency if it is already declared. Check `Podfile.lock` and resolve version conflicts deliberately.

## Swift Package Manager

The documentation lists this package repository:

```text
https://github.com/ApptroveLabs/Trackier_iOS_SDK.git
```

In Xcode, add the package dependency, select the AppTroveSDK product/target offered by the package, and import the module name supported by the resolved package version. The documentation shows:

```swift
import ApptroveSDK
```

Objective-C import shown by the documentation:

```objc
@import ApptroveSDK;
```

Verify the repository URL, product name, and module name against the current official documentation and resolved package version before editing.

## Validation

- Confirm Xcode resolves the package/pods.
- Build the app target and any relevant extensions.
- Do not mix CocoaPods and SPM for the same SDK unless the project explicitly requires and supports that setup.
