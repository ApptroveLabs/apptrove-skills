const fs = require("fs-extra");
const path = require("path");


function findAndroidRoot(startPath = process.cwd()) {

    let current = startPath;


    while (current !== path.parse(current).root) {


        const settingsGradle =
            fs.existsSync(
                path.join(current, "settings.gradle")
            )
            ||
            fs.existsSync(
                path.join(current, "settings.gradle.kts")
            );


        const appFolder =
            fs.existsSync(
                path.join(current, "app")
            );


        if (settingsGradle && appFolder) {
            return current;
        }


        current = path.dirname(current);
    }


    return null;
}


module.exports = findAndroidRoot;