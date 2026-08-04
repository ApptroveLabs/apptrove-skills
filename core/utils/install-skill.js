const fs = require("fs-extra");
const path = require("path");


function installSkill(agent, platform) {

    const source = path.join(
        __dirname,
        "../../skills",
        platform,
        "SKILL.md"
    );


    let destination;


    switch(agent) {

        case "claude-code":

            destination = path.join(
                process.cwd(),
                ".claude",
                "skills",
                "apptrove",
                platform,
                "SKILL.md"
            );

            break;


        case "cursor":

            destination = path.join(
                process.cwd(),
                ".cursor",
                "rules",
                `apptrove-${platform}.md`
            );

            break;


        case "copilot":

            destination = path.join(
                process.cwd(),
                ".github",
                "copilot-instructions.md"
            );

            break;


        default:

            destination = path.join(
                process.cwd(),
                "AGENTS.md"
            );
    }


    fs.ensureDirSync(
        path.dirname(destination)
    );


    fs.copyFileSync(
        source,
        destination
    );


    return destination;

}


module.exports = installSkill;