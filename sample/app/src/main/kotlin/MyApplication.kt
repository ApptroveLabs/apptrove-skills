

package com.example.app

import com.apptrove.sdk.AppTroveSDK
import com.apptrove.sdk.AppTroveSDKConfig


import android.app.Application


class MyApplication : Application(){
    

override fun onCreate(){



        val sdkConfig = AppTroveSDKConfig(
            this,
            "SDK_KEY",
            "development"
        )

        AppTroveSDK.initialize(
            sdkConfig
        )



    super.onCreate()

    }

}