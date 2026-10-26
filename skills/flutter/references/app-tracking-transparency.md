# App Tracking Transparency (ATT) and IDFA

Official source: https://developers.apptrove.com/docs/flutter-sdk/additional-features/app-tracking-transparency

ATT is relevant to iOS apps requesting IDFA. IDFA availability depends on user consent and platform behavior; do not promise it will always be available.

## Info.plist
Add an honest, app-specific usage description to `ios/Runner/Info.plist`:
```xml
<key>NSUserTrackingUsageDescription</key>
<string>Explain clearly why your app requests tracking permission.</string>
```
Do not use generic text unless it accurately describes the app's purpose.

## Flutter package
```bash
flutter pub add app_tracking_transparency
flutter pub get
```
Inspect `pubspec.yaml` first to avoid duplicates. Use the package's current API to check status and request authorization when appropriate, following the app's consent flow.

## SDK ordering
The official guide explicitly says to call the SDK's `waitForATTUserAuthorization(20)` before SDK initialization so it waits for the ATT decision. The page shows both legacy Trackier and AppTrove examples. Verify the exact AppTrove v2 method name/signature in the current package before implementing. Do not copy legacy `Trackierfluttersdk.waitForATTUserAuthorization(20)` into v2 code.

After changing ATT ordering, test iOS initialization, attribution, deferred deep links, and app startup. Test not-determined, authorized, and denied states on a real device where possible.
