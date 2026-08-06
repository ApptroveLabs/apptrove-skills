#!/usr/bin/env node

const { Command } = require("commander");

const detectAgent = require("../core/utils/detect-agent");
const installSkill = require("../core/utils/install-skill");
const analyzeProject = require("../core/analyzer/project-analyzer");
const ProjectContext = require("../core/context/project-context");
const install = require("../installers");
const logger = require("../core/utils/logger");

const program = new Command();

program
    .name("apptrove-skills")
    .description("Apptrove AI Skills Installer")
    .version("1.0.0");

program
    .command("add")
    .argument("<platform>", "Platform to install")
    .action((platform) => {

        logger.info(`Installing ${platform} skill...\n`);

        // Detect AI Agent
        const agents = detectAgent();

        if (agents.length === 0) {
            logger.error("No supported AI agent detected.");
            return;
        }

        const agent = agents[0];

        logger.success(`Detected: ${agent}`);

        // Install AI Skill
        const installedPath = installSkill(agent, platform);

        logger.success(`Skill installed at:\n${installedPath}`);

        // Analyze Project
        const analysis = analyzeProject(process.cwd());

        if (!analysis) {
            logger.error("No supported project found.");
            return;
        }

        // Create Project Context
        const context = new ProjectContext(analysis);

        // Run Platform Installer
        const result = install(context);

        console.log("\nINSTALLATION RESULT");
        console.log(result);

        console.log("PROJECT CONTEXT");
        console.log(context);

    });

program.parse(process.argv);