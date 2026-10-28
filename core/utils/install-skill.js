const fs = require("fs-extra");
const path = require("path");

/**
 * Install a platform skill into the detected AI agent destination.
 * @param {string} agent
 * @param {string} platform
 * @param {string} [projectPath]
 * @returns {string} destination path
 */
function installSkill(agent, platform, projectPath = process.cwd()) {
  const source = path.resolve(__dirname, "../../skills", platform);

  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    throw new Error(`Skill not found for platform: ${platform}`);
  }

  const sourceSkillFile = path.join(source, "SKILL.md");

  if (!fs.existsSync(sourceSkillFile)) {
    throw new Error(`SKILL.md not found for platform: ${platform}`);
  }

  const root = path.resolve(projectPath);
  let destination;

  switch (agent) {
    case "claude-code": {
      destination = path.join(
        root,
        ".claude",
        "skills",
        "apptrove",
        platform
      );

      fs.ensureDirSync(path.dirname(destination));

      // Copy the complete skill directory, excluding unnecessary files.
      fs.copySync(source, destination, {
        overwrite: true,
        errorOnExist: false,
        filter: (src) => {
          // `src` is under node_modules when this code runs from an npx
          // installation. Check only the path relative to the skill root so
          // that the package's own parent `node_modules` directory does not
          // cause every skill file to be filtered out.
          const relativePath = path.relative(source, src);
          const parts = relativePath.split(path.sep);

          return (
            !parts.includes("node_modules") &&
            path.basename(src) !== ".DS_Store"
          );
        },
      });

      // Verify that the main skill file was copied.
      const installedSkillFile = path.join(
        destination,
        "SKILL.md"
      );

      if (!fs.existsSync(installedSkillFile)) {
        throw new Error(
          `Installation failed: SKILL.md was not copied to ${destination}`
        );
      }

      // Verify supporting directories when present in the source.
      for (const directory of [
        "references",
        "templates",
        "validators",
      ]) {
        const sourceDirectory = path.join(source, directory);
        const installedDirectory = path.join(
          destination,
          directory
        );

        if (
          fs.existsSync(sourceDirectory) &&
          !fs.existsSync(installedDirectory)
        ) {
          throw new Error(
            `Installation incomplete: ${directory} missing from ${destination}`
          );
        }
      }

      return destination;
    }

    case "cursor":
      destination = path.join(
        root,
        ".cursor",
        "rules",
        `apptrove-${platform}.mdc`
      );
      break;

    case "copilot":
      destination = path.join(
        root,
        ".github",
        "copilot-instructions.md"
      );
      break;

    case "windsurf":
      destination = path.join(
        root,
        ".windsurf",
        "rules",
        `apptrove-${platform}.md`
      );
      break;

    case "agents-md":
      destination = path.join(root, "AGENTS.md");
      break;

    default:
      throw new Error(`Unsupported agent: ${agent}`);
  }

  fs.ensureDirSync(path.dirname(destination));

  // Avoid duplicating AppTrove instructions in shared instruction files.
  if (
    (agent === "copilot" || agent === "agents-md") &&
    fs.existsSync(destination)
  ) {
    const existing = fs.readFileSync(destination, "utf8");
    const marker = `<!-- apptrove-sdk-skills:${platform} -->`;

    if (existing.includes(marker)) {
      return destination;
    }

    const skill = fs.readFileSync(sourceSkillFile, "utf8");

    fs.writeFileSync(
      destination,
      `${existing.trimEnd()}\n\n${marker}\n${skill}\n`
    );

    return destination;
  }

  // Cursor and Windsurf receive the main skill instructions.
  const skill = fs.readFileSync(sourceSkillFile, "utf8");

  fs.writeFileSync(
    destination,
    agent === "cursor"
      ? `---\ndescription: AppTrove ${platform} SDK integration instructions\nalwaysApply: false\n---\n\n${skill}\n`
      : skill
  );

  return destination;
}

/**
 * Install a platform skill into multiple detected agents.
 * @param {string[]} agents
 * @param {string} platform
 * @param {string} [projectPath]
 * @returns {{ agent: string, path: string }[]}
 */
function installSkillToAgents(
  agents,
  platform,
  projectPath = process.cwd()
) {
  return agents.map((agent) => ({
    agent,
    path: installSkill(agent, platform, projectPath),
  }));
}

module.exports = installSkill;
module.exports.installSkillToAgents = installSkillToAgents;
