# AppTrove iOS SDK — Apple Search Ads

Official documentation: https://developers.apptrove.com/docs/ios-sdk/advance-features/apple-search-ads

The documentation describes using Apple's AdServices attribution token API on iOS 14.3+.

Example pattern shown in the documentation (verify module and API names in the installed SDK):

```swift
import AdServices
import ApptroveSDK

if #available(iOS 14.3, *) {
    if let token = try? AAAttribution.attributionToken() {
        AppTroveSDK.updateAppleAdsToken(token: token)
    }
}
```

## Integration guidance

- Check the app's deployment target and SDK availability before adding the API.
- Confirm the current AppTrove API name and whether token retrieval should happen before or after SDK initialization in the installed SDK version.
- Do not initialize AppTrove a second time just to add Apple Search Ads support.
- Keep ATT behavior separate from AdServices token retrieval. Follow Apple's and AppTrove's current privacy requirements.
- Test on supported OS versions and validate attribution in the AppTrove dashboard.
