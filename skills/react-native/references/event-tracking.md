# Event Tracking

Official source: https://developers.apptrove.com/docs/react-native-sdk/event-tracking

---

On this page

SDK Version Selection

**Choose your SDK version below:**

- **Apptrove SDK** â Recommended for all projects (Latest: v2.x.x)
- **Trackier SDK** â Will be deprecated in August 2026 (v1.x.xx)

Use the tabs below to view event tracking code for your chosen SDK.

The Apptrove React Native SDK enables tracking of user interactions through events, providing insights into how users engage with your app. This section covers how to track built-in events, custom events, revenue events, and pass custom parameters, using event IDs retrieved from the Apptrove Panel.

### Prerequisites[â](#prerequisites "Direct link to Prerequisites")

- Apptrove React Native SDK installed and initialized in your project
- A Apptrove MMP account with access to the Apptrove Panel
- React Native 0.60 or later
- Basic knowledge of JavaScript and React Native development

### Retrieve Event ID from Dashboard[â](#retrieve-event-id-from-dashboard "Direct link to Retrieve Event ID from Dashboard")

To track events, you need the event ID from the Apptrove Panel.

#### Steps to Retrieve Event ID[â](#steps-to-retrieve-event-id "Direct link to Steps to Retrieve Event ID")

1. Log in to your Apptrove Panel.
2. Navigate to the **Events** section in the Dashboard.
3. Copy the event ID for the desired built-in or custom event.

### Built-in Events[â](#built-in-events "Direct link to Built-in Events")

Built-in events are predefined in the Apptrove dashboard and can be tracked directly using constants like `ApptroveEvent.PURCHASE` / `TrackierEvent.PURCHASE`, `ApptroveEvent.ADD_TO_CART` / `TrackierEvent.ADD_TO_CART`, etc.

#### Available Parameters[â](#available-parameters "Direct link to Available Parameters")

- `param1` to `param10`
- `revenue`
- `currency`
- `ev` (for custom key-value pairs)

#### Supported Built-in Events[â](#supported-built-in-events "Direct link to Supported Built-in Events")

- `LOGIN`
- `REGISTER`
- `LOGOUT`
- `PURCHASE`
- `CHECKOUT_STARTED`
- `CHECKOUT_COMPLETED`
- `ADD_TO_WISHLIST`
- `CONTENT_VIEW`
- `VIEW_CART`
- `REMOVE_FROM_CART`
- `SEARCH`
- `PRODUCT_VIEW`
- `UPDATE`
- `INVITE`
- `SHARE`
- `START_TRIAL`
- `SUBSCRIBE`
- `COMPLETE_REGISTER`
- `ACHIEVEMENT_UNLOCK`
- `TUTORIAL_COMPLETE`
- `APP_OPEN`
- `TRAVEL_BOOKING`
- `PRODUCT_SEARCH`
- `REGISTRATION`
- `ADD_TO_CART`
- `LEVEL_ACHIEVED`

#### Steps to Track Built-in Events[â](#steps-to-track-built-in-events "Direct link to Steps to Track Built-in Events")

1. Create an event object (`ApptroveEvent` or `TrackierEvent`) with the built-in event ID (e.g., `PURCHASE`).
2. Optionally, set parameters like `param1`, `param2`, or custom data.
3. Call the SDK's `trackEvent` method to track the event.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

##### JavaScript Example[â](#javascript-example "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("xxxx-xx-4505-bc8b-xx", ApptroveConfig.EnvironmentDevelopment);
  ApptroveSDK.initialize(apptroveConfig);

  const trackBuiltInEvent = () => {
    const apptroveEvent = new ApptroveEvent(ApptroveEvent.PURCHASE); // Built-in event
    apptroveEvent.param1 = "XXXXXX";
    apptroveEvent.param2 = "kkkkkkk";
    ApptroveSDK.trackEvent(apptroveEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackBuiltInEvent}>
        <Text>Track Built-in Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

##### JavaScript Example[â](#javascript-example-1 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("xxxx-xx-4505-bc8b-xx", TrackierConfig.EnvironmentDevelopment);
  TrackierSDK.initialize(trackierConfig);

  const trackBuiltInEvent = () => {
    const trackierEvent = new TrackierEvent(TrackierEvent.PURCHASE); // Built-in event
    trackierEvent.param1 = "XXXXXX";
    trackierEvent.param2 = "kkkkkkk";
    TrackierSDK.trackEvent(trackierEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackBuiltInEvent}>
        <Text>Track Built-in Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

### Custom Events[â](#custom-events "Direct link to Custom Events")

Custom events are user-defined in the Apptrove Panel to track app-specific actions tailored to your business logic.

#### Steps to Track Custom Events[â](#steps-to-track-custom-events "Direct link to Steps to Track Custom Events")

1. Create a custom event in the Apptrove Panel under the **Events** section.
2. Note the event ID for the custom event.
3. Use the event class (`ApptroveEvent` or `TrackierEvent`) with the custom event ID to track the event.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("xxxx-xx-4505-bc8b-xx", ApptroveConfig.EnvironmentDevelopment);
  ApptroveSDK.initialize(apptroveConfig);

  const trackCustomEvent = () => {
    const apptroveEvent = new ApptroveEvent("sEMWSCTXeu"); // Custom event ID from Panel
    apptroveEvent.param1 = "XXXXXX";
    apptroveEvent.param2 = "kkkkkkk";
    const value = { id: 1, phone: "+91-8130XXX721", name: "Embassies" };
    apptroveEvent.setEventValue("data", value);
    ApptroveSDK.trackEvent(apptroveEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackCustomEvent}>
        <Text>Track Custom Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

##### JavaScript Example[â](#javascript-example-2 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("xxxx-xx-4505-bc8b-xx", TrackierConfig.EnvironmentDevelopment);
  TrackierSDK.initialize(trackierConfig);

  const trackCustomEvent = () => {
    const trackierEvent = new TrackierEvent("sEMWSCTXeu"); // Custom event ID from Panel
    trackierEvent.param1 = "XXXXXX";
    trackierEvent.param2 = "kkkkkkk";
    const value = { id: 1, phone: "+91-8130XXX721", name: "Embassies" };
    trackierEvent.setEventValue("data", value);
    TrackierSDK.trackEvent(trackierEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackCustomEvent}>
        <Text>Track Custom Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

### 3. Complete Event Tracking Example[â](#3-complete-event-tracking-example "Direct link to 3. Complete Event Tracking Example")

This comprehensive example demonstrates how to track a `COMPLETE_REGISTRATION` event with all available parameters, user data, and custom attributes.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

CompleteEventTracking.js

```
function trackCompleteRegistration() {
  // Note: Ensure ApptroveSDK.initialize is called before tracking events.

  const event = new ApptroveEvent(ApptroveEvent.COMPLETE_REGISTRATION);
  // Alternatively: const event = new ApptroveEvent("YOUR_EVENT_ID");

  event.orderId = "REG_001";
  event.productId = "FREE_PLAN";
  event.couponCode = "343434234";
  event.discount = 3.1415;
  event.revenue = 34234234.32423;
  event.currency = "USD";
  event.param1 = "Test1";
  event.param2 = "Test2";
  event.param3 = "Test3";
  event.param4 = "Test4";
  event.param5 = "Test5";
  event.param6 = "Test6";
  event.param7 = "Test7";
  event.param8 = "Test8";
  event.param9 = "Test9";
  event.param10 = "Test10";

  const jsonData = { url: "+91-8130300721", name: "Embassies" };
  event.setEventValue("data", JSON.stringify(jsonData));
  event.setEventValue("signup_time", 1631234567890);
  event.setEventValue("sdk", "ReactNative");

  ApptroveSDK.setUserId("USER123");
  ApptroveSDK.setUserEmail("user@example.com");
  ApptroveSDK.setUserName("Jane Doe");
  ApptroveSDK.setUserPhone("+1234567890");
  ApptroveSDK.setIMEI("123456789012345", "987654321098765");
  ApptroveSDK.setMacAddress("00:1A:2B:3C:4D:5E");

  const userDetails = { Plan: "FREE_PLAN", SignupMethod: "Email", AppVersion: "1.0.0", DOB: "1990-01-01", Gender: "Male" };
  ApptroveSDK.setUserAdditionalDetails("userDetails", JSON.stringify(userDetails));

  ApptroveSDK.trackEvent(event);
}
```

CompleteEventTracking.js

```
function trackCompleteRegistration() {
  // Note: Ensure TrackierSDK.initialize is called before tracking events.

  const event = new TrackierEvent(TrackierEvent.COMPLETE_REGISTRATION);
  // Alternatively: const event = new TrackierEvent("w43424");

  event.orderId = "REG_001";
  event.productId = "FREE_PLAN";
  event.couponCode = "343434234";
  event.discount = 3.1415;
  event.revenue = 34234234.32423;
  event.currency = "USD";
  event.param1 = "Test1";
  event.param2 = "Test2";
  event.param3 = "Test3";
  event.param4 = "Test4";
  event.param5 = "Test5";
  event.param6 = "Test6";
  event.param7 = "Test7";
  event.param8 = "Test8";
  event.param9 = "Test9";
  event.param10 = "Test10";

  const jsonData = { url: "+91-8130300721", name: "Embassies" };
  event.ev = jsonData;
  event.setEventValue("signup_time", 1631234567890);
  event.setEventValue("sdk", "ReactNative");

  TrackierSDK.setUserId("USER123");
  TrackierSDK.setUserEmail("user@example.com");
  TrackierSDK.setUserName("Jane Doe");
  TrackierSDK.setUserPhone("+1234567890");
  TrackierSDK.setIMEI("123456789012345", "987654321098765");
  TrackierSDK.setMacAddress("00:1A:2B:3C:4D:5E");

  const userDetails = { Plan: "FREE_PLAN", SignupMethod: "Email", AppVersion: "1.0.0", DOB: "1990-01-01", Gender: "Male" };
  TrackierSDK.setUserAdditionalDetails("userDetails", userDetails);

  TrackierSDK.trackEvent(event);
}
```

### 4. Revenue Events[â](#4-revenue-events "Direct link to 4. Revenue Events")

Revenue events allow you to track in-app revenue, including the amount and currency, to monitor monetization performance.

#### Steps to Track Revenue Events[â](#steps-to-track-revenue-events "Direct link to Steps to Track Revenue Events")

1. Create an event object with the event ID (e.g., `PURCHASE`).
2. Set the `revenue` and `currency` properties.
3. Call the SDK's `trackEvent` to track the revenue event.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

##### JavaScript Example[â](#javascript-example-3 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("xxxx-xx-4505-bc8b-xx", ApptroveConfig.EnvironmentDevelopment);
  ApptroveSDK.initialize(apptroveConfig);

  const trackRevenueEvent = () => {
    const revenueEvent = new ApptroveEvent(ApptroveEvent.PURCHASE);
    revenueEvent.param1 = "XXXXXX";
    revenueEvent.param2 = "kkkkkkk";
    revenueEvent.revenue = 2.5;
    revenueEvent.currency = "USD";
    ApptroveSDK.trackEvent(revenueEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackRevenueEvent}>
        <Text>Track Revenue Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

##### JavaScript Example[â](#javascript-example-4 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("xxxx-xx-4505-bc8b-xx", TrackierConfig.EnvironmentDevelopment);
  TrackierSDK.initialize(trackierConfig);

  const trackRevenueEvent = () => {
    const revenueEvent = new TrackierEvent(TrackierEvent.PURCHASE);
    revenueEvent.param1 = "XXXXXX";
    revenueEvent.param2 = "kkkkkkk";
    revenueEvent.revenue = 2.5;
    revenueEvent.currency = "USD";
    TrackierSDK.trackEvent(revenueEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackRevenueEvent}>
        <Text>Track Revenue Event</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

### Custom Parameters[â](#custom-parameters "Direct link to Custom Parameters")

Custom parameters allow you to add additional key-value pairs to events for richer context and analytics.

#### Steps to Add Custom Parameters[â](#steps-to-add-custom-parameters "Direct link to Steps to Add Custom Parameters")

1. Create an event object with the event ID.
2. Add custom data (e.g., assign to `ev` or use `setEventValue`).
3. Track the event using the SDK's `trackEvent`.

- â Apptrove SDK (Recommended)
- Trackier SDK (Deprecating August 2026)

##### JavaScript Example[â](#javascript-example-5 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { ApptroveConfig, ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const apptroveConfig = new ApptroveConfig("xxxx-xx-4505-bc8b-xx", ApptroveConfig.EnvironmentDevelopment);
  ApptroveSDK.initialize(apptroveConfig);

  const trackCustomParamsEvent = () => {
    const apptroveEvent = new ApptroveEvent("sEMWSCTXeu"); // Custom event ID from Panel
    const jsonData = { phone: "+91-8137872378", name: "Embassies" };
    apptroveEvent.setEventValue("data", JSON.stringify(jsonData));
    ApptroveSDK.trackEvent(apptroveEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackCustomParamsEvent}>
        <Text>Track Event with Custom Params</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

##### JavaScript Example[â](#javascript-example-6 "Direct link to JavaScript Example")

App.js

```
import React from 'react';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const trackierConfig = new TrackierConfig("xxxx-xx-4505-bc8b-xx", TrackierConfig.EnvironmentDevelopment);
  TrackierSDK.initialize(trackierConfig);

  const trackCustomParamsEvent = () => {
    const trackierEvent = new TrackierEvent("sEMWSCTXeu"); // Custom event ID for "AppOpen"
    const jsonData = { phone: "+91-8137872378", name: "Embassies" };
    trackierEvent.ev = jsonData;
    TrackierSDK.trackEvent(trackierEvent);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={trackCustomParamsEvent}>
        <Text>Track Event with Custom Params</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 10, backgroundColor: '#ddd' },
});
```

### Best Practices[â](#best-practices "Direct link to Best Practices")

- **Validate Event IDs**: Ensure event IDs are correctly copied from the Apptrove Panel to avoid tracking errors.
- **Use Descriptive Parameters**: Set meaningful values for `param1` to `param10` and custom parameters to facilitate analytics.
- **Test in Development Mode**: Use `ApptroveConfig.EnvironmentDevelopment` or `TrackierConfig.EnvironmentDevelopment` during testing to verify event tracking without affecting production data.
- **Monitor Event Limits**: Avoid excessive event tracking to stay within Apptrove usage limits; prioritize key user actions.
- **Log Events for Debugging**: Use `console.log` to confirm events are triggered and sent correctly during development.
- **Comply with Privacy Regulations**: Ensure event data (e.g., revenue, custom parameters) complies with GDPR, CCPA, and other privacy laws.

### Troubleshooting[â](#troubleshooting "Direct link to Troubleshooting")

- **Events Not Appearing in Dashboard**:
  - Verify the event ID matches the one in the Apptrove Panel.
  - Ensure the SDK is initialized before tracking events.
  - Check that the environment (`EnvironmentDevelopment` or `EnvironmentProduction`) matches the dashboard settings.
- **Custom Parameters Not Tracked**:
  - Confirm the `ev` property is assigned a valid JavaScript object with supported key-value pairs.
  - Check for syntax errors in the `jsonData` object.
- **Revenue Tracking Issues**:
  - Verify the `revenue` and `currency` values are correctly set and use supported currency codes (e.g., `"USD"`, `"INR"`).
- **General Issues**:
  - Check the console logs for errors related to `ApptroveSDK.trackEvent` or `TrackierSDK.trackEvent`.

For further assistance, refer to the [Apptrove Documentation Portal](https://help.apptrove.com/en/) or contact support at [support@apptrove.com](mailto:support@apptrove.com).
