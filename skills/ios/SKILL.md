---
name: apptrove-ios
description: Integrate and troubleshoot the native AppTrove iOS SDK in Swift or Objective-C projects, including initialization, events, deep links, deferred deep links, APNs uninstall tracking, SDK signing, Apple Search Ads, and ATT.
---

# AppTrove Native iOS SDK Skill

Use this skill when the user asks to integrate, update, configure, or troubleshoot the native AppTrove iOS SDK.

## Workflow

1. Inspect the repository before editing:
   - Identify Swift/Objective-C, UIKit/SwiftUI, app lifecycle (`AppDelegate`, `SceneDelegate`, SwiftUI `@main` app), dependency manager (CocoaPods or Swift Package Manager), target iOS version, and existing AppTrove/Trackier dependencies.
   - Read `Podfile`, `Podfile.lock`, Xcode project settings, package references, `Info.plist`, entitlements, and existing URL/universal-link routing as relevant.
2. Read the relevant reference file(s) in `references/` before making changes.
3. Follow the API exposed by the SDK version actually installed in the project. Do not assume examples for a different SDK version are compatible.
4. Make the smallest targeted change. Preserve existing lifecycle methods, notification delegates, app routing, analytics, and project conventions. Do not create duplicate SDK initialization or duplicate callbacks.
5. Never replace the app's SDK key, bundle ID, domains, event IDs, or secret values with guessed values. Use explicit placeholders in examples and ask for missing values when needed.
6. Do not claim that integration works just because files were edited. Run available checks (dependency resolution, build, tests) when possible and report the exact result and any unverified manual steps.

## Installation and initialization

- Read `references/installation.md` and `references/integration.md`.
- Prefer the dependency manager already used by the app. Do not migrate CocoaPods to SPM or vice versa unless requested.
- Retrieve the correct AppTrove SDK key from the AppTrove dashboard for the target app/environment.
- Initialize once at the appropriate early app lifecycle point, typically `AppDelegate`.
- Preserve the existing app lifecycle architecture; for SwiftUI projects, inspect how the app delegate is bridged before editing.

## Event tracking

- Read `references/event-tracking.md`.
- Use the event ID configured in the AppTrove dashboard. Use built-in constants only for matching built-in events.
- Add revenue, currency, order ID, and custom parameters only when the app has trustworthy values for them.
- Do not send passwords, payment card details, or unnecessary personal data as event parameters.
- Avoid blocking the main thread for event tracking.

## Deep links

- Read `references/deep-linking.md` and `references/deferred-deep-linking.md`.
- Use the actual configured UniLink domain, Apple Team/Prefix ID, bundle ID, and existing router. Do not invent domains or replace the app's current routing logic.
- Handle both cold-start and already-running app link delivery where appropriate.
- Validate incoming parameters before navigating or using them in business logic.

## APNs uninstall tracking

- Read `references/uninstall-tracking-apn.md`.
- Treat APNs certificate/key setup as a dashboard and Apple Developer configuration task as well as an app-code task.
- Inspect the currently installed SDK for the correct APNs-token forwarding method before coding. Do not guess a method name or copy a legacy Trackier API into an AppTrove v2 project.
- Preserve existing push-notification behavior. Request notification permission only if the product needs user-visible notifications; distinguish permission prompts from remote-notification registration.
- APNs uninstall signals can take multiple days to appear; do not promise immediate results.

## SDK signing and privacy

- Read `references/sdk-signing.md` before adding signing credentials. Do not commit secret keys or credentials.
- Read `references/app-tracking-transparency.md` before changing ATT behavior. Keep `NSUserTrackingUsageDescription` truthful and do not assume IDFA is available.
- Read `references/apple-search-ads.md` for AdServices integration. Check SDK API names and initialization order against the installed version.

## Completion report

At the end, summarize:
- Files changed and why.
- Dependency/API changes.
- Build/test commands executed and their outcomes.
- Dashboard, Apple Developer, Xcode capability, signing, or device-test steps still required.
- Any APIs or behavior that could not be verified from the installed SDK.
