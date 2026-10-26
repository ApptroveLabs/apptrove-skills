# App Tracking Transparency and IDFA

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/additional-features/app-tracking-transparency

## Usage description

When requesting ATT permission, configure NSUserTrackingUsageDescription in the iOS Info.plist.

The explanation must accurately describe why the application requests permission.

Do not use misleading or generic permission text.

## Waiting for ATT

The documentation describes this API pattern before SDK initialization:

    this.apptroveCordovaPlugin.waitForATTUserAuthorization(20);

Verify the method and parameter behavior in the installed plugin.

## Important considerations

- IDFA is not guaranteed to be available.
- The user may deny tracking permission.
- Do not repeatedly trigger the system permission prompt.
- Avoid blocking startup indefinitely.
- Test authorized and denied flows.
- Check whether initialization timing affects deferred deep linking.
- Do not add another ATT plugin without checking the existing native setup.
