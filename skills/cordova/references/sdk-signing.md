# AppTrove SDK Signing

Official documentation:
https://developers.apptrove.com/docs/cordova-sdk/security/sdk-signing

## Credentials

The documentation describes obtaining Secret ID and Secret Key from the application's advanced SDK settings in the AppTrove Panel.

## Configuration example

Verify the API against the installed SDK version.

    const config = new AppTroveConfig(
      'YOUR_APPTROVE_SDK_KEY',
      AppTroveEnvironment.Production
    );

    config.setAppSecret(
      'YOUR_SECRET_ID',
      'YOUR_SECRET_KEY'
    );

    this.apptroveCordovaPlugin.initializeSDK(config);

Use the actual environment constant exposed by the installed plugin.

## Security precautions

- Never commit real credentials to source control.
- Do not print secret values in logs.
- Do not rotate production credentials without authorization.
- Secrets embedded in client applications may be recoverable from the distributed application.
- Follow organizational security policies and AppTrove's current recommendations.
- Validate the configuration in a controlled environment.
