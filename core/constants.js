/**
 * Canonical AppTrove SDK package coordinates and versions
 * sourced from sibling SDK repos under Apptrove-Sdk/.
 */
module.exports = {
  platforms: [
    "android",
    "ios",
    "flutter",
    "react-native",
    "expo",
    "cordova",
    "maui",
    "unity"
  ],

  android: {
    groupId: "com.apptrove",
    artifactId: "android-sdk",
    version: "2.0.1",
    dependency: 'implementation "com.apptrove:android-sdk:2.0.1"',
    installReferrer: 'implementation "com.android.installreferrer:installreferrer:2.2"',
    adsIdentifier: 'implementation "com.google.android.gms:play-services-ads-identifier:18.0.1"',
    sdkClass: "AppTroveSDK",
    configClass: "AppTroveSDKConfig",
    package: "com.apptrove.sdk"
  },

  ios: {
    pod: "apptrove-ios-sdk",
    podVersion: "2.0.6",
    spmProduct: "ApptroveSDK",
    spmVersion: "2.0.4",
    spmUrl: "https://github.com/ApptroveLabs/Trackier_iOS_SDK.git",
    cocoapodsImport: "apptrove_ios_sdk",
    spmImport: "ApptroveSDK"
  },

  flutter: {
    pubName: "apptrove_sdk_flutter",
    version: "2.0.5",
    pubConstraint: "^2.0.5"
  },

  reactNative: {
    npmName: "react-native-apptrove",
    version: "2.0.1"
  },

  expo: {
    npmName: "apptrove-expo-sdk",
    version: "2.0.3",
    plugin: "apptrove-expo-sdk"
  },

  cordova: {
    pluginId: "com.apptrove.cordova_sdk",
    version: "2.0.5",
    installCommand: "npm install ApptroveLabs/cordova_sdk#ApptroveSDK"
  },

  maui: {
    nuget: "AppTroveSDK.Maui",
    version: "2.1.0"
  },

  // Unity has Trackier only (no Apptrove v2 SDK yet)
  unity: {
    brand: "trackier",
    namespace: "com.trackier.sdk",
    version: "1.6.74",
    minVersion: "1.6.57",
    downloadUrl:
      "https://drive.google.com/drive/folders/1VExFSHH3aSGqVpN8DZR_o_t4GMS4vXIB?usp=sharing",
    sdkClass: "TrackierUnity",
    configClass: "TrackierConfig",
    eventClass: "TrackierEvent",
    assetsFolder: "Assets/Trackier"
  },

  // Trackier v1.x deprecated August 2026 on native/cross-platform — Unity remains Trackier-only for now
  legacyDeprecated: "August 2026",

  defaultEnv: "development",
  placeholderSdkKey: "YOUR_APP_TOKEN",
  docsUrl: "https://dev.apptrove.com"
};
