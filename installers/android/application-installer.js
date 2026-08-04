const fs = require("fs-extra");
const path = require("path");

function configureApplication(projectPath) {

    const appDir = path.join(
        projectPath,
        "app",
        "src",
        "main"
    );

    if (!fs.existsSync(appDir)) {

        return {
            changed: false,
            message: "app/src/main not found"
        };

    }

    return {
        changed: false,
        message: "Application installer not implemented yet"
    };

}

module.exports = configureApplication;