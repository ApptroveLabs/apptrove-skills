# AppTrove Cordova SDK Installation

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/installation

## Prerequisites

The documentation lists Cordova 9.0 or later, Node.js, npm, an AppTrove account, and platform-specific Android/iOS requirements.

Verify the requirements for the actual SDK release before changing the project's deployment targets.

## Install

Run from the project root:

    npm install ApptroveLabs/cordova_sdk#ApptroveSDK

Inspect package.json and the lockfile after installation.

## Ionic Native

The documentation also describes installing:

    npm install @awesome-cordova-plugins/core --save

Only add this dependency when appropriate for the existing Ionic project.

## Capacitor

If the application actually uses Capacitor, follow its native synchronization workflow.

Do not run Capacitor commands in a pure Cordova application.

## Validation

- Confirm the package resolves.
- Check the installed plugin version.
- Verify Android and iOS plugin installation.
- Build the application using its existing build workflow.
- Avoid installing duplicate SDK packages.
