#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");
const packageJson = require("../package.json");

const { installSkillToAgents } = require("../core/utils/install-skill");
const detectAgent = require("../core/utils/detect-agent");
const analyzeProject = require("../core/analyzer/project-analyzer");
const ProjectContext = require("../core/context/project-context");
const install = require("../installers");
const printReport = require("../installers/android/report");
const logger = require("../core/utils/logger");
const constants = require("../core/constants");

const program = new Command();

/**
 * Return the skill installation destination for each supported agent.
 */
function getSkillDestination(agent, platform, projectRoot) {
  switch (agent) {
    case "claude-code":
      return path.join(
        projectRoot,
        ".claude",
        "skills",
        "apptrove",
        platform
      );

    case "cursor":
      return path.join(
        projectRoot,
        ".cursor",
        "rules",
        `apptrove-${platform}.mdc`
      );

    case "copilot":
      return path.join(
        projectRoot,
        ".github",
        "copilot-instructions.md"
      );

    case "windsurf":
      return path.join(
        projectRoot,
        ".windsurf",
        "rules",
        `apptrove-${platform}.md`
      );

    case "agents-md":
      return path.join(projectRoot, "AGENTS.md");

    default:
      throw new Error(`Unsupported agent: ${agent}`);
  }
}

/**
 * Print the destination without installing files.
 */
function printDryRun(targets, platform, projectRoot) {
  logger.section("AppTrove SDK Skills — Dry Run");

  console.log(`Project : ${projectRoot}`);
  console.log(`Platform: ${platform}`);
  console.log(`Agents  : ${targets.join(", ")}`);
  console.log("");

  logger.info("The following skill destinations would be used:");

  targets.forEach((agent) => {
    console.log(
      `  ${agent} → ${getSkillDestination(agent, platform, projectRoot)}`
    );
  });

  console.log("");
  logger.info("Dry run complete — no files were changed.");
}

program
  .name("apptrove-skills")
  .description(
    "Install AppTrove AI skills into your coding agent and integrate the AppTrove SDK"
  )
  .version(packageJson.version);

/**
 * ADD
 *
 * Default:
 *   npx apptrove-sdk-skills add android
 *
 * Installs the AI skill only.
 *
 * Optional:
 *   npx apptrove-sdk-skills add android --integrate
 *
 * Installs the skill and directly modifies the project
 * using the AppTrove SDK installer.
 */
program
  .command("add")
  .argument(
    "<platform>",
    `Platform: ${constants.platforms.join(" | ")}`
  )
  .option(
    "--sdk-key <token>",
    "AppTrove app token / SDK key",
    constants.placeholderSdkKey
  )
  .option("--sdk-secret-id <id>", "Optional SDK signing secret ID")
  .option("--sdk-secret-key <key>", "Optional SDK signing secret key")
  .option("--env <env>", "SDK environment", constants.defaultEnv)
  .option(
    "--deep-link-host <host>",
    "Android deep link host",
    "YOUR_SUBDOMAIN.u9ilnk.me"
  )
  .option(
    "--all-agents",
    "Install skill into every detected agent",
    false
  )
  .option(
    "--integrate",
    "Also modify the project to integrate the AppTrove SDK",
    false
  )
  .option(
    "--dry-run",
    "Show what would be installed without changing files",
    false
  )
  .option("--cwd <path>", "Project directory", process.cwd())
  .action((platform, opts) => {
    const projectRoot = path.resolve(opts.cwd);
    const normalized = platform.toLowerCase();

    // Validate platform.
    if (!constants.platforms.includes(normalized)) {
      logger.error(
        `Unknown platform "${platform}". Supported: ${constants.platforms.join(", ")}`
      );
      process.exitCode = 1;
      return;
    }

    logger.info(
      normalized === "unity"
        ? `Installing Trackier ${normalized} skill (Unity has Trackier SDK only)...\n`
        : `Installing AppTrove ${normalized} skill...\n`
    );

    // Detect AI agents.
    const agents = detectAgent(projectRoot);

    if (agents.length === 0) {
      logger.warning(
        "No AI agent config detected (.claude / .cursor / .windsurf / AGENTS.md)."
      );

      logger.info(
        "Creating AGENTS.md with AppTrove skill instructions.\n"
      );

      agents.push("agents-md");
    }

    const targets = opts.allAgents ? agents : [agents[0]];

    // Dry run: do not modify any files.
    if (opts.dryRun) {
      printDryRun(targets, normalized, projectRoot);
      return;
    }

    // Install AI skill.
    let installed;

    try {
      installed = installSkillToAgents(
        targets,
        normalized,
        projectRoot
      );
    } catch (error) {
      logger.error(`Skill installation failed: ${error.message}`);
      process.exitCode = 1;
      return;
    }

    installed.forEach((item) => {
      logger.success(
        `Skill installed for ${item.agent}:\n   ${item.path}`
      );
    });

    // Default behavior: install the skill only.
    if (!opts.integrate) {
      console.log("");

      logger.success("AppTrove skill installed successfully.");

      logger.info("SDK integration was skipped.");

      console.log("");

      logger.info(
        "Next step: open your AI coding agent and ask:"
      );

      console.log(
        '  "Integrate AppTrove SDK into this project."'
      );

      return;
    }

    // Optional direct SDK integration.
    logger.info("Starting direct AppTrove SDK integration...");

    const analysis = analyzeProject(projectRoot, normalized);

    if (!analysis) {
      logger.error("Could not analyze project.");
      process.exitCode = 1;
      return;
    }

    const context = new ProjectContext(analysis);

    const result = install(context, {
      sdkKey: opts.sdkKey,
      sdkSecretId: opts.sdkSecretId,
      sdkSecretKey: opts.sdkSecretKey,
      env: opts.env,
      deepLinkHost: opts.deepLinkHost
    });

    printReport(result, {
      hint: context.hint,
      nextSteps: result.nextSteps
    });
  });

/**
 * LIST
 */
program
  .command("list")
  .description("List supported platforms and SDK package versions")
  .action(() => {
    logger.section("Supported platforms");

    console.log(`Android       ${constants.android.dependency}`);

    console.log(
      `iOS (CocoaPods) pod '${constants.ios.pod}' ~> ${constants.ios.podVersion}`
    );

    console.log(
      `iOS (SPM)     ${constants.ios.spmProduct} @ ${constants.ios.spmVersion}`
    );

    console.log(
      `Flutter       ${constants.flutter.pubName}: ${constants.flutter.pubConstraint}`
    );

    console.log(
      `React Native  ${constants.reactNative.npmName}@${constants.reactNative.version}`
    );

    console.log(
      `Expo          ${constants.expo.npmName}@${constants.expo.version}`
    );

    console.log(
      `Cordova       ${constants.cordova.installCommand}`
    );

    console.log(
      `MAUI          ${constants.maui.nuget}@${constants.maui.version}`
    );

    console.log(
      `Unity         Trackier ${constants.unity.version} (.unitypackage) — no AppTrove v2 yet`
    );

    console.log("");

    console.log(
      `Note: Trackier v1.x is deprecated ${constants.legacyDeprecated} on other platforms. Unity remains Trackier-only.`
    );

    console.log("");
  });

/**
 * DETECT
 */
program
  .command("detect")
  .description(
    "Detect AI agents and project platform in the current directory"
  )
  .option(
    "--cwd <path>",
    "Project directory",
    process.cwd()
  )
  .action((opts) => {
    const projectRoot = path.resolve(opts.cwd);

    const agents = detectAgent(projectRoot);
    const analysis = analyzeProject(projectRoot);

    logger.section("Detection");

    console.log(
      "Agents  :",
      agents.length ? agents.join(", ") : "(none)"
    );

    console.log(
      "Project :",
      analysis
        ? `${analysis.platform} @ ${analysis.projectRoot}`
        : "(none)"
    );

    console.log("");
  });

program.parse(process.argv);