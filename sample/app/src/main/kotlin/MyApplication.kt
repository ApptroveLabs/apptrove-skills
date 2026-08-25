
package com.trackier.example_app_kotlin

import android.app.Application
import com.apptrove.sdk.ApptroveEvent
import com.apptrove.sdk.ApptroveSDK

class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        ApptroveSDK.initialize(
            this,
            "YOUR_SDK_KEY"
        )

        val event = ApptroveEvent("CUSTOM_EVENT_ID")

        ApptroveSDK.setUserId("USER_ID")
        ApptroveSDK.setUserEmail("user@example.com")
        ApptroveSDK.setUserName("John Doe")
        ApptroveSDK.setUserPhone("+1234567890")

        val userDetails = hashMapOf<String, Any>(
            "Name" to "John Doe",
            "UserMobile" to "+1234567890",
            "Plan" to "Premium",
            "Country" to "IN"
        )

        ApptroveSDK.setUserAdditionalDetails(userDetails)

        ApptroveSDK.trackEvent(event)
    }
}