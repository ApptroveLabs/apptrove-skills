const fs = require("fs-extra");


function injectApptrove(file){


    let content =
        fs.readFileSync(
            file,
            "utf8"
        );


    // Already integrated
    if(
        content.includes("AppTroveSDK.initialize")
    ){

        return {
            changed:false,
            message:"AppTrove SDK initialization already exists"
        };

    }



    if(file.endsWith(".kt")) {


        if(!content.includes("AppTroveSDK")) {


            const sdkCode = `

        val sdkConfig = AppTroveSDKConfig(
            this,
            "SDK_KEY",
            "development"
        )

        AppTroveSDK.initialize(
            sdkConfig
        )
`;

            content = content.replace(
                /override\s+fun\s+onCreate\s*\(\s*\)\s*\{/,
`
override fun onCreate(){

${sdkCode}
`
            );


            // Add imports
            if(
                !content.includes(
                    "import com.apptrove.sdk.AppTroveSDK"
                )
            ){

                content =
                content.replace(
                    /^package (.*)$/m,
`
package $1

import com.apptrove.sdk.AppTroveSDK
import com.apptrove.sdk.AppTroveSDKConfig
`
                );

            }

        }

    }



    fs.writeFileSync(
        file,
        content
    );


    // Verify actual injection happened
    if(
        content.includes("AppTroveSDK.initialize")
    ){

        return {
            changed:true,
            message:"AppTrove SDK initialization added"
        };

    }


    return {
        changed:false,
        message:"Failed to inject AppTrove SDK initialization"
    };

}


module.exports = injectApptrove;