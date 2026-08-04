# Apptrove Android SDK Integration Skill


## Objective

Integrate Apptrove SDK into an Android application.


## Project Analysis


First inspect:


- settings.gradle
- build.gradle
- app/build.gradle
- AndroidManifest.xml
- Application class


Identify:

- Package name
- Application ID
- Kotlin/Java project
- Gradle version


---

## SDK Dependency


Add Apptrove SDK dependency.


Example:


implementation("com.apptrove:apptrove-sdk:<version>")


Place dependency inside:

app/build.gradle


---

## SDK Initialization


Find Application class.


Kotlin example:


class App : Application(){

override fun onCreate(){

super.onCreate()


ApptroveSDK.initialize(
    this,
    "SDK_KEY"
)


}

}


---

## Deep Link Setup


Configure AndroidManifest:


<intent-filter>

<action android:name="android.intent.action.VIEW"/>

<category android:name="android.intent.category.DEFAULT"/>

<category android:name="android.intent.category.BROWSABLE"/>


<data android:scheme="https"/>

</intent-filter>


---

## Install Referrer


Verify Google Play Install Referrer dependency.


---

## Validation


After changes run:

validators:

- check-gradle
- check-manifest
- check-links


---

## Output


Provide summary:


SDK added:
YES

Initialization:
YES

Deep Links:
YES

Validation:
PASSED
