const fs = require("fs-extra");
const path = require("path");


function configureManifest(projectPath) {


    const possiblePaths = [

        "app/src/main/AndroidManifest.xml",

        "app/AndroidManifest.xml"

    ];


    let manifestPath = null;


    for (const file of possiblePaths) {

        const fullPath = path.join(
            projectPath,
            file
        );


        if (fs.existsSync(fullPath)) {

            manifestPath = fullPath;
            break;

        }

    }


    if (!manifestPath) {

        return {
            changed:false,
            message:"AndroidManifest.xml not found"
        };

    }


    return {
        changed:false,
        message:`Manifest found: ${manifestPath}`
    };

}


module.exports = configureManifest;

// const fs = require("fs-extra");
// const path = require("path");

// function configureManifest(projectPath){

//     const manifest = path.join(
//         projectPath,
//         "app",
//         "src",
//         "main",
//         "AndroidManifest.xml"
//     );

//     if(!fs.existsSync(manifest)){

//         return{
//             changed:false,
//             message:"Manifest not found"
//         };

//     }

//     return{
//         changed:false,
//         message:"Manifest installer not implemented yet"
//     };

// }

// module.exports = configureManifest;