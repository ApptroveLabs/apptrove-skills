# iOS Uninstall Tracking with APNs

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/advance-features/uninstall-tracking-apn

## Reporting window

The documentation warns that iOS uninstall data can take nine or more days to appear.

## Apple and AppTrove configuration

The documented setup includes:

1. Creating a certificate signing request when required.
2. Configuring Push Notifications for the correct App ID.
3. Creating the required APNs credential.
4. Exporting the credential in the format required by the current workflow.
5. Uploading/configuring the credential in AppTrove.
6. Enabling the required native capabilities.

Follow the current Apple and AppTrove documentation for the credential type. Do not assume certificate-based and token-based credentials are interchangeable.

## Cordova project checks

- Inspect the existing iOS project.
- Preserve notification plugins and callbacks.
- Verify bundle ID and provisioning configuration.
- Avoid adding duplicate push-notification plugins.
- Request user-visible notification permission only when appropriate for the product and documented flow.

## Validation

Verify dashboard configuration, native capabilities, and device behavior. Allow the expected reporting window before concluding that uninstall tracking is broken.
