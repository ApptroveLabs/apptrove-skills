const path = require("path");
const fs = require("fs");


function scanApplication(context){


    const projectPath =
        context.projectRoot;


    const manifestPath =
        path.join(
            projectPath,
            "app/src/main/AndroidManifest.xml"
        );


    if(!fs.existsSync(manifestPath)){

        return {
            found:false,
            message:"Manifest not found"
        };

    }


    return {
        found:true,
        path:manifestPath,
        message:`Manifest found: ${manifestPath}`
    };

}


module.exports = scanApplication;