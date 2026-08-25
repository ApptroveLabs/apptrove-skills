# Apptrove Android SDK — In-App Events

This guide explains how to implement in-app event tracking with the Apptrove Android SDK.

Use this reference when an application needs to track user actions such as:

* Registration
* Login
* Purchase
* Subscription
* Add to cart
* Checkout
* Level completion
* Custom business events

The implementation should use the Apptrove event API and the event ID configured in the Apptrove dashboard.

---

## 1. Before Implementing Events

Before adding event tracking:

1. Verify that the Apptrove Android SDK is already installed.
2. Verify that the SDK is initialized.
3. Verify that the application has an Apptrove SDK key.
4. Obtain the required event ID from the Apptrove dashboard.
5. Determine whether the event is:

   * A built-in event
   * A custom event
   * A revenue event

Do not create arbitrary event IDs when an event ID already exists in the Apptrove dashboard.

---

# 2. Event Types

Apptrove supports:

### Built-in Events

Built-in events are predefined events available through the SDK.

Examples include events such as:

```text
LOGIN
SIGNUP
PURCHASE
```

The exact built-in event constants exposed by the installed Android SDK version should be used.

### Custom Events

Custom events are events created by the application/business in the Apptrove dashboard.

A custom event is identified by its event ID.

Example:

```text
sEMWSCTXeu
```

Do not assume that the event name and event ID are the same.

---

# 3. Retrieve Event ID

Before implementing an event, retrieve its Event ID from the Apptrove dashboard.

Typical workflow:

1. Login to the Apptrove panel.
2. Select the application.
3. Open the event configuration section.
4. Locate the required event.
5. Copy the event ID.
6. Use that event ID in the Android application.

Example:

```text
Event Name: Purchase
Event ID: abc123XYZ
```

The application should use:

```text
abc123XYZ
```

when creating the event.

---

# 4. Create an Event

Create an Apptrove event using the SDK's event model.

Conceptually:

```kotlin
val event = ApptroveEvent("EVENT_ID")
```

Then send the event through the SDK's event tracking API.

Example structure:

```kotlin
val event = ApptroveEvent("EVENT_ID")

ApptroveSDK.trackEvent(event)
```

> Use the exact class and method names exposed by the installed Apptrove Android SDK version. If the SDK API differs, inspect the SDK API or the project's existing integration before modifying application code.

---

# 5. Built-in Event

If the SDK exposes a predefined constant for an event, prefer the SDK constant instead of hardcoding an ID.

Example pattern:

```kotlin
val event = ApptroveEvent(
    ApptroveEvent.LOGIN
)

ApptroveSDK.trackEvent(event)
```

The exact constant names depend on the SDK version.

Before adding a hardcoded event ID:

1. Check whether the SDK provides a built-in constant.
2. Check the project's existing event implementation.
3. Check the installed SDK version.

---

# 6. Custom Event

For a custom event, pass the event ID configured in the Apptrove dashboard.

Example:

```kotlin
val event = ApptroveEvent("CUSTOM_EVENT_ID")

ApptroveSDK.trackEvent(event)
```

For example:

```kotlin
val event = ApptroveEvent("sEMWSCTXeu")

ApptroveSDK.trackEvent(event)
```

Do not replace the event ID with the human-readable event name unless the SDK/dashboard explicitly uses the name as the event identifier.

---

# 7. Event Parameters

---

## Combining User Data with an Event

When the user asks to add user data to an in-app event, combine the
user-data APIs directly into the event implementation.

The required order is:

1. Create the `ApptroveEvent`.
2. Add event parameters, if required.
3. Set user ID.
4. Set user email.
5. Set user name.
6. Set user phone.
7. Create the additional user details map.
8. Call `setUserAdditionalDetails()`.
9. Call `ApptroveSDK.trackEvent(event)` LAST.

Do NOT call `ApptroveSDK.trackEvent(event)` immediately after creating
the event when user data is being added.

### Example

```kotlin
val event = ApptroveEvent("CUSTOM_EVENT_ID")

ApptroveSDK.setUserId("USER_ID")
ApptroveSDK.setUserEmail("user@example.com")
ApptroveSDK.setUserName("John Doe")
ApptroveSDK.setUserPhone("+1234567890")

val userDetails = hashMapOf<String, Any>(
    "Name" to "John Doe",
    "UserMobile" to "+1234567890",
    "Plan" to "Premium",
    "Country" to "IN"
)

ApptroveSDK.setUserAdditionalDetails(userDetails)

ApptroveSDK.trackEvent(event)
```

### Important Agent Rule

When combining `user-data.md` with `in-app-events.md`, always place
the complete user-data block between event creation and
`ApptroveSDK.trackEvent(event)`.

Incorrect:

```kotlin
val event = ApptroveEvent("CUSTOM_EVENT_ID")

ApptroveSDK.trackEvent(event)

ApptroveSDK.setUserId("USER_ID")
ApptroveSDK.setUserEmail("user@example.com")
```

Correct:

```kotlin
val event = ApptroveEvent("CUSTOM_EVENT_ID")

ApptroveSDK.setUserId("USER_ID")
ApptroveSDK.setUserEmail("user@example.com")
ApptroveSDK.setUserName("John Doe")
ApptroveSDK.setUserPhone("+1234567890")

val userDetails = hashMapOf<String, Any>(
    "Name" to "John Doe",
    "UserMobile" to "+1234567890",
    "Plan" to "Premium",
    "Country" to "IN"
)

ApptroveSDK.setUserAdditionalDetails(userDetails)

ApptroveSDK.trackEvent(event)
```

When user data is included, `ApptroveSDK.trackEvent(event)` must be
the final Apptrove call in the event implementation.

### Recommended fields

For a purchase event, use:

```text
event ID
revenue
currency
order ID
```

Example:

```kotlin
val event = ApptroveEvent("purchase_event")

event.revenue = 999.0
event.currency = "INR"
event.orderId = "ORDER-10001"

ApptroveSDK.trackEvent(event)
```

---

# 9. Custom Event Values

If the SDK version supports event-value maps, additional business-specific values can be attached to the event.

Example pattern:

```kotlin
val event = ApptroveEvent("EVENT_ID")

event.setEventValue("product_id", "12345")
event.setEventValue("product_name", "Premium Plan")
event.setEventValue("quantity", 1)

ApptroveSDK.trackEvent(event)
```

Use the exact `setEventValue` API supported by the installed SDK version.

Do not invent SDK methods.

If the method is not available in the installed version, inspect the SDK API before modifying the project.

---

# 10. Where to Track Events

Events should be tracked at the point where the business action actually occurs.

### Login

Track after login succeeds:

```kotlin
fun onLoginSuccess(userId: String) {

    // Login completed successfully

    val event = ApptroveEvent("LOGIN_EVENT_ID")

    ApptroveSDK.trackEvent(event)
}
```

Do not track a successful login event before authentication succeeds.

---

### Registration

Track after account creation succeeds:

```kotlin
fun onRegistrationSuccess() {

    val event = ApptroveEvent("REGISTER_EVENT_ID")

    ApptroveSDK.trackEvent(event)
}
```

---

### Purchase

Track after the purchase has been successfully completed:

```kotlin
fun onPurchaseSuccess(orderId: String, amount: Double) {

    val event = ApptroveEvent("PURCHASE_EVENT_ID")

    event.orderId = orderId
    event.revenue = amount
    event.currency = "INR"

    ApptroveSDK.trackEvent(event)
}
```

Do not track a purchase event merely because the user opened the payment screen.

---

# 11. Avoid Duplicate Event Tracking

The same business action must not be tracked multiple times accidentally.

For example, avoid:

```kotlin
checkoutViewModel.purchase()
```

tracking the event and then tracking the same event again from:

```kotlin
PurchaseActivity
```

The preferred approach is to define a single source of truth for each business event.

---

# 12. Event Helper

For applications with many events, create a small event helper instead of duplicating SDK calls throughout the application.

Example:

```kotlin
object ApptroveEvents {

    fun trackLogin() {

        val event = ApptroveEvent("LOGIN_EVENT_ID")

        ApptroveSDK.trackEvent(event)
    }

    fun trackPurchase(
        orderId: String,
        amount: Double,
        currency: String
    ) {

        val event = ApptroveEvent("PURCHASE_EVENT_ID")

        event.orderId = orderId
        event.revenue = amount
        event.currency = currency

        ApptroveSDK.trackEvent(event)
    }
}
```

Usage:

```kotlin
ApptroveEvents.trackLogin()
```

and:

```kotlin
ApptroveEvents.trackPurchase(
    orderId = "ORDER-1001",
    amount = 499.0,
    currency = "INR"
)
```

This approach makes event implementation easier to maintain.

---

# 13. Event Implementation Rules

When an AI agent is asked to add an Apptrove event, it should follow this process.

### Step 1 — Search existing implementation

Search the project for:

```text
ApptroveEvent
trackEvent
ApptroveSDK
```

If the event already exists, do not add a duplicate implementation.

---

### Step 2 — Identify SDK version

Inspect:

```text
app/build.gradle
```

or:

```text
app/build.gradle.kts
```

Look for:

```gradle
implementation 'com.apptrove:android-sdk:...'
```

The current official installation documentation identifies:

```gradle
implementation 'com.apptrove:android-sdk:2.+'
```

as the Apptrove Android SDK dependency.

---

### Step 3 — Check the SDK API

Before generating code, verify that the installed SDK version supports the required:

```text
ApptroveEvent
trackEvent
revenue
currency
orderId
event parameters
```

Do not assume an API from another Apptrove platform such as Flutter or React Native is identical to the native Android API.

---

### Step 4 — Identify the event ID

Ask for or locate the correct Apptrove dashboard event ID.

Do not generate a fake ID.

---

### Step 5 — Add the event at the correct business location

The event should be triggered when the corresponding business action succeeds.

---

### Step 6 — Verify duplicate tracking

Search the project again for the same event ID or event implementation.

Make sure the same action is not being tracked twice.

---

# 14. Privacy and Sensitive Data

Do not send sensitive user information as event parameters unless it is explicitly required and permitted.

Avoid putting values such as:

```text
password
authentication token
access token
credit card number
CVV
private keys
session tokens
```

into event parameters.

Prefer business identifiers such as:

```text
order_id
product_id
plan_id
subscription_id
```

where appropriate.

---

# 15. Validation Checklist

After implementing an event, verify:

### SDK

```text
[ ] Apptrove SDK is installed
[ ] Apptrove SDK is initialized
```

### Event

```text
[ ] Correct event ID is used
[ ] Event is triggered at the correct business point
[ ] Event is not duplicated
[ ] Required parameters are populated
```

### Revenue

For revenue events:

```text
[ ] revenue is correct
[ ] currency is correct
[ ] orderId is correct
```

### Code quality

```text
[ ] No fake SDK methods were introduced
[ ] Existing application logic was preserved
[ ] No unrelated files were modified
[ ] Sensitive information is not being sent
```

---

# 16. Agent Instructions

When implementing an in-app event in an existing Android project:

1. Inspect the project before making changes.
2. Identify the Apptrove SDK version.
3. Search for existing Apptrove event integrations.
4. Reuse existing event helpers if available.
5. Verify the correct event ID.
6. Check whether the event is built-in or custom.
7. Add the event at the actual business-action completion point.
8. Add revenue/order information only when applicable.
9. Avoid duplicate event tracking.
10. Do not modify SDK initialization unless required.
11. Do not change Gradle dependencies unless required.
12. Do not invent SDK APIs.
13. Preserve existing application behavior.
14. Report exactly which files were modified.

---

# 17. Example — Complete Purchase Event

Example implementation:

```kotlin
fun trackPurchase(
    orderId: String,
    amount: Double,
    currency: String
) {

    val event = ApptroveEvent("PURCHASE_EVENT_ID")

    event.orderId = orderId
    event.revenue = amount
    event.currency = currency

    event.param1 = "android"

    ApptroveSDK.trackEvent(event)
}
```

Call it only after the purchase succeeds:

```kotlin
onPurchaseSuccess { purchase ->

    trackPurchase(
        orderId = purchase.orderId,
        amount = purchase.amount,
        currency = purchase.currency
    )
}
```

The event should represent the completed business transaction rather than an attempted transaction.

---

## Related References

For a complete Android integration, also refer to:

```text
skills/android/SKILL.md
skills/android/references/install.md
skills/android/references/user-data.md
skills/android/references/deep-linking.md
```

The official Apptrove developer center lists In-app Events, Passing User Data, Advanced Features, Additional Features, and Security as separate Android SDK areas.
