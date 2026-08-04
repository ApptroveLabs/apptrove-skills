const installDeepLink = require("./deeplink");
const analyzeAndroidProject = require("../../shared/utils/android-analyzer");
const addDependency = require("../../shared/modifiers/gradle-modifier");
const configureApplication = require("./application-installer");
const configureManifest = require("./manifest-installer");
const scanApplication = require("../../shared/analyzers/application-scanner");
const injectApptrove = require("./application-modifier");



function install(projectPath) {

    const report = {
    dependency: null,
    application: null,
    manifest: null,
    deepLink: null
};

    const analysis = analyzeAndroidProject(projectPath);

    const app = scanApplication(projectPath);

    if(app.found){
        report.application =injectApptrove(app.file);
    }
    else{
        report.application = {hanged:false, message: "No Application class found"};
    }

    if (!analysis.androidProject) {
        throw new Error("Not an Android project");
    }

    report.dependency = addDependency(projectPath);

    //report.application = configureApplication(projectPath);

    report.manifest = configureManifest(projectPath);

    report.deepLink = installDeepLink(projectPath);

    return report;
}

module.exports = install;