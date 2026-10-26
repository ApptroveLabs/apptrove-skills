# Initialization

Official source: https://developers.apptrove.com/docs/flutter-sdk/initialization

Get the SDK key from the correct application in the AppTrove Panel under **SDK Integration**. A wrong key can cause attribution/reporting issues. Supported environments documented are `development`, `testing`, and `production`; preserve the user's intended environment.

## AppTrove v2 example
```dart
import 'package:apptrove_sdk_flutter/apptrove_sdk_flutter.dart';

Future<void> initializeAppTrove() async {
  const sdkKey = 'YOUR_APPTROVE_SDK_KEY';
  final config = AppTroveSDKConfig(sdkKey, 'development');

  // Optional, Android only; only set when required:
  // config.setAndroidId('YOUR_ANDROID_ID');

  AppTroveFlutterSdk.initializeSDK(config);
}
```
The official guide demonstrates calling an initialization helper from `initState()`. Fit initialization into the existing app lifecycle and ensure it happens once; do not overwrite existing startup logic.

Checklist:
- Use `AppTroveSDKConfig` and `AppTroveFlutterSdk.initializeSDK`.
- Use the AppTrove v2 import.
- Confirm the real key/environment.
- Optional Android ID is Android-only and should not be invented.
- Do not mix in legacy `TrackerSDKConfig` / `Trackierfluttersdk`.
