# AppTrove Flutter SDK Integration Skill

## Objective

Integrate `apptrove_sdk_flutter` for attribution, events, and deep linking on Flutter (Android + iOS).

## Install

pubspec.yaml:

```yaml
dependencies:
  apptrove_sdk_flutter: ^2.0.5
```

```bash
flutter pub get
cd ios && pod install
```

## Imports

```dart
import 'package:apptrove_sdk_flutter/apptrovefluttersdk.dart';
import 'package:apptrove_sdk_flutter/apptroveconfig.dart';
import 'package:apptrove_sdk_flutter/apptroveevent.dart';
```

> Note: some mmp-dev-docs pages show `package:apptrove_sdk_flutter/apptrove_sdk_flutter.dart`, but that barrel file is **not** in the published package. Use the three imports above (matches Testing Apps + SDK source).

## Initialization

```dart
final config = AppTroveSDKConfig("YOUR_APP_TOKEN", "development");
// environments: development | production | testing

config.deferredDeeplinkCallback = (deepLink) {
  print(deepLink.url);
};

config.enableSkanAttribution(); // iOS
AppTroveFlutterSdk.initializeSDK(config);
```

## Events + User

```dart
AppTroveFlutterSdk.setUserId("user-123");
final event = AppTroveEvent(AppTroveEvent.LOGIN);
AppTroveFlutterSdk.trackEvent(event);
```

## Deep Links

```dart
AppTroveFlutterSdk.parseDeeplink(url);
await AppTroveFlutterSdk.resolveDeeplinkUrl(url);
```

Configure Android intent-filters and iOS Associated Domains (`applinks:YOUR_SUBDOMAIN.unilink.me`) in the native projects.

## Android extras

```gradle
implementation 'com.android.installreferrer:installreferrer:2.2'
implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
```

Permissions: `INTERNET`, `ACCESS_NETWORK_STATE`, `ACCESS_WIFI_STATE`, `com.google.android.gms.permission.AD_ID`

## Push

```dart
AppTroveFlutterSdk.sendFcmToken(token);  // Android
AppTroveFlutterSdk.sendAPNToken(token);  // iOS
```

## Validation Checklist

- [ ] `apptrove_sdk_flutter` in pubspec
- [ ] `AppTroveFlutterSdk.initializeSDK(config)` called at startup
- [ ] Deferred callback set before init if needed
- [ ] Native Android/iOS link + permission setup done
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
