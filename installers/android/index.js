const installDeepLink = require("./deeplink");
const analyzeAndroidProject = require("../../core/analyzer/android-analyzer");
const addDependency = require("../../core/modifier/gradle-modifier");
const scanApplication = require("../../core/analyzer/application-scanner");
const configureApplication = require("./application-installer");
const configureManifest = require("./manifest-installer");
const injectApptrove = require("./application-modifier");
const addApptroveDependency = require("../../core/modifier/gradle-modifier");
const InstallResult = require("../../core/context/install-result");



function install(context){


    console.log("\nInstalling Android SDK...\n");


    const dependency =
        addApptroveDependency(context);


    const application =
        scanApplication(context);



    const result =
    new InstallResult(
        "android"
    );


    result.add(
        "dependency",
        dependency
    );


    result.add(
        "application",
        application
    );


    return result;

}


module.exports = install;