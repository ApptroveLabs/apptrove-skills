# Apptrove Android SDK — Deferred Deep Linking

This guide explains how to configure and handle **deferred deep links** with the Apptrove Android SDK.

Deferred deep linking is used when a user clicks an Apptrove UniLink before the application is installed. The user is redirected to the Google Play Store, installs the application, and the deep-link information is then made available to the application through the Apptrove SDK.

Apptrove also supports normal deep linking when the application is already installed.

Official reference:

`https://developers.apptrove.com/docs/android-sdk/advance-features/deferred-deep-linking`

---

## 1. How Deferred Deep Linking Works

### Application already installed

```text
User clicks Apptrove UniLink
        ↓
Android opens application
        ↓
MainActivity receives URI
        ↓
AppTroveSDK.parseDeepLink(uri)
        ↓
Apptrove processes deep link
        ↓
DeepLinkListener callback
        ↓
Application navigates to required screen
```

### Application not installed

```text
User clicks Apptrove UniLink
        ↓
Redirect to Google Play Store
        ↓
User installs application
        ↓
Application launches
        ↓
Apptrove SDK processes deferred deep-link data
        ↓
DeepLinkListener callback
        ↓
Application navigates to required screen
```

Apptrove's current documentation states that deferred deep linking is handled by the SDK and that the deep-link content is available after installation.

---

# 2. Prerequisites

Before configuring deferred deep linking, verify:

* Apptrove Android SDK is installed.
* SDK version is `2.x.x` or later for the Apptrove SDK.
* Android API 19+ is supported.
* The application is configured in the Apptrove Panel.
* Deep-link settings are configured in the Apptrove Panel.
* Internet permission is present in `AndroidManifest.xml`.
* The application can be tested using a valid Apptrove UniLink.
* The SDK is initialized before deep-link processing.

The official documentation lists the SDK, Android API, Panel configuration, Play Store availability, and Internet permission as prerequisites.

---

# 3. Apptrove UniLink

A deferred deep link uses an Apptrove UniLink.

Example:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

A UniLink can also contain parameters:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw?pid=QR_Code&camp=SummerCampaign&dlv=standard&productid=jeans&quantity=3
```

Do not remove query parameters from the incoming URI.

The complete URI should be passed to:

```kotlin
AppTroveSDK.parseDeepLink(uri)
```

---

# 4. Configure AndroidManifest.xml

The Activity receiving the deep link must have an appropriate intent filter.

Example:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask">

    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <intent-filter>
        <action android:name="android.intent.action.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data
            android:scheme="https"
            android:host="traders.u9ilnk.me"
            android:pathPrefix="/d/" />
    </intent-filter>

</activity>
```

The official Apptrove example uses an HTTPS intent filter with `VIEW`, `DEFAULT`, `BROWSABLE`, the UniLink host, and `/d/` path prefix.

### Important

Do not hard-code the individual link ID:

```text
Q0kMvzdEiw
```

The configuration should match the common `/d/` path:

```xml
android:pathPrefix="/d/"
```

This allows multiple UniLinks to work.

---

# 5. Capture Deep Link in MainActivity

When the application receives a deep-link Intent, read the URI from:

```kotlin
intent?.data
```

Example:

```kotlin
val deepLinkUri: Uri? = intent?.data

deepLinkUri?.let {
    Log.d("AppTroveSDK", "Received Deep Link URI: $it")

    AppTroveSDK.parseDeepLink(it)
}
```

The official Apptrove implementation calls `AppTroveSDK.parseDeepLink(data)` after obtaining the URI from the Activity Intent.

---

# 6. Kotlin MainActivity Example

```kotlin
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.apptrove.sdk.AppTroveSDK

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        val deepLinkUri: Uri? = intent?.data

        deepLinkUri?.let {
            Log.d("AppTroveSDK", "Received Deep Link URI: $it")

            AppTroveSDK.parseDeepLink(it)
        }
    }
}
```

---

# 7. Handle New Deep-Link Intents

If `MainActivity` uses:

```xml
android:launchMode="singleTask"
```

a subsequent deep link may be delivered through `onNewIntent()` rather than creating another Activity instance.

Handle it:

```kotlin
override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    setIntent(intent)

    val deepLinkUri = intent?.data

    deepLinkUri?.let {
        Log.d("AppTroveSDK", "Received Deep Link URI: $it")

        AppTroveSDK.parseDeepLink(it)
    }
}
```

When modifying an existing project, first check whether the application already has deep-link handling in `onCreate()` or `onNewIntent()`.

Do not create duplicate deep-link processing logic unnecessarily.

---

# 8. Configure DeepLinkListener

The Apptrove SDK provides `DeepLinkListener` to notify the application when deep-link information has been processed.

Example:

```kotlin
private val deepLinkListener = object : DeepLinkListener {

    override fun onDeepLinking(deepLink: DeepLink) {

        Log.d(
            "AppTroveSDK",
            "Deep Link Value: ${deepLink.getDeepLinkValue()}"
        )

        Log.d(
            "AppTroveSDK",
            "Deep Link URL: ${deepLink.getUrl()}"
        )

        Log.d(
            "AppTroveSDK",
            "Deep Link Data: ${deepLink.getData()}"
        )
    }
}
```

The official documentation exposes deep-link information through methods including:

```text
getDeepLinkValue()
getUrl()
getData()
getQueryParam()
```

---

# 9. Configure Listener During SDK Initialization

The listener should be configured before SDK initialization.

Example:

```kotlin
class MainApplication : Application() {

    private val deepLinkListener = object : DeepLinkListener {

        override fun onDeepLinking(deepLink: DeepLink) {

            Log.d(
                "AppTroveSDK",
                "Deep Link Value: ${deepLink.getDeepLinkValue()}"
            )

            Log.d(
                "AppTroveSDK",
                "Deep Link URL: ${deepLink.getUrl()}"
            )

            Log.d(
                "AppTroveSDK",
                "Deep Link Data: ${deepLink.getData()}"
            )
        }
    }

    override fun onCreate() {
        super.onCreate()

        val sdkKey = "YOUR_SDK_KEY"

        val sdkConfig =
            AppTroveSDKConfig(
                this,
                sdkKey,
                "development"
            ).apply {

                setDeepLinkListener(deepLinkListener)
            }

        AppTroveSDK.initialize(sdkConfig)
    }
}
```

The official Apptrove documentation configures `DeepLinkListener` through `AppTroveSDKConfig` before calling `AppTroveSDK.initialize()`.

---

# 10. Read Deep-Link Parameters

Apptrove deep links can contain application-specific parameters.

Example URL:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw?dlv=standard&productid=jeans&quantity=3
```

Inside the listener:

```kotlin
override fun onDeepLinking(deepLink: DeepLink) {

    val deepLinkValue =
        deepLink.getDeepLinkValue()

    val productId =
        deepLink.getQueryParam("productid")

    val quantity =
        deepLink.getQueryParam("quantity")

    Log.d(
        "AppTroveSDK",
        "Deep Link Value: $deepLinkValue"
    )

    Log.d(
        "AppTroveSDK",
        "Product ID: $productId"
    )

    Log.d(
        "AppTroveSDK",
        "Quantity: $quantity"
    )
}
```

The official example uses `getQueryParam()` to retrieve values such as `productid` and `quantity`.

---

# 11. Navigate to Application Content

The application decides what screen should be displayed based on the deep-link data.

For example:

```kotlin
override fun onDeepLinking(deepLink: DeepLink) {

    if (
        deepLink
            .getDeepLinkValue()
            .equals("standard", ignoreCase = true)
    ) {

        val intent =
            Intent(
                this@MainApplication,
                ProductActivity::class.java
            ).apply {

                putExtra(
                    "productid",
                    deepLink.getQueryParam("productid")
                )

                putExtra(
                    "quantity",
                    deepLink.getQueryParam("quantity")
                )

                flags =
                    Intent.FLAG_ACTIVITY_NEW_TASK
            }

        startActivity(intent)
    }
}
```

The official example uses the `dlv`/deep-link value to determine the destination Activity and passes query parameters to that Activity.

---

# 12. Important: SDK Initialization Order

The expected order is:

```text
Application.onCreate()
        ↓
Create AppTroveSDKConfig
        ↓
Configure DeepLinkListener
        ↓
AppTroveSDK.initialize()
        ↓
MainActivity receives deep link
        ↓
AppTroveSDK.parseDeepLink(uri)
        ↓
DeepLinkListener.onDeepLinking()
        ↓
Application handles destination
```

The agent must ensure the SDK is initialized before deep-link processing is expected.

---

# 13. resolveDeeplinkUrl

Apptrove also exposes:

```kotlin
AppTroveSDK.resolveDeeplinkUrl(...)
```

This can be used when the application needs to explicitly resolve a deferred deep-link URL.

Example:

```kotlin
AppTroveSDK.resolveDeeplinkUrl(
    "https://traders.u9ilnk.me/d/Q0kMvzdEiw",
    { resultUrl ->
        Log.d(
            "AppTroveSDK",
            "Resolved Deferred Deep Link URL: $resultUrl"
        )
    },
    { error ->
        Log.e(
            "AppTroveSDK",
            "Failed to resolve deep link: ${error.message}"
        )
    }
)
```

The official documentation demonstrates `resolveDeeplinkUrl` with success and error callbacks.

### Important

Do not add `resolveDeeplinkUrl()` automatically to every project.

First inspect the application's existing deep-link implementation and determine whether explicit URL resolution is required.

The standard deferred-deep-link flow uses the SDK's deep-link processing and listener mechanism.

---

# 14. Direct vs Deferred Deep Link

### Direct deep link

Application is already installed:

```text
UniLink
   ↓
Android Intent
   ↓
MainActivity
   ↓
intent.data
   ↓
AppTroveSDK.parseDeepLink()
   ↓
DeepLinkListener
```

### Deferred deep link

Application is not installed:

```text
UniLink
   ↓
Play Store
   ↓
Application installation
   ↓
Application launch
   ↓
Apptrove SDK
   ↓
Deferred deep-link data
   ↓
DeepLinkListener
```

The application should use the same destination/navigation logic after the deep-link data is delivered.

---

# 15. Installer Requirements

When the Apptrove AI agent configures deferred deep linking, it should inspect the project before making changes.

### Check 1 — SDK dependency

Verify that the Apptrove SDK is already configured.

### Check 2 — AndroidManifest.xml

Verify:

```text
VIEW
DEFAULT
BROWSABLE
https
Apptrove UniLink host
/d/ path
```

### Check 3 — Application class

Find the Android `Application` class.

Search for:

```text
AppTroveSDK.initialize
AppTroveSDKConfig
DeepLinkListener
setDeepLinkListener
```

### Check 4 — MainActivity

Search for:

```text
intent.data
getIntent().getData()
onNewIntent
AppTroveSDK.parseDeepLink
```

### Check 5 — Existing implementation

If deferred deep linking is already implemented:

```text
Do not add duplicate code.
```

---

# 16. Agent Implementation Rules

The AI agent should follow these rules.

### Rule 1

Do not create a new Application class if one already exists.

### Rule 2

Do not create a new MainActivity if one already exists.

### Rule 3

Do not overwrite existing deep-link handling.

### Rule 4

Reuse existing:

```text
onCreate()
onNewIntent()
AppTroveSDK.initialize()
```

where appropriate.

### Rule 5

Do not remove existing intent filters.

### Rule 6

Do not replace existing deep-link providers.

### Rule 7

Preserve all existing query parameters.

### Rule 8

Do not add `resolveDeeplinkUrl()` unless explicit URL resolution is required.

### Rule 9

Use the Apptrove SDK APIs:

```text
AppTroveSDK.parseDeepLink(uri)
AppTroveSDKConfig.setDeepLinkListener(...)
AppTroveSDK.initialize(...)
```

---

# 17. Detection Checklist

The agent should report:

```text
[ ] Apptrove SDK dependency found
[ ] AndroidManifest.xml found
[ ] Apptrove UniLink intent filter found
[ ] Application class found
[ ] AppTroveSDK initialization found
[ ] DeepLinkListener configured
[ ] MainActivity found
[ ] Deep-link Intent handling found
[ ] AppTroveSDK.parseDeepLink() found
[ ] onNewIntent() checked
[ ] Existing deep-link handling preserved
```

---

# 18. Expected Installation Result

### Fully configured

```text
Deferred Deep Linking

SDK:
PASS

Manifest:
PASS

Application initialization:
PASS

DeepLinkListener:
PASS

MainActivity:
PASS

parseDeepLink:
PASS

Status:
Deferred deep linking already configured
```

### Missing configuration

```text
Deferred Deep Linking

SDK:
PASS

Manifest:
PASS

Application initialization:
PASS

DeepLinkListener:
MISSING

MainActivity:
PASS

parseDeepLink:
MISSING

Status:
Deferred deep linking requires configuration
```

---

# 19. Testing

Use a valid Apptrove UniLink.

Example:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

For parameter testing:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw?pid=QR_Code&camp=SummerCampaign&dlv=standard&productid=jeans&quantity=3
```

## Direct deep-link test

1. Install the application.
2. Open the UniLink from a browser or messaging application.
3. Verify that the application launches.
4. Verify that `MainActivity` receives the URI.
5. Verify that `AppTroveSDK.parseDeepLink()` is called.
6. Verify that `DeepLinkListener.onDeepLinking()` is triggered.
7. Verify the expected screen is opened.

---

# 20. Deferred Deep-Link Test

For a true deferred scenario:

1. Build the application with the Apptrove SDK.
2. Ensure the build is suitable for testing.
3. Start from a fresh application installation state.
4. Open the Apptrove deferred deep link.
5. Verify that the link redirects toward the application's Play Store page.
6. Install the application.
7. Launch the newly installed application.
8. Verify that the Apptrove SDK processes the deferred deep link.
9. Verify that `DeepLinkListener.onDeepLinking()` is triggered.
10. Verify all expected query parameters.
11. Verify that the correct screen/content is opened.

The official documentation also describes a local APK testing flow where the link first redirects toward Google Play and the APK is then installed manually to simulate the deferred scenario.

---

# 21. Verification Checklist

### SDK

```text
[ ] Apptrove Android SDK installed
[ ] SDK initialized
[ ] Correct SDK key configured
[ ] Correct environment configured
```

### Manifest

```text
[ ] INTERNET permission exists
[ ] VIEW intent exists
[ ] DEFAULT category exists
[ ] BROWSABLE category exists
[ ] HTTPS scheme configured
[ ] Correct UniLink host configured
[ ] /d/ path configured
```

### Application

```text
[ ] DeepLinkListener configured
[ ] Listener configured before SDK initialization
[ ] AppTroveSDK.initialize() called
```

### MainActivity

```text
[ ] intent.data is read
[ ] AppTroveSDK.parseDeepLink(uri) is called
[ ] onNewIntent() is checked
[ ] Existing deep-link logic is preserved
```

### Deep-link processing

```text
[ ] DeepLinkListener callback received
[ ] getDeepLinkValue() works
[ ] getUrl() works
[ ] getData() works
[ ] getQueryParam() works
[ ] Application navigates correctly
```

---

# 22. Common Issues

| Issue                                           | Check                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| Application does not open from UniLink          | Check AndroidManifest intent filter                                   |
| Deep link reaches Activity but is not processed | Check `AppTroveSDK.parseDeepLink(uri)`                                |
| Listener not triggered                          | Check `setDeepLinkListener()` before SDK initialization               |
| Parameters are missing                          | Check the complete URI and `getQueryParam()`                          |
| Wrong screen opens                              | Check `getDeepLinkValue()` / `dlv` handling                           |
| Deep link works only on fresh launch            | Check `onNewIntent()`                                                 |
| Play Store redirect does not happen             | Check deep-link/store configuration in Apptrove Panel                 |
| Deferred data not received                      | Test with a fresh installation and verify SDK initialization/network  |
| Duplicate deep-link handling                    | Inspect existing Activity and Application code before adding new code |

The official Apptrove troubleshooting section similarly calls out Play Store redirect configuration, forwarding the deep link from the Activity, deep-link value matching, query parameters, and SDK/network configuration.

---

# 23. Agent Final Report

After making changes, the AI agent should provide a report similar to:

```text
Apptrove Deferred Deep Linking

SDK:
✓ Apptrove SDK detected

Manifest:
✓ UniLink intent filter configured

Application:
✓ MainApplication detected
✓ DeepLinkListener configured
✓ SDK initialization detected

MainActivity:
✓ Deep-link Intent detected
✓ AppTroveSDK.parseDeepLink(uri) configured
✓ onNewIntent() checked

Status:
✓ Deferred deep linking configured
```

If no changes were necessary:

```text
Apptrove Deferred Deep Linking

Status:
✓ Already configured

No changes were made.
```

If implementation is incomplete:

```text
Apptrove Deferred Deep Linking

Status:
⚠ Partially configured

Missing:
- DeepLinkListener
- parseDeepLink()

Manual implementation required.
```

---

# 24. Important Notes for AI Agents

**Do not blindly copy the documentation's sample application structure into a client's project.**

The agent must first analyze the existing project.

In particular:

```text
Find existing Application class
Find existing MainActivity
Find existing SDK initialization
Find existing deep-link handling
Find existing intent filters
```

Then modify only the missing pieces.

The goal is:

```text
Existing project
      ↓
Analyze
      ↓
Detect existing Apptrove configuration
      ↓
Add only missing configuration
      ↓
Preserve existing application behavior
      ↓
Validate
      ↓
Report result
```

This makes the skill safe to run repeatedly and prevents duplicate SDK initialization or duplicate deep-link handlers.
