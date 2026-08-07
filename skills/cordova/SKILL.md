# AppTrove Cordova / Ionic SDK Integration Skill

## Objective

Integrate `com.apptrove.cordova_sdk` into Cordova or Ionic (Capacitor) apps.

## Install

```bash
npm install ApptroveLabs/cordova_sdk#ApptroveSDK
```

For Ionic Native also:

```bash
npm install @awesome-cordova-plugins/core --save
ionic cap sync
```

Package id: `com.apptrove.cordova_sdk@2.0.5` (from GitHub branch `ApptroveSDK`).

Ionic Native import path:

```ts
import {
  AppTroveCordovaPlugin,
  AppTroveConfig,
  AppTroveEnvironment,
  AppTroveEvent,
  AppTroveDeepLink
} from 'com.apptrove.cordova_sdk/ionic-native/apptrove/ngx';
```

Register `AppTroveCordovaPlugin` in Angular `providers`.

## Initialization

```ts
const config = new AppTroveConfig(
  "YOUR_APP_TOKEN",
  AppTroveEnvironment.Development
);
config.setDeferredDeeplink(true);
config.enableSkanAttribution();

// MUST subscribe before initializeSDK
this.apptroveCordovaPlugin.setDeferredDeeplinkCallbackListener().subscribe({
  next: (deepLink: AppTroveDeepLink) => {
    console.log(deepLink.url);
  }
});

await this.apptroveCordovaPlugin.initializeSDK(config);
```

Plain Cordova JS:

```js
cordova.plugins.AppTroveCordovaPlugin.initializeSDK(config, success, error);
```

## Events

```ts
await this.apptroveCordovaPlugin.setUserId("user-123");
const event = new AppTroveEvent(AppTroveEvent.LOGIN);
await this.apptroveCordovaPlugin.trackEvent(event);
```

## Deep Links

```ts
await this.apptroveCordovaPlugin.parseDeepLink(url);
await this.apptroveCordovaPlugin.resolveDeeplinkUrl(url);
await this.apptroveCordovaPlugin.subscribeAttributionlink();
```

Configure Android intent-filters / iOS Associated Domains in native platforms. Ionic apps may also use `@ionic-native/deeplinks` or Capacitor `appUrlOpen`.

## Push

```ts
await this.apptroveCordovaPlugin.sendFcmToken(token);
await this.apptroveCordovaPlugin.sendAPNToken(token);
```

## Validation Checklist

- [ ] Cordova plugin installed / synced
- [ ] Deferred callback subscribed before init
- [ ] `initializeSDK(config)` called
- [ ] Native deep link hosts configured
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
