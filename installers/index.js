const installAndroid = require("./android");


function install(context) {

    switch (context.platform) {

        case "android":
            return installAndroid(context);

        default:
            throw new Error(
                `Unsupported platform: ${context.platform}`
            );
    }

}


module.exports = install;