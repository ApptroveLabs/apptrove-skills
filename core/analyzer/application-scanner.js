const fs = require("fs-extra");
const path = require("path");


function scanApplication(projectPath) {


    const javaPath = path.join(
        projectPath,
        "app",
        "src",
        "main",
        "java"
    );


    const kotlinPath = path.join(
        projectPath,
        "app",
        "src",
        "main",
        "kotlin"
    );


    const locations = [
        javaPath,
        kotlinPath
    ];


    let files = [];


    locations.forEach(location => {

        if(fs.existsSync(location)){

            collectFiles(location, files);

        }

    });


    for(const file of files){

        const content =
            fs.readFileSync(file,"utf8");


        if(
            content.includes(
                "Application"
            )
        ){

            return {
                found:true,
                file:file,
                language:file.endsWith(".kt")
                    ? "kotlin"
                    : "java"
            };

        }

    }


    return {
        found:false
    };

}



function collectFiles(dir, result){

    const entries =
        fs.readdirSync(dir);


    entries.forEach(entry=>{

        const fullPath =
            path.join(dir,entry);


        const stat =
            fs.statSync(fullPath);


        if(stat.isDirectory()){

            collectFiles(
                fullPath,
                result
            );

        }
        else if(
            fullPath.endsWith(".kt") ||
            fullPath.endsWith(".java")
        ){

            result.push(fullPath);

        }

    });

}



module.exports = scanApplication;