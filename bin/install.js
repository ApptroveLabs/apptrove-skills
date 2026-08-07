#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");

const detectAgent = require("../core/utils/detect-agent");
const installSkill = require("../core/utils/install-skill");
const { installSkillToAgents } = require("../core/utils/install-skill");
const analyzeProject = require("../core/analyzer/project-analyzer");
const ProjectContext = require("../core/context/project-context");
const install = require("../installers");
const printReport = require("../installers/android/report");
const logger = require("../core/utils/logger");
const constants = require("../core/constants");

const program = new Command();

program
  .name("apptrove-skills")
  .description(
    "Install AppTrove AI skills into your coding agent and integrate the AppTrove SDK"
  )
  .version("1.0.0");

program
  .command("add")
  .argument(
    "<platform>",
    `Platform: ${constants.platforms.join(" | ")}`
  )
  .option("--sdk-key <token>", "AppTrove app token / SDK key", constants.placeholderSdkKey)
  .option("--env <env>", "SDK environment", constants.defaultEnv)
  .option("--deep-link-host <host>", "Android deep link host", "YOUR_SUBDOMAIN.u9ilnk.me")
  .option("--all-agents", "Install skill into every detected agent", false)
  .option("--skill-only", "Only install AI skill, skip SDK file changes", false)
  .option("--cwd <path>", "Project directory", process.cwd())
  .action((platform, opts) => {
    const projectRoot = path.resolve(opts.cwd);
    const normalized = platform.toLowerCase();

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

    const agents = detectAgent(projectRoot);
    if (agents.length === 0) {
      logger.warning(
        "No AI agent config detected (.claude / .cursor / .windsurf / AGENTS.md)."
      );
      logger.info("Creating AGENTS.md with AppTrove skill instructions.\n");
      agents.push("agents-md");
    }

    const targets = opts.allAgents ? agents : [agents[0]];
    const installed = installSkillToAgents(targets, normalized, projectRoot);
    installed.forEach((item) => {
      logger.success(`Skill installed for ${item.agent}:\n   ${item.path}`);
    });

    if (opts.skillOnly) {
      logger.success("Skill-only mode — skipped SDK integration.");
      return;
    }

    const analysis = analyzeProject(projectRoot, normalized);
    if (!analysis) {
      logger.error("Could not analyze project.");
      process.exitCode = 1;
      return;
    }

    const context = new ProjectContext(analysis);
    const result = install(context, {
      sdkKey: opts.sdkKey,
      env: opts.env,
      deepLinkHost: opts.deepLinkHost
    });

    printReport(result, {
      hint: context.hint,
      nextSteps: result.nextSteps
    });
  });

program
  .command("list")
  .description("List supported platforms and SDK package versions")
  .action(() => {
    logger.section("Supported platforms");
    console.log(`Android       ${constants.android.dependency}`);
    console.log(`iOS (CocoaPods) pod '${constants.ios.pod}' ~> ${constants.ios.podVersion}`);
    console.log(`iOS (SPM)     ${constants.ios.spmProduct} @ ${constants.ios.spmVersion}`);
    console.log(`Flutter       ${constants.flutter.pubName}: ${constants.flutter.pubConstraint}`);
    console.log(`React Native  ${constants.reactNative.npmName}@${constants.reactNative.version}`);
    console.log(`Expo          ${constants.expo.npmName}@${constants.expo.version}`);
    console.log(`Cordova       ${constants.cordova.installCommand}`);
    console.log(`MAUI          ${constants.maui.nuget}@${constants.maui.version}`);
    console.log(
      `Unity         Trackier ${constants.unity.version} (.unitypackage) — no Apptrove v2 yet`
    );
    console.log("");
    console.log(
      `Note: Trackier v1.x is deprecated ${constants.legacyDeprecated} on other platforms. Unity remains Trackier-only.`
    );
    console.log("");
  });

program
  .command("detect")
  .description("Detect AI agents and project platform in the current directory")
  .option("--cwd <path>", "Project directory", process.cwd())
  .action((opts) => {
    const projectRoot = path.resolve(opts.cwd);
    const agents = detectAgent(projectRoot);
    const analysis = analyzeProject(projectRoot);

    logger.section("Detection");
    console.log("Agents  :", agents.length ? agents.join(", ") : "(none)");
    console.log(
      "Project :",
      analysis ? `${analysis.platform} @ ${analysis.projectRoot}` : "(none)"
    );
    console.log("");
  });

program.parse(process.argv);
