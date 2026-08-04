const fs = require("fs-extra");


function validateDeepLink(manifestPath){


    const content =
        fs.readFileSync(
            manifestPath,
            "utf8"
        );


    const checks = {

        VIEW:
        content.includes(
            "android.intent.action.VIEW"
        ),


        BROWSABLE:
        content.includes(
            "android.intent.category.BROWSABLE"
        ),


        HTTPS:
        content.includes(
            'android:scheme="https"'
        )

    };


    return checks;

}


module.exports = validateDeepLink;