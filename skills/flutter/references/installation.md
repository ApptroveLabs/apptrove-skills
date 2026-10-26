# Installation

Official source: https://developers.apptrove.com/docs/flutter-sdk/installation

## Install AppTrove v2
```bash
flutter pub add apptrove_sdk_flutter
flutter pub get
```
Use `apptrove_sdk_flutter` for new integrations. Check the currently resolved package version; do not hardcode a stale version from a documentation sample. Do not use legacy `trackier_sdk_flutter` unless explicitly maintaining/migrating a legacy integration.

## iOS
When needed, install CocoaPods dependencies:
```bash
cd ios
pod install
```
Preserve `Podfile.lock`; do not delete it as routine troubleshooting.

## Android Install Referrer
The official guide specifies:
```gradle
dependencies {
    implementation 'com.android.installreferrer:installreferrer:2.2'
}
```
Inspect existing Gradle dependencies and the current SDK docs before adding; avoid duplicate declarations.

## Android permissions
The official guide lists:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```
It lists `READ_PHONE_STATE`, `READ_EXTERNAL_STORAGE`, and `MANAGE_EXTERNAL_STORAGE` as optional. Do not add optional permissions automatically; verify necessity and current platform restrictions.

## Google Advertising ID
The guide specifies:
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
}
```
and for Android 12+:
```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```
Inspect existing dependencies/manifest first and confirm compatibility before modifying.

## Checklist
- Package exists in `pubspec.yaml`; `flutter pub get` succeeds.
- iOS Pods installed if needed.
- Install Referrer / advertising-ID setup is present only when required and not duplicated.
- Preserve native settings and deployment targets unless a verified requirement demands change.

The official docs mark Trackier v1 as deprecated in August 2026. Do not automatically migrate a legacy app without reviewing migration requirements.
