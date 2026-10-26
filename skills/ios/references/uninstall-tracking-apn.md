# AppTrove iOS SDK — Uninstall Tracking with APNs

Official documentation: https://developers.apptrove.com/docs/ios-sdk/advance-features/uninstall-tracking-apn

APNs-based uninstall reporting requires Apple-side credentials/capabilities and AppTrove dashboard setup; it is not just an SDK code change. Reporting can take 9 or more days, so do not expect immediate results.

## Setup checklist

1. Create a certificate signing request (CSR) in Keychain Access if required by the chosen APNs credential workflow.
2. Configure Push Notifications for the correct App ID in the Apple Developer portal.
3. Create/download the credential described by the current AppTrove documentation and export it in the required format (the documentation has described a `.p12` certificate workflow).
4. Upload/configure the credential in the AppTrove dashboard under the uninstall-tracking configuration.
5. Enable the required Xcode capabilities for the target, such as Push Notifications and Background Modes → Remote notifications, as required by the documented flow.
6. Confirm the correct app/bundle ID and APNs environment are used.

Apple's available APNs credential options can change. Follow the current official AppTrove and Apple setup instructions for the app's specific credential type rather than assuming all apps use the same certificate flow.

## App code

- Inspect existing notification authorization, `registerForRemoteNotifications()`, and `application(_:didRegisterForRemoteNotificationsWithDeviceToken:)`.
- Do not request notification permission solely because uninstall tracking is being configured without checking the current documented requirements and product behavior. User-visible notification authorization and APNs token registration are distinct concerns.
- Inspect the installed AppTrove SDK headers/API documentation for the exact method to forward the APNs device token. Do not guess or introduce a legacy method name.
- Preserve existing push notification handling and any other SDK token consumers.
- Do not add `NSUserNotificationsUsageDescription` blindly; verify whether the current platform/API flow requires it and ensure any permission prompt has a truthful purpose.

## Validation

Confirm the token is received on a real device with the expected provisioning/capabilities, the correct credential is uploaded, and the AppTrove dashboard is configured. Allow for delayed uninstall reporting.
