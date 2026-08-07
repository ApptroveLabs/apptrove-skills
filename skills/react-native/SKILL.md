# AppTrove React Native SDK Integration Skill

## Objective

Integrate `react-native-apptrove` into a bare React Native app (not Expo Go / managed Expo — use the Expo skill for that).

## Install

```bash
npm install react-native-apptrove
cd ios && pod install
```

Package: `react-native-apptrove@2.0.1`

## Imports

```js
import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
```

Note the spelling: **Apptrove** (lowercase `t`) in the RN package API.

## Initialization

```js
const config = new ApptroveConfig(
  "YOUR_APP_TOKEN",
  ApptroveConfig.EnvironmentDevelopment
);
// EnvironmentProduction | EnvironmentTesting

config.setDeferredDeeplinkCallbackListener(function (uri) {
  console.log("Deferred deeplink:", uri);
});

ApptroveSDK.initialize(config);
```

## Events + User

```js
ApptroveSDK.setUserId("user-123");
const event = new ApptroveEvent(ApptroveEvent.LOGIN);
ApptroveSDK.trackEvent(event);
```

## Deep Links

```js
ApptroveSDK.parseDeepLink(url);
```

Add Android intent-filters and iOS Universal Links in native projects.

## Android extras

```gradle
implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
```

Manifest: `com.google.android.gms.permission.AD_ID`

ProGuard: `-keep class com.apptrove.sdk.** { *; }`

## Push

```js
ApptroveSDK.sendFcmToken(token);  // Android
ApptroveSDK.sendAPNToken(token);  // iOS
```

## Install ID

```js
const id = await ApptroveSDK.getApptroveId(); // note spelling
```

## Validation Checklist

- [ ] `react-native-apptrove` installed + pods
- [ ] `ApptroveSDK.initialize(config)` at app start
- [ ] Deferred listener set before init if needed
- [ ] Native link / AD_ID setup done
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
