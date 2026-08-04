const fs = require("fs-extra");


function addDeepLink(manifestPath){


    let content =
        fs.readFileSync(
            manifestPath,
            "utf8"
        );


    if(
        content.includes(
            "android.intent.action.VIEW"
        )
    ){

        return {
            changed:false,
            message:"Deep link already configured"
        };

    }



    const deepLinkConfig = `

<intent-filter>

    <action android:name="android.intent.action.VIEW"/>

    <category android:name="android.intent.category.DEFAULT"/>

    <category android:name="android.intent.category.BROWSABLE"/>

    <data
        android:scheme="https"
        android:host="links.apptrove.com"/>

</intent-filter>

`;



    content =
        content.replace(
            "</activity>",
            `${deepLinkConfig}
</activity>`
        );


    fs.writeFileSync(
        manifestPath,
        content
    );


    return {

        changed:true,

        message:"Apptrove deep link intent-filter added"

    };

}


module.exports = addDeepLink;