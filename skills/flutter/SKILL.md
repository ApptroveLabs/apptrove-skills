---
name: apptrove-flutter
description: Integrate and troubleshoot AppTrove Flutter SDK v2, including initialization, events, deep links, deferred deep links, Meta Install Referrer, and iOS ATT/IDFA.
---

# AppTrove Flutter SDK Skill

Use this skill for AppTrove Flutter SDK integration and maintenance.

## Version policy
Use AppTrove v2 (`apptrove_sdk_flutter`) for new integrations. Do not introduce legacy Trackier v1 (`trackier_sdk_flutter`, `Trackierfluttersdk`, `TrackerSDKConfig`, `TrackierEvent`) unless the user explicitly requests legacy support/migration. The official docs mark Trackier v1 as deprecated in August 2026.

## Read the relevant reference first
- Installation/native setup: `references/installation.md`
- Initialization: `references/initialization.md`
- Events: `references/event-tracking.md`
- Deep links: `references/deep-linking.md`
- Deferred deep links: `references/deferred-deep-linking.md`
- Meta Install Referrer: `references/meta-integration.md`
- iOS ATT/IDFA: `references/app-tracking-transparency.md`

Official documentation:
- https://developers.apptrove.com/docs/flutter-sdk/installation
- https://developers.apptrove.com/docs/flutter-sdk/initialization
- https://developers.apptrove.com/docs/flutter-sdk/event-tracking
- https://developers.apptrove.com/docs/flutter-sdk/advance-features/deep-linking
- https://developers.apptrove.com/docs/flutter-sdk/advance-features/deferred-deep-linking
- https://developers.apptrove.com/docs/flutter-sdk/advance-features/meta-integration
- https://developers.apptrove.com/docs/flutter-sdk/additional-features/app-tracking-transparency

## Workflow
1. Inspect `pubspec.yaml`, app startup, routing/navigation, `android/app/src/main/AndroidManifest.xml`, Android Gradle files, and `ios/Runner/Info.plist` before editing. Determine whether AppTrove v2 is already installed.
2. Ask for or locate the actual SDK key, environment (`development`, `testing`, `production`), configured link host/scheme, event IDs, and Facebook App ID as applicable. Never invent values; use explicit placeholders if unavailable.
3. Install only if missing: prefer `flutter pub add apptrove_sdk_flutter`, then `flutter pub get`. Do not upgrade unrelated packages or downgrade to match an example.
4. Initialize the SDK once using AppTrove v2 APIs and preserve the project's startup architecture and environment.
5. Implement only requested features. Read the corresponding reference file. Use real configured domains/routes/event IDs.
6. Validate with `flutter pub get`, `flutter analyze`, relevant tests, and native build checks where available. Report only checks actually run.
7. Summarize changed files, resolved SDK version, placeholders, manual setup, and actual validation results.

## Safety rules
- Make minimal, idempotent edits. Never replace entire app startup, router, manifest, plist, or Gradle files just to add SDK integration.
- Avoid duplicate dependencies, permissions, initialization, manifest entries, and event calls.
- Do not add optional permissions without a justified requirement.
- ATT/IDFA depends on iOS version and user consent; do not promise availability.
- Documentation sample domains are examples, not customer configuration.
- If the installed package API differs from docs, inspect the actual package API/current official docs before coding.
