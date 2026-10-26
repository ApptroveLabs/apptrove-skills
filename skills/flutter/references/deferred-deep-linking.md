# Deferred Deep Linking

Official source: https://developers.apptrove.com/docs/flutter-sdk/advance-features/deferred-deep-linking

Deferred deep linking applies when a user clicks a configured link before installing the app; after install and first launch, the SDK supplies link data for navigation.

## AppTrove v2 pattern
```dart
import 'dart:io' show Platform;
import 'package:apptrove_sdk_flutter/apptrove_sdk_flutter.dart';

void initializeAppTroveWithDeferredLink() {
  final config = AppTroveSDKConfig(
    'YOUR_APPTROVE_SDK_KEY',
    'development',
  );

  config.deferredDeeplinkCallback = (String uri) {
    // Parse/validate URI and navigate through the existing router.
    print('Deferred deep link received: $uri');
  };

  AppTroveFlutterSdk.initializeSDK(config);

  // The official guide says this is required on iOS, not Android.
  if (Platform.isIOS) {
    AppTroveFlutterSdk.subscribeAttributionlink();
  }
}
```
Verify callback type and exact method spelling against the currently installed package before committing. Set the callback before initialization as in the official example; on iOS, call `subscribeAttributionlink()` after initialization. Android does not require that call per the guide.

Parse and validate incoming values; integrate with the existing router and avoid navigating before it is ready. Do not initialize the SDK twice just to register the callback.

## Testing
Use a configured test URL. Test each platform separately: click the link while the app is not installed, install, launch, verify callback data and destination. Repeated test installs may not always return referral data due to platform/provider behavior; do not promise every repeat test will attribute.
