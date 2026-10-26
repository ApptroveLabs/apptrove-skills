# Standard Deep Linking

Official source: https://developers.apptrove.com/docs/flutter-sdk/advance-features/deep-linking

Normal deep links open a destination in an already-installed app. Use the actual configured AppTrove domain, scheme, path, and app route; examples in docs are not production configuration.

## Android
The official guide shows an HTTPS intent filter in `android/app/src/main/AndroidManifest.xml`:
```xml
<activity
    android:name=".Activity.FirstProduct"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="YOUR_CONFIGURED_LINK_HOST"
            android:pathPrefix="/product" />
    </intent-filter>
</activity>
```
Adapt activity, host, and path to the real project. Do not copy `trackier.u9ilnk.me` unless it is the configured domain. Merge into the existing manifest; avoid duplicate filters.

## iOS
The official guide describes URL schemes in `ios/Runner/Info.plist` and Universal Links with Associated Domains. For Universal Links, enable Associated Domains in the iOS target, add `applinks:YOUR_CONFIGURED_LINK_HOST`, and verify the associated-domain file is correctly hosted. Preserve existing plist entries/domains.

## App navigation and tests
Map validated incoming URLs/parameters to real routes in the app's existing router. Treat incoming parameters as untrusted. Test with app installed on Android and iOS, including paths, query parameters, and fallback behavior. Keep standard deep links distinct from deferred deep links.
