# Meta Install Referrer

Official source: https://developers.apptrove.com/docs/flutter-sdk/advance-features/meta-integration

The feature can collect attribution data from Facebook, Instagram, and Facebook Lite campaigns. The official guide lists view-through data, multiple session click-through installs, and enhanced campaign measurement as benefits.

Prerequisite: the actual Facebook App ID from Meta for Developers. Any required GPIR decryption key must be correct and shared with AppTrove; never invent these values.

## AppTrove v2 configuration
Add the App ID to the existing config before the single SDK initialization:
```dart
import 'package:apptrove_sdk_flutter/apptrove_sdk_flutter.dart';

void initializeAppTrove() {
  final config = AppTroveSDKConfig(
    'YOUR_APPTROVE_SDK_KEY',
    'production',
  );
  config.setFacebookAppId('YOUR_FACEBOOK_APP_ID');
  AppTroveFlutterSdk.initializeSDK(config);
}
```
If initialization already exists, edit that config instead of adding a second initialization.

## Android package visibility
The official guide asks for these queries in the top-level `<manifest>` of `android/app/src/main/AndroidManifest.xml`:
```xml
<queries>
    <package android:name="com.facebook.katana" />
    <package android:name="com.facebook.lite" />
    <package android:name="com.instagram.android" />
</queries>
```
Merge into an existing `<queries>` element rather than duplicating it.

## Troubleshooting
Check the App ID, that relevant Meta apps are installed, initialization order, campaign configuration for Meta Install Referrer, and required decryption-key setup. Verify using Meta Ads Manager preview/test flow, SDK logs, and the AppTrove dashboard. A successful build alone does not prove attribution works.
