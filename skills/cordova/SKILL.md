---
name: apptrove-cordova
description: Integrate and troubleshoot AppTrove Cordova SDK applications, including initialization, events, deep linking, deferred deep linking, uninstall tracking, SDK signing, Apple Search Ads, ATT, and Meta integration.
---

# AppTrove Cordova SDK Skill

Use this skill when integrating or troubleshooting the AppTrove SDK in Cordova or Ionic applications.

## 1. Inspect the project first

Before making changes:

- Inspect package.json and the lockfile.
- Identify the installed AppTrove SDK version.
- Determine whether the application uses Cordova, Ionic with Cordova, or Capacitor.
- Inspect config.xml and native Android/iOS project files.
- Identify existing SDK initialization and event tracking.
- Inspect existing deep-link routing and push notification handling.
- Read the relevant files under references/.

## 2. Installation

Official guide:
https://developers.apptrove.com/docs/cordova-sdk/installation

The documented AppTrove installation command is:

    npm install ApptroveLabs/cordova_sdk#ApptroveSDK

Use the package manager and lockfile already used by the project.

Do not install duplicate SDK versions or mix legacy Trackier APIs with AppTrove APIs without verifying compatibility.

## 3. Initialization

Official guide:
https://developers.apptrove.com/docs/cordova-sdk/integration

For Ionic Native, the documented import path is:

    com.apptrove.cordova_sdk/ionic-native/apptrove/ngx

The documented API family includes AppTroveConfig, AppTroveEnvironment, and AppTroveCordovaPlugin.

Verify the actual APIs exposed by the installed plugin before making changes.

For pure Cordova, inspect the installed plugin's JavaScript interface and follow its device-ready requirements.

Initialize the SDK only once.

## 4. Event tracking

Official guide:
https://developers.apptrove.com/docs/cordova-sdk/event-tracking

Use event IDs configured in the AppTrove Panel.

Track events at the correct business-action point. Use accurate transaction values and currency codes.

Never invent event IDs or send passwords, payment-card details, or unnecessary personal information.

## 5. Deep linking

Read:

- references/deep-linking.md
- references/deferred-deep-linking.md

Preserve the application's existing router and URL-handling logic.

Use the real configured domain and app identifiers. Validate parameters before routing.

The documentation describes an iOS deferred-attribution subscription call after SDK initialization. Verify its exact API in the installed plugin.

## 6. Uninstall tracking

Android:
references/uninstall-tracking-fcm.md

iOS:
references/uninstall-tracking-apn.md

Android FCM and iOS APNs require platform-specific setup.

Check Firebase configuration, Apple Developer credentials, native capabilities, and dashboard configuration.

Do not promise immediate uninstall reports. The documented iOS reporting window can exceed nine days.

## 7. SDK signing

Read references/sdk-signing.md.

Never commit production secret keys or credentials to source control.

Verify the installed SDK's signing API before changing initialization.

## 8. Apple Search Ads

Read references/apple-search-ads.md.

Apple's attribution token requires native iOS functionality. A custom Cordova bridge may be required.

Verify token retrieval, supported iOS versions, and SDK call ordering.

## 9. App Tracking Transparency

Read references/app-tracking-transparency.md.

Use an accurate NSUserTrackingUsageDescription when requesting tracking permission.

Do not assume IDFA will be available. Handle authorized and denied states correctly.

## 10. Meta integration

Read references/meta-integration.md.

Verify the correct Meta App ID, Android package name, manifest configuration, and AppTrove API.

The documented integration is Android-specific.

## 11. Implementation rules

- Make minimal, targeted changes.
- Preserve existing app behavior.
- Do not create duplicate SDK initialization.
- Do not overwrite native manifests without inspecting existing entries.
- Do not guess SDK keys, event IDs, domains, or credentials.
- Verify method signatures against the installed SDK version.
- Do not claim that integration works without appropriate validation.
- Run available builds and tests.

## 12. Final report

Report:

1. Files changed.
2. SDK version detected.
3. APIs and dependencies added or changed.
4. Build and test results.
5. Dashboard or native configuration still required.
6. Manual device testing still required.
