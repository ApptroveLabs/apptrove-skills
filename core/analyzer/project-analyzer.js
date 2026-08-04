const analyzeAndroid =
require("./android-analyzer");

function analyze(projectPath){

    const android =
        analyzeAndroid(projectPath);

    if(android.androidProject){

        return android;

    }

    return null;

}

module.exports = analyze;