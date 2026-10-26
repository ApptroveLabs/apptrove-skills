# AppTrove Cordova Event Tracking

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/event-tracking

## Event IDs

Create or locate the event in the AppTrove Panel and use its configured ID.

Never use a documentation sample ID as a production event ID.

## Example API pattern

The documented API family includes AppTroveEvent and trackEvent.

    const event = new AppTroveEvent(
      'YOUR_CONFIGURED_EVENT_ID'
    );

    event.setParam1('example_parameter');
    event.setParam2('example_value');

    this.apptroveCordovaPlugin.trackEvent(event);

Verify constructor and method signatures in the installed plugin before implementing.

## Event parameters

The documentation describes parameters such as:

- orderId
- revenue
- currency
- param1 through param10
- couponCode

Only include relevant and accurate values.

For purchase events, use the real transaction amount and currency.

## User data

Do not send passwords, payment-card details, or unnecessary personal information.

Use customer identifiers or contact information only when appropriate for the product and privacy requirements.

## Validation

- Trigger the event at the correct business-action point.
- Verify the event ID.
- Check AppTrove reporting or debugging data.
- Test with a non-production environment where available.
