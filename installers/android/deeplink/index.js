const fs = require("fs-extra");

const modifyManifest =
require("./manifest-modifier");


const validate =
require("./validator");



function installDeepLink(projectPath){


    const manifestPaths = [

        "app/src/main/AndroidManifest.xml",

        "app/AndroidManifest.xml"

    ];



    let manifest = null;


    for(const path of manifestPaths){


        const fullPath =
            `${projectPath}/${path}`;


        if(fs.existsSync(fullPath)){

            manifest = fullPath;
            break;

        }

    }



    if(!manifest){

        return {

            changed:false,

            message:"Manifest not found"

        };

    }



    const result =
        modifyManifest(
            manifest
        );


    const validation =
        validate(
            manifest
        );


    return {

        ...result,

        validation

    };

}



module.exports = installDeepLink;