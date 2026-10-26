# AppTrove iOS SDK — Deep Linking

Official documentation: https://developers.apptrove.com/docs/ios-sdk/advance-features/deep-linking

## Dashboard and Apple configuration

1. Confirm the app's bundle ID and Apple Developer Team/Prefix ID.
2. Configure the intended UniLink/template in AppTrove.
3. Add the actual configured domain to the app's Associated Domains entitlement, using the format:
   `applinks:YOUR_CONFIGURED_UNILINK_DOMAIN`
4. Ensure the domain and associated-domain setup match the dashboard and Apple configuration.

Do not insert a guessed domain or a placeholder into a production entitlement.

## App handling

- Inspect the app's current universal-link entry points and router before modifying them.
- Preserve existing `application(_:continue:restorationHandler:)`, scene-based URL handling, or SwiftUI routing as appropriate.
- Route the validated destination into the existing navigation system; do not build a parallel router without need.
- Test cold start, warm start, app not installed/browser fallback, and valid/invalid parameters.

Universal Link configuration involves Apple Developer/Xcode setup as well as SDK integration. A code change alone does not prove the link is configured correctly.
