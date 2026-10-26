# Android Uninstall Tracking with FCM

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/advance-features/uninstall-tracking-fcm

## Overview

Firebase Cloud Messaging is used in the documented Android uninstall-tracking flow.

The documentation describes an expected reporting window of approximately 24–48 hours. This is not a guarantee.

## Prerequisites

- Firebase project with Cloud Messaging configured.
- Correct Android application ID/package name.
- AppTrove SDK installed and initialized.
- The required notification plugin and native configuration for the project's architecture.
- Dashboard configuration completed.

## Integration checklist

1. Identify whether the project uses Cordova or Capacitor.
2. Inspect the existing Firebase and notification setup.
3. Follow the official guide for the appropriate plugin and version.
4. Preserve existing push-notification callbacks.
5. Verify AppTrove dashboard configuration.
6. Test on a device and allow time for reporting.

Do not install a Capacitor-only plugin in a pure Cordova application without verifying compatibility.

Do not conclude that uninstall tracking works solely because the dependency installed successfully.
