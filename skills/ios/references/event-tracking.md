# AppTrove iOS SDK — Event Tracking

Official documentation: https://developers.apptrove.com/docs/ios-sdk/event-tracking

## Built-in events

AppTrove provides built-in event constants and dashboard-defined custom event IDs. Use the ID configured for the intended app/event. Never copy a sample custom ID from documentation into a production app.

Example documented for the AppTrove v2 API family (verify API names against the installed version):

```swift
let event = AppTroveEvent(id: AppTroveEvent.LOGIN)
event.param1 = "login_method"
event.param2 = "email"
AppTroveSDK.trackEvent(event: event)
```

The documented built-in event family includes examples such as login, registration, logout, purchase, checkout, add-to-cart, product view, search, subscription, start trial, share, invite, app open, and tutorial/achievement events. Confirm the constant names in the installed SDK and map them to the actual business action.

## Custom events

Create/configure the event in the AppTrove dashboard, then use the exact event ID returned for that event:

```swift
let event = AppTroveEvent(id: "YOUR_DASHBOARD_EVENT_ID")
AppTroveSDK.trackEvent(event: event)
```

Replace the placeholder only with the real configured event ID.

## Revenue and parameters

The documentation describes fields including `orderId`, `revenue`, `currency`, and `param1` through `param10`, plus event-value APIs. Exact method names can differ between SDK versions; inspect the installed module/API before coding.

Example shape only:

```swift
let event = AppTroveEvent(id: "YOUR_PURCHASE_EVENT_ID")
event.orderId = "ORDER_ID_FROM_APP"
event.revenue = 19.99
event.currency = "USD"
event.param1 = "product_sku"
AppTroveSDK.trackEvent(event: event)
```

Only send real, accurate values. Use the currency code matching the transaction. Avoid exposing passwords, payment details, or unnecessary personal data.

## Validation

- Trigger the event from the real user action, not app startup unless it is an app-start event.
- Check the AppTrove event/debug/reporting view for the expected event and parameters.
- Test in a non-production environment first when available.
- Do not add arbitrary delays or synchronous sleeps around event tracking.
