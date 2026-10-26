# AppTrove Cordova Deep Linking

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/advance-features/deep-linking

## Overview

Deep linking allows a configured link to open a specific screen or destination in an installed application.

The documentation covers app-installed and deferred-install scenarios.

## Android configuration

Inspect the existing Android manifest and plugin configuration.

Configure the actual AppTrove/UniLink HTTPS domain and required paths.

Do not copy example placeholder domains into production.

Do not overwrite existing intent filters without checking their purpose.

## iOS configuration

Inspect the generated iOS project, Universal Links setup, associated domains, and existing URL handling.

Use the actual configured domain and correct app identifiers.

Preserve existing app lifecycle and routing behavior.

## Routing

- Reuse the existing router.
- Support cold-start and warm-start link delivery where applicable.
- Validate incoming parameters.
- Do not trust arbitrary URLs or unvalidated values.
- Test app-installed and app-not-installed scenarios on devices.
