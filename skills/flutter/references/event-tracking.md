# Event Tracking

Official source: https://developers.apptrove.com/docs/flutter-sdk/event-tracking

Events use `AppTroveEvent` and `AppTroveFlutterSdk.trackEvent(...)`.

## Built-in event example
```dart
import 'package:apptrove_sdk_flutter/apptrove_sdk_flutter.dart';

void trackLogin() {
  final event = AppTroveEvent(AppTroveEvent.LOGIN);
  event.param1 = 'login_method';
  event.param2 = 'email';
  event.setEventValue('source', 'login_screen');
  AppTroveFlutterSdk.trackEvent(event);
}
```

Documented built-in event IDs include `LOGIN`, `REGISTER`, `LOGOUT`, `PURCHASE`, `CHECKOUT_STARTED`, `CHECKOUT_COMPLETED`, `ADD_TO_WISHLIST`, `CONTENT_VIEW`, `VIEW_CART`, `REMOVE_FROM_CART`, `SEARCH`, `PRODUCT_VIEW`, `UPDATE`, `INVITE`, `SHARE`, `START_TRIAL`, `SUBSCRIBE`, `COMPLETE_REGISTER`, `ACHIEVEMENT_UNLOCK`, `TUTORIAL_COMPLETE`, `APP_OPEN`, `TRAVEL_BOOKING`, `PRODUCT_SEARCH`, `REGISTRATION`, `ADD_TO_CART`, and `LEVEL_ACHIEVED`. Confirm constants against the installed package.

## Custom event
Create/configure the event in the AppTrove Panel and use its actual event ID:
```dart
void trackCustomEvent() {
  final event = AppTroveEvent('YOUR_CUSTOM_EVENT_ID');
  event.param1 = 'YOUR_PARAM_VALUE';
  event.setEventValue('screen', 'checkout');
  AppTroveFlutterSdk.trackEvent(event);
}
```
Do not invent event IDs.

The official guide lists `orderId`, `revenue`, `currency`, `param1` through `param10`, and `setEventValue(key, value)` for extra key-value data. Check exact types/API in the installed v2 package before use. Send purchase events at the confirmed success point, not merely on button taps. Do not log payment secrets or sensitive data. Avoid duplicate event firing and verify events in the dashboard/logs.
