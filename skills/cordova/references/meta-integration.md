# AppTrove Meta Integration

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/advance-features/meta-integration

## Scope

The documented Cordova Meta integration is Android-specific and supports attribution involving Meta applications such as Facebook and Instagram.

## Meta App ID

Retrieve the correct Facebook App ID from Meta for Developers.

Confirm that the Meta application is configured for the correct Android package name.

## AppTrove configuration example

The documentation describes this API pattern:

    const config = new AppTroveConfig(
      'YOUR_APPTROVE_SDK_KEY',
      AppTroveEnvironment.Production
    );

    config.setFacebookAppId('YOUR_FACEBOOK_APP_ID');

    this.apptroveCordovaPlugin.initializeSDK(config);

Verify exact method names and the correct environment for the installed plugin.

## Android manifest

The documentation describes package visibility entries for:

- com.facebook.katana
- com.facebook.lite
- com.instagram.android

Inspect the current manifest and target SDK requirements before editing.

Do not remove existing package visibility declarations or replace the complete manifest.

## Troubleshooting

- Verify the Facebook App ID.
- Confirm the Android package name.
- Confirm required Meta apps and configuration.
- Verify AppTrove initialization order.
- Check any required GPIR decryption key configuration.
- Test a valid campaign and confirm attribution in AppTrove.
