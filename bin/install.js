#!/usr/bin/env node

const { Command } = require("commander");
const detectAgent = require("../shared/utils/detect-agent");


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
        `\nInstalling ${platform} skill...\n`
    );


    const agents = detectAgent();


    if(agents.length === 0){

        console.log(
            "No AI coding agent detected."
        );

        console.log(
            "Installing generic AGENTS.md format."
        );

    }
    else{

        console.log(
            "Detected agents:"
        );


        agents.forEach(agent=>{

            console.log(
                `✓ ${agent}`
            );

        });

    }


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