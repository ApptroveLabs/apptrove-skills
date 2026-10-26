# AppTrove Cordova SDK Integration

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/integration

## Obtain the SDK key

Open the AppTrove Panel, select the correct application, and retrieve its SDK key.

Never invent a key or use another application's credentials.

## Ionic Native imports

The documented imports are:

    import {
      AppTroveCordovaPlugin,
      AppTroveConfig,
      AppTroveEnvironment
    } from 'com.apptrove.cordova_sdk/ionic-native/apptrove/ngx';

## Configuration example

Verify the API names against the installed plugin before use.

    const config = new AppTroveConfig(
      'YOUR_APPTROVE_SDK_KEY',
      AppTroveEnvironment.Development
    );

    this.apptroveCordovaPlugin.initializeSDK(config);

Use the actual key and the appropriate environment.

The documentation describes Development, Production, and Testing environments. Confirm the exact constants available in the installed release.

## Pure Cordova

Inspect the installed plugin's JavaScript interface and initialize after the appropriate Cordova startup event.

Do not assume Ionic Native APIs are available in a pure Cordova project.

## Rules

- Initialize only once.
- Preserve existing startup logic.
- Do not initialize separately on every page.
- Avoid logging SDK credentials.
- Build and test before reporting success.
