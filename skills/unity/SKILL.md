# Trackier Unity SDK Integration Skill

> **Important:** Unity does **not** have an Apptrove v2 SDK yet. Use the **Trackier Unity SDK (v1.x)** only. Trackier SDKs are marked deprecated for other platforms in August 2026, but Unity currently has no Apptrove replacement — follow this skill for Unity projects.

## Objective

Integrate the Trackier Unity SDK for attribution, events, and deep linking in a Unity game/app.

## Install

1. Download the latest `.unitypackage` (recommended **1.6.74+**, minimum **1.6.57**) from the [Trackier Unity releases Drive folder](https://drive.google.com/drive/folders/1VExFSHH3aSGqVpN8DZR_o_t4GMS4vXIB?usp=sharing)
2. In Unity Editor: **Assets → Import Package → Custom Package**
3. Confirm `Assets/Trackier/` (includes `Trackier.cs`) is present
4. Android: **Assets → External Dependency Manager → Android Resolver → Resolve**

Requirements: Unity **2019.4+**, Android API **21+**, iOS **10+** / Xcode **12+**.

## Namespace & Classes

```csharp
using com.trackier.sdk;
```

| Class | Role |
| --- | --- |
| `TrackierConfig` | SDK config (key, env, secret, deferred deeplink) |
| `TrackierUnity` | Static facade — init, events, user, campaign getters |
| `TrackierEvent` | Event payload + built-in event ID constants |

Do **not** use `AppTroveSDK` / `AppTroveSDKConfig` — those APIs do not exist for Unity.

## Initialization

```csharp
using UnityEngine;
using com.trackier.sdk;

public class TrackierBootstrap : MonoBehaviour
{
    void Start()
    {
        var trackierConfig = new TrackierConfig("YOUR_SDK_KEY", "development");
        // environments: "development" | "production" | "testing"

        // Optional SDK signing (from MMP dashboard → SDK Integration → Advanced)
        // trackierConfig.setAppSecret("secretId", "secretKey");

        // Optional deferred deep link (set BEFORE initialize)
        trackierConfig.setDeferredDeeplinkDelegate(OnDeferredDeeplink);

        TrackierUnity.initialize(trackierConfig);

        TrackierUnity.setUserId("user-123");
        TrackierUnity.setUserEmail("user@example.com");
    }

    void OnDeferredDeeplink(string deeplinkURL)
    {
        if (deeplinkURL != null)
        {
            // Navigate based on URL
        }
    }
}
```

## Events

```csharp
var trackierEvent = new TrackierEvent(TrackierEvent.LOGIN);
// or: new TrackierEvent("YOUR_DASHBOARD_EVENT_ID");

trackierEvent.revenue = 8.0f;
trackierEvent.currency = "USD";
trackierEvent.param1 = "value";

TrackierUnity.trackierEvent(trackierEvent);
// Some samples also show TrackierUnity.TrackEvent(trackierEvent) — prefer trackierEvent()
```

Built-in constants include: `LOGIN`, `PURCHASE`, `ADD_TO_CART`, `CHECKOUT_STARTED`, `SUBSCRIBE`, `APP_OPEN`, etc.

## User data

```csharp
TrackierUnity.setUserId("USER123");
TrackierUnity.setUserEmail("a@b.com");
TrackierUnity.setUserName("Test User");
TrackierUnity.setUserPhone("+10000000000");
TrackierUnity.setDOB("1990-01-01");          // YYYY-MM-DD
TrackierUnity.setGender("Male");             // Male | Female | Others
```

## Deep linking

### Deferred

Set `setDeferredDeeplinkDelegate` on config **before** `TrackierUnity.initialize`.

### Android (normal)

In `Assets/Plugins/Android/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />

<activity android:name="com.unity3d.player.UnityPlayerActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="YOUR_SUBDOMAIN.u9ilnk.me"
            android:pathPrefix="/d" />
    </intent-filter>
</activity>
```

### iOS (Universal Links)

1. Configure Prefix ID + Bundle ID in MMP UniLink panel
2. Xcode → Associated Domains → `applinks:YOUR_SUBDOMAIN.unilink.me`

### Dynamic links (1.6.74+)

Package adds dynamic link / deeplink resolver support. Confirm exact C# wrappers in imported `Trackier.cs` for your package version.

## Campaign getters (1.6.46+)

```csharp
string ad = TrackierUnity.getAd();
string adID = TrackierUnity.getAdID();
string adSet = TrackierUnity.getAdSet();
```

## Android FAQ notes

- After import, run External Dependency Manager → Resolve
- AdMob conflicts: remove AdMob → import Trackier → rebuild → re-add AdMob → Force Resolve
- ProGuard: `-keep class com.trackier.sdk.** { *; }`

## Validation Checklist

- [ ] `.unitypackage` imported; `Assets/Trackier/` present
- [ ] `TrackierUnity.initialize(trackierConfig)` called at startup
- [ ] SDK key from dashboard (not placeholder)
- [ ] Deferred delegate set before init if needed
- [ ] Android intent-filter / iOS Associated Domains configured
- [ ] Android Resolver completed

## Output Summary

```
SDK added: YES/NO (Trackier Unity .unitypackage)
Initialization: YES/NO
Deep Links: YES/NO
Validation: PASSED/FAILED
Brand: Trackier (Unity-only; no Apptrove v2 yet)
```
