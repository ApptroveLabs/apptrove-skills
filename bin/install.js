#!/usr/bin/env node

const { Command } = require("commander");
const detectAgent = require("../shared/utils/detect-agent");
const installSkill = require("../shared/utils/install-skill");
const analyzeAndroidProject = require("../shared/utils/android-analyzer");
const addApptroveDependency = require("../shared/modifiers/gradle-modifier");
const androidInstaller = require("../installers/android");
const reportPrinter = require("../installers/android/report");
const logger = require("../core/utils/logger");


const program = new Command();


program
    .name("apptrove-skills")
    .description("Apptrove AI Skills Installer")
    .version("1.0.0");


program
    .command("add")
    .argument("<platform>")
    .action((platform) => {


        logger.info(
            `Installing ${platform} skill...\n`
        );


        const agents = detectAgent();


        if (agents.length === 0) {

            logger.error("No supported AI agent detected.");
            return;
        }


        const agent = agents[0];


        logger.success(
            `Detected: ${agent}`
        );


        const installedPath = installSkill(
            agent,
            platform
        );


        logger.info(
            "\nInstalled:"
        );


        logger.info(
            installedPath
        );

        if(platform==="android"){

            const report = androidInstaller(process.cwd());
            reportPrinter(report);

        }


        // if (platform === "android") {

        //     console.log(
        //         "\nAnalyzing Android project..."
        //     );


        //     const analysis = analyzeAndroidProject();

        //     console.log(analysis);

        //     if(analysis.androidProject){

        //         console.log(
        //             "\nAdding Apptrove SDK dependency..."
        //         );


        //         const result =
        //             addApptroveDependency(
        //                 process.cwd()
        //             );


        //         console.log(result);

        //     }
        // }

    });   // <-- Missing closing here

program.parse();