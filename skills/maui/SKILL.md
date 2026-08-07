# AppTrove .NET MAUI SDK Integration Skill

## Objective

Integrate `AppTroveSDK.Maui` for attribution, events, and deep linking in a .NET MAUI app.

## Install

```bash
dotnet add package AppTroveSDK.Maui --version 2.1.0
```

Or in `.csproj`:

```xml
<PackageReference Include="AppTroveSDK.Maui" Version="2.1.0" />
```

## Imports

```csharp
using AppTroveSDK.Maui;
using AppTrove = AppTroveSDK.Maui.AppTroveSDK;
```

## Initialization

```csharp
var config = new AppTroveSDKConfig(
    "YOUR_APP_TOKEN",
    AppTroveEnvironment.Development
);

config.DeferredDeeplinkCallback = (deepLink) =>
{
    // Handle deferred deep link
};

AppTrove.WaitForATTUserAuthorization(30); // iOS — before Initialize
AppTrove.Initialize(config);

if (OperatingSystem.IsIOS())
{
    AppTrove.SubscribeAttributionLink(); // required for iOS deferred links
}
```

Environments: `AppTroveEnvironment.Development` | `Production` | `Testing`

## Android permissions

In `Platforms/Android/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

## iOS Info.plist

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to deliver personalized ads and improve your experience.</string>
```

## Events + User

```csharp
AppTrove.SetUserId("user-123");
var evt = new AppTroveEvent(AppTroveEvent.LOGIN);
AppTrove.TrackEvent(evt);
```

## Deep Links

```csharp
AppTrove.ParseDeepLink(url);
```

## Push

```csharp
AppTrove.SendFcmToken(fcmToken);   // Android
AppTrove.SendAPNToken(apnToken);   // iOS
```

## Install ID

```csharp
var id = AppTrove.GetAppTroveId();
```

## Validation Checklist

- [ ] `AppTroveSDK.Maui` 2.1.0 referenced
- [ ] `AppTrove.Initialize(config)` called at startup
- [ ] Android permissions + iOS ATT string present
- [ ] iOS: `WaitForATTUserAuthorization` before init + `SubscribeAttributionLink` after
- [ ] App token replaced

## Output Summary

```
SDK added: YES/NO
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
```
