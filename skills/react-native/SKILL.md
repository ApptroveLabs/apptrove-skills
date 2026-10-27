---
name: apptrove-react-native-sdk
description: >
  Integrate, configure, debug, and troubleshoot the AppTrove React Native SDK.
  Covers installation, initialization, event tracking, deep linking,
  deferred deep linking, Android FCM and iOS APNs uninstall tracking,
  ATT, Apple Update Token, SDK signing, and ProGuard.
---

# AppTrove React Native SDK Skill

## Purpose

Help developers integrate and troubleshoot the AppTrove SDK in React Native
applications using the documentation included in this skill.

## Package and version awareness

- Identify the SDK package and installed version before suggesting changes.
- Do not confuse the React Native SDK with the Expo SDK or native SDKs.
- Check the project's package.json and lockfile when troubleshooting.
- Do not assume that APIs available in one SDK version are supported by
  another version or platform.
- Follow the official documentation for the installed package and version.

## Documentation references

- **Install React Native SDK**: `references/installation.md`
- **Initialize and Integrate React Native SDK**: `references/initialization.md`
- **Event Tracking**: `references/event-tracking.md`
- **Deep Linking**: `references/deep-linking.md`
- **Deferred Deep Linking**: `references/deferred-deep-linking.md`
- **Android Uninstall Tracking with FCM**: `references/uninstall-tracking-fcm.md`
- **iOS Uninstall Tracking with APNs**: `references/uninstall-tracking-apn.md`
- **App Tracking Transparency (ATT)**: `references/app-tracking-transparency.md`
- **Apple Update Token**: `references/apple-update-token.md`
- **SDK Signing**: `references/sdk-signing.md`
- **ProGuard Configuration**: `references/proguard-rule.md`

## Recommended workflow

1. Identify the user's React Native version and AppTrove SDK version.
2. Determine whether the issue concerns installation, initialization,
   event tracking, deep links, push-token registration, privacy, or builds.
3. Read the relevant reference file before suggesting implementation changes.
4. Use documented method names, argument types, and initialization order.
5. Separate JavaScript integration from native platform configuration.
6. For native changes, identify whether the project uses CocoaPods,
   Gradle, a bare React Native workflow, or another supported setup.
7. Request relevant logs and configuration when the cause is unclear.
8. Do not claim an issue is resolved until the user verifies it.

## Event tracking

- Follow the event-tracking reference for the documented event API.
- Confirm the event name, parameters, and expected payload.
- Distinguish SDK event tracking from server-to-server (S2S) events.
- If an event is missing, establish whether the method was called and
  whether the SDK successfully submitted the event.

## Deep linking

- Treat direct deep linking and deferred deep linking as separate flows.
- Verify the configured domains, app associations, and callback behavior.
- Check the documented API for the installed React Native SDK version.
- Test both an installed-app link and a fresh-install deferred-link flow.
- Do not assume that receiving a URL means attribution parameters were
  successfully processed.

## Uninstall tracking

### Android

- Use the FCM uninstall-tracking reference.
- Check the documented Firebase configuration and token-registration flow.
- Verify the app package, Firebase setup, and SDK version.

### iOS

- Use the APNs uninstall-tracking reference.
- Check the documented Apple push-token registration flow.
- Distinguish APNs registration from successful attribution or uninstall
  processing.

Do not assume uninstall tracking works simply because push notifications
are enabled.

## App Tracking Transparency

- Use the ATT reference for the documented implementation.
- Check the iOS target, permission prompt flow, and SDK version.
- Do not assume ATT authorization automatically guarantees IDFA access.
- Explain privacy-related behavior according to the official documentation.

## Apple Update Token

- The Apple Update Token reference currently points to the Expo SDK URL
  supplied by the user.
- Verify that its instructions apply to the React Native package before
  recommending code changes.
- If React Native-specific instructions differ, use the verified
  React Native documentation instead.

## SDK signing and ProGuard

- Read the SDK signing reference before proposing signing changes.
- Keep signing secrets out of source control and public logs.
- For Android release-only failures, inspect the ProGuard reference.
- Do not invent keep rules or signing APIs.
- Validate native changes with an appropriate debug or release build.

## Documentation integrity

The files in references/ are extracted from the listed documentation URLs.
They may not preserve every dynamically rendered example or code block.

If a page fails to download, contains incomplete content, or does not
document the required API, consult the official source directly.
Do not invent missing implementation details.
