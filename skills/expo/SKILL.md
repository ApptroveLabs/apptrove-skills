# AppTrove Expo SDK Integration Skill

## Objective

Integrate `apptrove-expo-sdk` into an Expo **dev build** (not Expo Go).

## Install

```bash
npm i apptrove-expo-sdk
```

Add config plugin in `app.json` / `app.config.js` (matches mmp-dev-docs):

```json
{
  "expo": {
    "plugins": ["./node_modules/apptrove-expo-sdk/app.plugin.js"]
  }
}
```

(Also valid: `"plugins": ["apptrove-expo-sdk"]` because the package declares `"expo.plugin"`.)

```bash
npx expo prebuild
```

Package: `apptrove-expo-sdk@2.0.3`

## Imports

```tsx
import {
  AppTroveConfig,
  AppTroveSDK,
  AppTroveEvent,
  AppTroveDeepLink
} from 'apptrove-expo-sdk';
```

## Initialization

```tsx
const config = new AppTroveConfig(
  "YOUR_APP_TOKEN",
  AppTroveConfig.EnvironmentDevelopment
);

config.setDeferredDeeplinkCallbackListener((deepLink: AppTroveDeepLink) => {
  console.log(deepLink.url);
});

AppTroveSDK.initialize(config);
```

## Events

```tsx
AppTroveSDK.setUserId("user-123");
const event = new AppTroveEvent(AppTroveEvent.LOGIN);
AppTroveSDK.trackEvent(event);
```

## Deep Links

```tsx
AppTroveSDK.parseDeepLink(url);
await AppTroveSDK.resolveDeeplinkUrl(url);
AppTroveSDK.subscribeDeeplink(); // Expo naming (not subscribeAttributionlink)
```

## Push

```tsx
AppTroveSDK.sendFcmToken(token);
AppTroveSDK.sendAPNToken(token);
```

## Notes

- Requires a custom/dev client — native module will throw in Expo Go.
- Plugin mainly injects Android `play-services-ads-identifier`; verify iOS pods after prebuild.

## Validation Checklist

- [ ] `apptrove-expo-sdk` installed
- [ ] Plugin listed in app config
- [ ] `expo prebuild` / native project generated
- [ ] `AppTroveSDK.initialize(config)` called
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
