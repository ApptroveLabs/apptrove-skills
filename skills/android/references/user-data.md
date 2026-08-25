# Apptrove Android SDK — User Data

This guide explains how to associate user information and custom user attributes with Apptrove Android SDK events.

Apptrove provides APIs for setting core user identifiers and additional custom user attributes.

---

## 1. User Data APIs

The Apptrove Android SDK provides the following APIs for user information:

```java
AppTroveSDK.setUserId("XXXXXXXX");
AppTroveSDK.setUserEmail("abc@gmail.com");
AppTroveSDK.setUserName("abc");
AppTroveSDK.setUserPhone("983293829");
```

Additional custom user attributes can be passed using:

```java
AppTroveSDK.setUserAdditionalDetails(userDetails);
```

---

## 2. Set Core User Information

Use the following APIs to set the user's core information:

```java
AppTroveSDK.setUserId("XXXXXXXX");
AppTroveSDK.setUserEmail("abc@gmail.com");
AppTroveSDK.setUserName("abc");
AppTroveSDK.setUserPhone("983293829");
```

### Available fields

| API              | Purpose                         |
| ---------------- | ------------------------------- |
| `setUserId()`    | Sets the unique user identifier |
| `setUserEmail()` | Sets the user's email address   |
| `setUserName()`  | Sets the user's display name    |
| `setUserPhone()` | Sets the user's phone number    |

`userId` should preferably be a stable identifier for the application user.

---

## 3. Set Additional User Attributes

Application-specific user information can be passed using a `HashMap`.

```java
HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Name", "Sanu");
userDetails.put("UserMobile", "873287XXXX");

AppTroveSDK.setUserAdditionalDetails(userDetails);
```

Additional attributes can be used when the application needs to pass information that is not covered by the core user APIs.

Example:

```java
HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Name", "Sanu");
userDetails.put("UserMobile", "873287XXXX");
userDetails.put("Plan", "Premium");
userDetails.put("Country", "IN");

AppTroveSDK.setUserAdditionalDetails(userDetails);
```

Only send attributes that are required by the application and permitted by the applicable privacy requirements.

---

## 4. Complete User Data Example

A complete implementation can look like this:

```java
private void userDetails() {

    // Set core user identifiers
    AppTroveSDK.setUserId("XXXXXXXX");
    AppTroveSDK.setUserEmail("abc@gmail.com");
    AppTroveSDK.setUserName("abc");
    AppTroveSDK.setUserPhone("983293829");

    // Set additional custom attributes
    HashMap<String,Object> userDetails = new HashMap<>();
    userDetails.put("Name", "Sanu");
    userDetails.put("UserMobile", "873287XXXX");

    AppTroveSDK.setUserAdditionalDetails(userDetails);

    // Create and track an event
    AppTroveEvent event = new AppTroveEvent("sEMWSCTXeu");

    AppTroveSDK.trackEvent(event);
}
```

---

## 5. When to Set User Information

Set user information when the application has identified the user.

Recommended integration points include:

* User registration
* Successful login
* Profile update
* Account restoration
* Account switching

For example:

```java
private void onLoginSuccess(User user) {

    AppTroveSDK.setUserId(user.getId());
    AppTroveSDK.setUserEmail(user.getEmail());
    AppTroveSDK.setUserName(user.getName());
    AppTroveSDK.setUserPhone(user.getPhone());
}
```

User information should be updated when the application receives new or changed user information.

---

## 6. Login Flow

The recommended flow after a successful login is:

```text
Login succeeds
      ↓
Receive user information
      ↓
Set user ID
      ↓
Set email
      ↓
Set name
      ↓
Set phone
      ↓
Set additional user attributes
      ↓
Track subsequent events
```

Example:

```java
private void onLoginSuccess(User user) {

    AppTroveSDK.setUserId(user.getId());
    AppTroveSDK.setUserEmail(user.getEmail());
    AppTroveSDK.setUserName(user.getName());
    AppTroveSDK.setUserPhone(user.getPhone());

    HashMap<String,Object> userDetails = new HashMap<>();

    userDetails.put("Name", user.getName());
    userDetails.put("UserMobile", user.getPhone());

    AppTroveSDK.setUserAdditionalDetails(userDetails);
}
```

---

## 7. Registration Flow

After successful registration, set the newly created user's information.

```java
private void onRegistrationSuccess(User user) {

    AppTroveSDK.setUserId(user.getId());
    AppTroveSDK.setUserEmail(user.getEmail());
    AppTroveSDK.setUserName(user.getName());
    AppTroveSDK.setUserPhone(user.getPhone());
}
```

Do not send user information before registration succeeds.

---

## 8. Updating User Information

If user information changes, update the corresponding Apptrove fields.

For example, when a user changes their phone number:

```java
AppTroveSDK.setUserPhone(newPhone);
```

If multiple values change:

```java
AppTroveSDK.setUserId(user.getId());
AppTroveSDK.setUserEmail(user.getEmail());
AppTroveSDK.setUserName(user.getName());
AppTroveSDK.setUserPhone(user.getPhone());
```

Additional attributes should also be updated when their values change:

```java
HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Name", user.getName());
userDetails.put("UserMobile", user.getPhone());

AppTroveSDK.setUserAdditionalDetails(userDetails);
```

---

## 9. Tracking an Event With User Context

After setting the user information, events can be tracked.

Example:

```java
AppTroveEvent event = new AppTroveEvent("sEMWSCTXeu");

AppTroveSDK.trackEvent(event);
```

Complete flow:

```java
AppTroveSDK.setUserId("XXXXXXXX");
AppTroveSDK.setUserEmail("abc@gmail.com");
AppTroveSDK.setUserName("abc");
AppTroveSDK.setUserPhone("983293829");

HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Name", "Sanu");
userDetails.put("UserMobile", "873287XXXX");

AppTroveSDK.setUserAdditionalDetails(userDetails);

AppTroveEvent event = new AppTroveEvent("sEMWSCTXeu");

AppTroveSDK.trackEvent(event);
```

---

## 10. Important Ordering

When an event needs to be associated with the current user, set the user information before tracking the event.

Preferred:

```text
Set user information
        ↓
Set additional attributes
        ↓
Create event
        ↓
Track event
```

Avoid:

```text
Track event
        ↓
Set user information
```

when the event is expected to contain the newly identified user's context.

---

## 11. Partial User Information

Not every application will have all user fields.

For example, if only the user ID and email are available:

```java
AppTroveSDK.setUserId(userId);
AppTroveSDK.setUserEmail(email);
```

When additional information becomes available later:

```java
AppTroveSDK.setUserName(name);
AppTroveSDK.setUserPhone(phone);
```

Do not create fake or placeholder values for unavailable user information.

---

## 12. Additional Attributes

Additional attributes are application-defined key-value pairs.

Example:

```java
HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Name", "Sanu");
userDetails.put("UserMobile", "873287XXXX");
userDetails.put("Plan", "Premium");
userDetails.put("Age", 30);
userDetails.put("IsSubscribed", true);

AppTroveSDK.setUserAdditionalDetails(userDetails);
```

Supported value types should follow the SDK's API contract.

Use meaningful and stable attribute names.

---

## 13. Do Not Send Authentication Secrets

Do not pass sensitive authentication or security information as user attributes.

Do not add values such as:

```text
password
access token
refresh token
API key
private key
OTP
CVV
```

Only send appropriate user/profile information and application attributes.

---

## 14. Agent Implementation Instructions

When an AI coding agent is asked to implement Apptrove user data:

### Step 1 — Find the user lifecycle

Look for:

```text
Login
Registration
Profile update
Account switching
```

### Step 2 — Find the application user model

Reuse the application's existing user model.

Do not create a duplicate user model unless required.

### Step 3 — Map core fields

Map application values to:

```java
AppTroveSDK.setUserId(...)
AppTroveSDK.setUserEmail(...)
AppTroveSDK.setUserName(...)
AppTroveSDK.setUserPhone(...)
```

### Step 4 — Map custom attributes

If the application requires additional attributes:

```java
HashMap<String,Object> userDetails = new HashMap<>();

userDetails.put("Key", value);

AppTroveSDK.setUserAdditionalDetails(userDetails);
```

### Step 5 — Preserve event ordering

When an event must contain user context:

```text
Set user information
       ↓
Set additional attributes
       ↓
Track event
```

### Step 6 — Check for existing integration

Before adding new code, search for:

```text
setUserId
setUserEmail
setUserName
setUserPhone
setUserAdditionalDetails
trackEvent
```

If an existing implementation is found, modify or extend it rather than creating duplicate logic.

---

## 15. Validation Checklist

After implementation, verify:

### Core user data

```text
[ ] setUserId() is used for the application's user identifier
[ ] setUserEmail() is used when email is available
[ ] setUserName() is used when name is available
[ ] setUserPhone() is used when phone is available
```

### Additional attributes

```text
[ ] HashMap<String,Object> is used
[ ] setUserAdditionalDetails() is called
[ ] Attribute names are meaningful
[ ] Sensitive authentication information is not included
```

### Events

```text
[ ] User information is set before dependent events
[ ] AppTroveEvent is created using the application's event identifier
[ ] trackEvent() is called
```

### Integration quality

```text
[ ] Existing user model is reused
[ ] Existing Apptrove integration is not duplicated
[ ] Login and registration flows are handled correctly
[ ] Profile updates are handled where required
[ ] Existing application behavior is preserved
```

---

## 16. Expected Agent Report

After implementing user data, the agent should report:

```text
Apptrove User Data Integration

Core user fields:
- User ID
- Email
- Name
- Phone

Additional user attributes:
- <attribute names>

Integration points:
- Login
- Registration
- Profile update

Event context:
- User information is configured before dependent events are tracked.

Files changed:
- <file 1>
- <file 2>

Validation:
- Existing Apptrove integration preserved.
- No duplicate user-data integration added.
- No authentication secrets added.
```

---

## Related References

```text
skills/android/SKILL.md
skills/android/references/install.md
skills/android/references/in-app-events.md
skills/android/references/deep-linking.md
```

Use the official Apptrove Android SDK documentation as the source of truth for SDK installation, API availability, and version-specific behavior.
