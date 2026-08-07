package com.example.app

import android.app.Application
import com.apptrove.sdk.AppTroveSDK
import com.apptrove.sdk.AppTroveSDKConfig

class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        val sdkConfig = AppTroveSDKConfig(this, "YOUR_APP_TOKEN", "development")
        AppTroveSDK.initialize(sdkConfig)
    }
}
