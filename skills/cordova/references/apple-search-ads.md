# AppTrove Apple Search Ads Attribution Token

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/additional-features/apple-update-token

## Overview

The documentation describes obtaining Apple's attribution token through native iOS functionality and passing it to AppTrove.

The documented AppTrove API family includes:

    apptroveCordovaPlugin.updateAppleAdsToken(token);

Verify the method signature in the installed plugin.

## Cordova integration

A custom native Cordova plugin may be required to access Apple's AdServices framework.

Before implementing:

1. Inspect existing native plugins.
2. Check whether a suitable token provider already exists.
3. Verify the minimum supported iOS version.
4. Implement the native bridge only if required.
5. Pass the token to AppTrove using the installed plugin's API.
6. Follow the current documentation's required call ordering.

The official guide describes updating the token before SDK initialization. Confirm this for the installed release.

## Validation

- Verify native plugin compilation.
- Test on a supported iOS device.
- Confirm the token handoff.
- Check attribution results in AppTrove.
