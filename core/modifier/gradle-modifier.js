const fs = require("fs-extra");
const path = require("path");


function addApptroveDependency(context){


    const projectPath =
        context.projectRoot;


    const gradleFile =
        path.join(
            projectPath,
            "app/build.gradle"
        );


    if(!fs.existsSync(gradleFile)){

        return {
            changed:false,
            message:"app/build.gradle not found"
        };

    }


    let content =
        fs.readFileSync(
            gradleFile,
            "utf8"
        );


    if(content.includes("com.apptrove")){

        return {
            changed:false,
            message:"Apptrove SDK dependency already exists"
        };

    }


    content =
        content.replace(
            /dependencies\s*\{/,
`
dependencies {

    implementation "com.apptrove:sdk:latest"
`
        );


    fs.writeFileSync(
        gradleFile,
        content
    );


    return {
        changed:true,
        message:"Apptrove SDK dependency added"
    };

}


module.exports = addApptroveDependency;