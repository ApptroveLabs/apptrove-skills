const fs = require("fs-extra");
const path = require("path");


function analyzeAndroidProject() {

    const root = process.cwd();

    const filesToCheck = [
        "settings.gradle",
        "settings.gradle.kts",
        "build.gradle",
        "build.gradle.kts",
        "app/build.gradle",
        "app/build.gradle.kts",
        "app/src/main/AndroidManifest.xml"
    ];


    const report = {
        projectPath: root,
        androidProject: false,
        files: {}
    };


    filesToCheck.forEach(file => {

        const exists = fs.existsSync(
            path.join(root, file)
        );

        report.files[file] = exists;

    });


    if (
        report.files["app/build.gradle"] ||
        report.files["app/build.gradle.kts"]
    ) {
        report.androidProject = true;
    }


    return report;
}


module.exports = analyzeAndroidProject;