const analyzeAndroid =
require("./android-analyzer");


function analyzeProject(projectRoot) {


    const android =
        analyzeAndroid(projectRoot);


    if(android && android.androidProject){

        return {

            platform:"android",

            projectRoot,

            ...android

        };

    }


    return null;

}


module.exports = analyzeProject;