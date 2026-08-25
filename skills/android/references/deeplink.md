# Apptrove Android SDK — Deep Linking

This guide explains how to configure Apptrove UniLinks for native Android applications.

Apptrove UniLinks use HTTPS URLs such as:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

A UniLink can open the application when it is already installed and can also participate in deferred deep-link flows when the application is not installed.

---

# 1. Apptrove UniLink Structure

An Apptrove UniLink follows this general structure:

```text
https://<app-subdomain>.u9ilnk.me/d/<link-id>
```

Example:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

For this example:

| Component   | Value               |
| ----------- | ------------------- |
| Scheme      | `https`             |
| Host        | `traders.u9ilnk.me` |
| Path prefix | `/d/`               |
| Link ID     | `Q0kMvzdEiw`        |

The complete URL must be preserved when handling the incoming deep link.

---

# 2. Configure AndroidManifest.xml

The application must register the Apptrove UniLink domain in an Android `intent-filter`.

Add the configuration to the Activity that should receive the deep link.

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">

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

The important values are:

```xml
android:scheme="https"
android:host="traders.u9ilnk.me"
android:pathPrefix="/d/"
```

Do not configure the individual link ID:

```text
Q0kMvzdEiw
```

as the `pathPrefix`.

The configuration should match the `/d/` path so that different UniLinks can be handled:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
https://traders.u9ilnk.me/d/ABC123
https://traders.u9ilnk.me/d/XYZ789
```

---

# 3. Existing Client Deep Links

Client applications may already contain multiple deep-link configurations.

For example:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">

    <!-- Existing client deep link -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data
            android:scheme="https"
            android:host="client.example.com" />
    </intent-filter>

    <!-- Apptrove UniLink -->
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

**Do not remove or replace existing client deep links.**

The Apptrove configuration should be added alongside existing configurations when it is missing.

---

# 4. Detect Existing Apptrove Configuration

Before adding the configuration, check whether the manifest already contains an intent filter matching:

```text
scheme = https
host = traders.u9ilnk.me
path = /d/
```

The following should be considered an existing Apptrove configuration:

```xml
<data
    android:scheme="https"
    android:host="traders.u9ilnk.me"
    android:pathPrefix="/d/" />
```

If this configuration already exists, do not add another duplicate intent filter.

---

# 5. Do Not Use the Link ID as the Host

For this URL:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

the host is:

```text
traders.u9ilnk.me
```

The following is incorrect:

```xml
android:host="Q0kMvzdEiw"
```

The link ID is part of the path.

Correct:

```text
Host:
traders.u9ilnk.me

Path:
 /d/Q0kMvzdEiw
```

Therefore the manifest should use:

```xml
android:host="traders.u9ilnk.me"
android:pathPrefix="/d/"
```

---

# 6. Receive the Deep Link

The Activity receiving the UniLink can read the incoming URI from the Intent.

Kotlin:

```kotlin
val uri = intent?.data
```

Java:

```java
Uri uri = getIntent().getData();
```

For the following URL:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

the URI contains the complete incoming URL.

Example:

```kotlin
val uri = intent?.data

if (uri != null) {
    Log.d("AppTrove", "Deep link: $uri")
}
```

---

# 7. Handle the Initial Deep Link

If the application is launched from a UniLink, process the incoming Intent.

Kotlin:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val uri = intent?.data

    if (uri != null) {
        handleDeepLink(uri)
    }
}
```

Example:

```kotlin
private fun handleDeepLink(uri: Uri) {

    Log.d("AppTrove", "Received deep link: $uri")

    if (uri.host == "traders.u9ilnk.me" &&
        uri.path?.startsWith("/d/") == true) {

        // Handle Apptrove UniLink
    }
}
```

---

# 8. Handle Deep Links When Activity Is Already Open

The application may already be running when another UniLink is clicked.

Handle the new Intent using `onNewIntent()`.

```kotlin
override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    setIntent(intent)

    val uri = intent?.data

    if (uri != null) {
        handleDeepLink(uri)
    }
}
```

This is particularly important when the Activity uses launch modes such as:

```xml
android:launchMode="singleTop"
```

---

# 9. Preserve the Complete UniLink

Do not extract only the `/d/` path and discard the rest of the URL.

For example:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

should remain intact.

Correct:

```kotlin
val uri = intent?.data
```

Avoid:

```kotlin
val path = intent?.data?.path
```

as the only value passed into Apptrove processing.

The complete URI may contain additional query parameters required for attribution or deep-link processing.

---

# 10. UniLink Query Parameters

A UniLink may contain additional parameters.

For example:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw?pid=facebook&c=summer
```

The complete URI should be preserved:

```kotlin
val uri = intent?.data
```

Query parameters can be inspected when required:

```kotlin
val mediaSource = uri?.getQueryParameter("pid")
val campaign = uri?.getQueryParameter("c")
```

Do not remove or rewrite query parameters before Apptrove processing.

---

# 11. App Links Verification

For HTTPS App Links, Android supports verified links using:

```xml
android:autoVerify="true"
```

Example:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data
        android:scheme="https"
        android:host="traders.u9ilnk.me"
        android:pathPrefix="/d/" />
</intent-filter>
```

Use `android:autoVerify="true"` when the application's Apptrove configuration requires verified Android App Links.

Android App Links use domain verification to establish a trusted association between the application and the web domain.

Do not add or remove `autoVerify` from an existing client configuration blindly.

---

# 12. Deferred Deep Linking

Apptrove supports deferred deep linking.

### Application already installed

```text
User clicks UniLink
        ↓
Android opens application
        ↓
Application receives deep-link Intent
        ↓
Apptrove processes the link
        ↓
Application navigates to required content
```

### Application not installed

```text
User clicks UniLink
        ↓
User is redirected to Play Store
        ↓
Application is installed
        ↓
Application launches
        ↓
Apptrove SDK retrieves deferred deep-link information
        ↓
Application handles deep-link destination
```

Apptrove's SDK documentation describes normal and deferred deep linking as separate flows.

The agent must not assume that deferred deep-link data will always be available through:

```kotlin
intent?.data
```

Direct deep links and deferred deep links can have different delivery mechanisms.

---

# 13. Existing Deep-Link Handling

Before adding new code, inspect the application.

Search for:

```text
intent.data
getIntent().getData()
onNewIntent
ACTION_VIEW
BROWSABLE
deepLink
deeplink
AppTrove
```

If the client already has:

```kotlin
val uri = intent?.data
```

reuse the existing deep-link flow.

Do not create another competing deep-link handler unless required.

---

# 14. Multiple Deep-Link Providers

A client may use multiple providers.

For example:

```text
Client deep links
        +
Firebase links
        +
Marketing links
        +
Apptrove UniLinks
```

The agent must preserve all existing integrations.

Example:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">

    <!-- Existing client configuration -->
    <intent-filter>
        ...
    </intent-filter>

    <!-- Apptrove UniLink -->
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

Never delete existing filters simply because the application already has a deep-link configuration.

---

# 15. Installer Detection Rules

When the Apptrove Android installer analyzes a project, it should detect the exact Apptrove UniLink configuration.

### Expected configuration

```text
Scheme:
https

Host:
traders.u9ilnk.me

Path prefix:
/d/
```

### Detection

The installer should search all intent filters for:

```xml
android:scheme="https"
android:host="traders.u9ilnk.me"
android:pathPrefix="/d/"
```

and verify:

```text
VIEW = true
DEFAULT = true
BROWSABLE = true
HTTPS = true
HOST = true
PATH = true
```

---

# 16. Correct Installer Result

If the exact configuration exists:

```text
Deep Link:
Already configured

Host:
traders.u9ilnk.me

Path:
 /d/

Status:
PASS
```

If another HTTPS deep link exists but it is unrelated:

```text
Existing deep links detected.

Existing host:
client.example.com

Apptrove host:
traders.u9ilnk.me

Status:
Apptrove deep link configuration missing
```

The installer should then add the Apptrove configuration.

---

# 17. Incorrect Detection

The following should **not** result in:

```text
Deep link already configured
```

### Case 1 — Different host

```xml
<data
    android:scheme="https"
    android:host="client.example.com" />
```

### Case 2 — Different path

```xml
<data
    android:scheme="https"
    android:host="traders.u9ilnk.me"
    android:pathPrefix="/products/" />
```

### Case 3 — Custom scheme

```xml
<data
    android:scheme="myapp"
    android:host="open" />
```

### Case 4 — Missing BROWSABLE

```xml
<category android:name="android.intent.category.DEFAULT" />
```

but no:

```xml
<category android:name="android.intent.category.BROWSABLE" />
```

These configurations are not equivalent to the required Apptrove UniLink configuration.

---

# 18. Agent Implementation Instructions

When an AI agent is asked to configure Apptrove deep linking:

### Step 1

Find:

```text
app/src/main/AndroidManifest.xml
```

### Step 2

Find all:

```xml
<intent-filter>
```

blocks.

### Step 3

Find all filters containing:

```xml
<action android:name="android.intent.action.VIEW" />
```

### Step 4

Check for:

```text
scheme = https
host = traders.u9ilnk.me
pathPrefix = /d/
```

### Step 5

If the exact configuration exists:

```text
Do not modify the manifest.
```

### Step 6

If it does not exist:

```text
Add the Apptrove intent-filter.
```

### Step 7

Preserve:

```text
Existing activities
Existing intent-filters
Existing deep-link providers
Existing navigation logic
Existing attribution logic
Existing autoVerify configuration
```

### Step 8

Inspect the Activity code for:

```text
intent.data
onNewIntent
```

and integrate with the existing deep-link handling mechanism.

---

# 19. Expected Manifest Configuration

For the example UniLink:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

the expected configuration is:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data
        android:scheme="https"
        android:host="traders.u9ilnk.me"
        android:pathPrefix="/d/" />
</intent-filter>
```

Whether `android:autoVerify="true"` is required should follow the Apptrove application/domain configuration. Android uses this attribute for verified App Links.

---

# 20. Validation Checklist

After integration:

```text
[ ] AndroidManifest.xml exists
[ ] Apptrove UniLink intent-filter exists
[ ] Scheme is https
[ ] Host is traders.u9ilnk.me
[ ] Path prefix is /d/
[ ] VIEW action exists
[ ] DEFAULT category exists
[ ] BROWSABLE category exists
[ ] Existing client intent-filters are preserved
[ ] Existing deep-link handling is preserved
[ ] onCreate() handles initial deep links where required
[ ] onNewIntent() handles subsequent links where required
[ ] Complete URI is preserved
[ ] Query parameters are preserved
[ ] Deferred deep-link flow is not overwritten
```

---

# 21. Test URL

Use the following UniLink for testing:

```text
https://traders.u9ilnk.me/d/Q0kMvzdEiw
```

### Direct deep-link test

Install the application first, then open the link.

Expected flow:

```text
UniLink
   ↓
Android App Link
   ↓
Application
   ↓
Activity
   ↓
intent.data
   ↓
Apptrove deep-link handling
```

### Deferred deep-link test

1. Uninstall the application.
2. Open the UniLink.
3. Follow the Play Store redirect.
4. Install the application.
5. Launch the application.
6. Verify that Apptrove receives the deferred deep-link information.

---

# 22. Agent Report

After implementation, the agent should report:

```text
Apptrove Deep Link Integration

UniLink:
https://traders.u9ilnk.me/d/Q0kMvzdEiw

Configuration:
- Scheme: https
- Host: traders.u9ilnk.me
- Path prefix: /d/

Manifest:
- <manifest path>

Activity:
- <activity name>

Status:
- Apptrove deep link configured / already configured

Existing deep links:
- Preserved

Application handling:
- Existing deep-link handling reused / added

Validation:
- VIEW: PASS
- DEFAULT: PASS
- BROWSABLE: PASS
- HTTPS: PASS
- Host: PASS
- Path: PASS
```

---

# Related References

```text
skills/android/SKILL.md
skills/android/references/install.md
skills/android/references/in-app-events.md
skills/android/references/user-data.md
skills/android/references/deep-link.md
```

Use the official Apptrove Android SDK documentation as the source of truth for SDK-specific deep-link behavior and configuration.
