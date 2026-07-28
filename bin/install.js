#!/usr/bin/env node

const { Command } = require("commander");
const detectAgent = require("../shared/utils/detect-agent");
const installSkill = require("../shared/utils/install-skill");


const program = new Command();


program
.name("apptrove-skills")
.description("Apptrove AI Skills Installer")
.version("1.0.0");


program
.command("add")
.argument("<platform>")
.action((platform)=>{


    console.log(
        `Installing ${platform} skill...\n`
    );


    const agents = detectAgent();


    if(agents.length === 0){

        console.log(
            "No agent detected"
        );

        return;

    }


    const agent = agents[0];


    console.log(
        `Detected: ${agent}`
    );


    const installedPath = installSkill(
        agent,
        platform
    );


    console.log(
        "\nInstalled:"
    );


    console.log(
        installedPath
    );


});

program.parse();

// #!/usr/bin/env node

// const { Command } = require("commander");

// const program = new Command();

// program
//   .name("apptrove-skills")
//   .description("Apptrove AI Skills Installer")
//   .version("1.0.0");

// program
//   .command("add")
//   .argument("<platform>", "Platform to install")
//   .action((platform) => {
//     console.log(`Installing ${platform} skill...`);
//   });

// program.parse();