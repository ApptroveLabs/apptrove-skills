---
name: apptrove-expo-sdk
description: >
  Integrate, configure, debug, and troubleshoot the AppTrove Expo SDK.
  Use for Expo installation, initialization, event tracking, deep links,
  deferred deep links, FCM/APNs uninstall tracking, ATT, Apple Update Token,
  SDK signing, and ProGuard configuration.
---

# AppTrove Expo SDK Skill

## Purpose

Help developers integrate and troubleshoot the AppTrove SDK in Expo
applications using the official AppTrove documentation included in this skill.

## SDK selection

- Prefer `apptrove-expo-sdk` for new AppTrove integrations.
- Do not confuse `apptrove-expo-sdk` with the legacy `trackier-expo-sdk`.
- Check the project's installed package and version before suggesting changes.
- Do not assume that APIs available in one SDK version are supported by another.
- The official documentation may change; consult the source links below when
  the extracted reference does not answer a question.

## Documentation routing

Read the relevant reference before proposing code changes.

- **Install Expo SDK**: `references/installation.md`
- **Initialize and Integrate Expo SDK**: `references/initialization.md`
- **Event Tracking**: `references/event-tracking.md`
- **Deep Linking**: `references/deep-linking.md`
- **Deferred Deep Linking**: `references/deferred-deep-linking.md`
- **Android Uninstall Tracking with FCM**: `references/uninstall-tracking-fcm.md`
- **iOS Uninstall Tracking with APNs**: `references/uninstall-tracking-apn.md`
- **App Tracking Transparency (ATT)**: `references/app-tracking-transparency.md`
- **Apple Update Token**: `references/apple-update-token.md`
- **SDK Signing**: `references/sdk-signing.md`
- **ProGuard Configuration**: `references/proguard-rule.md`

## Workflow

1. Identify the user's Expo SDK package and installed version.
2. Determine whether the issue concerns installation, initialization,
   events, deep links, uninstall tracking, privacy, or Android release builds.
3. Read the relevant reference file.
4. Follow the documented API names, argument types, and setup order.
5. Keep platform-specific configuration separate:
   - Android: FCM configuration and ProGuard/R8 rules.
   - iOS: APNs configuration and App Tracking Transparency.
6. If the documentation distinguishes AppTrove and legacy Trackier APIs,
   use the APIs for the package the user actually has installed.
7. For native configuration changes, check whether the Expo project uses
   a development build, prebuild, or another supported native workflow.
8. Ask for logs, package versions, and relevant configuration when needed.
9. Do not claim an issue is fixed until the user verifies it in a build.

## Deep-linking guidance

- Treat direct deep linking and deferred deep linking as separate flows.
- Check the callback/API documented for the installed SDK version.
- The official Expo documentation states that AppTrove SDK v2.0.1+
  returns a structured `AppTroveDeepLink` object rather than a plain URL
  string. Confirm the exact callback contract in the reference before coding.
- Test both app-installed and fresh-install scenarios when relevant.

## Uninstall tracking guidance

- Android FCM and iOS APNs require platform-specific setup.
- Check the relevant reference for supported package versions and token APIs.
- Do not assume that a token is registered merely because push notifications
  work in the application.
- Confirm the native configuration and verify token registration through logs
  or the applicable dashboard.

## Security and release-build guidance

- Keep SDK keys and signing secrets distinct.
- Never ask a user to commit signing secrets to a public repository.
- Read the signing reference before proposing signing API changes.
- Review the ProGuard reference when investigating release-only Android issues.
- Do not invent ProGuard rules; use the official reference and validate with
  a release build.

## Reference integrity

The files in `references/` are extracted from the official documentation
pages listed at the top of each file. They are reference material, not a
guarantee that every example matches the user's installed version.

If extraction is incomplete, a page is unavailable, or a relevant API is
missing, open the official source URL and verify the current instructions
before recommending implementation changes.
