# AppTrove Cordova Deferred Deep Linking

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/advance-features/deferred-deep-linking

## Overview

Deferred deep linking can provide attribution and destination information after a user opens a tracking link, installs the application, and launches it.

## Listener API pattern

The documentation describes a listener API similar to:

    this.apptroveCordovaPlugin
      .setDeferredDeeplinkCallbackListener()
      .subscribe({
        next: (deepLink) => {
          // Validate the received values.
          // Navigate through the existing application router.
          console.log('Deep link received:', deepLink.url);
        },
        error: (error) => {
          console.error('Deferred deep-link listener error:', error);
        }
      });

This is an illustrative API pattern. Verify the exact API, callback shape, and return type in the installed plugin.

Register the listener at the appropriate point in the initialization sequence.

## iOS subscription

The official guide describes calling:

    this.apptroveCordovaPlugin.subscribeAttributionlink();

after SDK initialization on iOS.

Verify the exact method in the installed SDK.

## Testing

- Test the complete link-to-install-to-first-launch flow.
- Use a clean test device or the documented clean-install process.
- Confirm the callback and expected parameters.
- Repeated testing on the same device may not reproduce attribution every time.
- Validate parameters before navigating.
