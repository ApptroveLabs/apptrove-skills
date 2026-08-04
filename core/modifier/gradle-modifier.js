const fs = require("fs-extra");
const path = require("path");


function addApptroveDependency(projectPath) {


    const gradleFile = path.join(
        projectPath,
        "app",
        "build.gradle"
    );


    if (!fs.existsSync(gradleFile)) {

        throw new Error(
            "app/build.gradle not found"
        );

    }


    let content = fs.readFileSync(
        gradleFile,
        "utf8"
    );


    const dependency =
        'implementation("com.apptrove:apptrove-sdk:1.0.0")';


    // Avoid duplicate dependency

    if (content.includes("com.apptrove:apptrove-sdk")) {

        return {
            changed: false,
            message: "Apptrove SDK already exists"
        };

    }


    const dependenciesIndex =
        content.indexOf("dependencies {");


    if (dependenciesIndex === -1) {

        throw new Error(
            "dependencies block not found"
        );

    }


    const insertPosition =
        dependenciesIndex +
        "dependencies {".length;


    content =
        content.slice(0, insertPosition)
        +
        "\n\n    // Apptrove SDK\n    "
        +
        dependency
        +
        "\n"
        +
        content.slice(insertPosition);


    fs.writeFileSync(
        gradleFile,
        content
    );


    return {
        changed: true,
        message: "Apptrove SDK dependency added"
    };

}


module.exports = addApptroveDependency;