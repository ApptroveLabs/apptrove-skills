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
  const source = path.join(
    __dirname,
    "../../skills",
    platform,
    "SKILL.md"
  );

  if (!fs.existsSync(source)) {
    throw new Error(`Skill not found for platform: ${platform}`);
  }

  let destination;

  switch (agent) {
    case "claude-code":
      destination = path.join(
        projectPath,
        ".claude",
        "skills",
        "apptrove",
        platform,
        "SKILL.md"
      );
      break;

    case "cursor":
      destination = path.join(
        projectPath,
        ".cursor",
        "rules",
        `apptrove-${platform}.mdc`
      );
      break;

    case "copilot":
      destination = path.join(
        projectPath,
        ".github",
        "copilot-instructions.md"
      );
      break;

    case "windsurf":
      destination = path.join(
        projectPath,
        ".windsurf",
        "rules",
        `apptrove-${platform}.md`
      );
      break;

    default:
      destination = path.join(projectPath, "AGENTS.md");
  }

  fs.ensureDirSync(path.dirname(destination));

  // For shared destinations, append if Apptrove section missing
  if (
    (agent === "copilot" || agent === "agents-md") &&
    fs.existsSync(destination)
  ) {
    const existing = fs.readFileSync(destination, "utf8");
    if (existing.includes("Apptrove") || existing.includes("AppTrove")) {
      return destination;
    }
    const skill = fs.readFileSync(source, "utf8");
    fs.writeFileSync(
      destination,
      `${existing.trim()}\n\n---\n\n${skill}\n`
    );
    return destination;
  }

  fs.copyFileSync(source, destination);
  return destination;
}

/**
 * Install skill into every detected agent.
 * @param {string[]} agents
 * @param {string} platform
 * @param {string} [projectPath]
 * @returns {{ agent: string, path: string }[]}
 */
function installSkillToAgents(agents, platform, projectPath = process.cwd()) {
  return agents.map((agent) => ({
    agent,
    path: installSkill(agent, platform, projectPath)
  }));
}

module.exports = installSkill;
module.exports.installSkillToAgents = installSkillToAgents;
