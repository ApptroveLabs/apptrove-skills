const fs = require("fs-extra");
const path = require("path");

/**
 * Detect which AI coding agents are configured in a project.
 * @param {string} projectPath
 * @returns {string[]}
 */
function detectAgent(projectPath = process.cwd()) {
  const agents = [];

  if (fs.existsSync(path.join(projectPath, ".claude"))) {
    agents.push("claude-code");
  }

  if (fs.existsSync(path.join(projectPath, ".cursor"))) {
    agents.push("cursor");
  }

  if (fs.existsSync(path.join(projectPath, ".windsurf"))) {
    agents.push("windsurf");
  }

  if (
    fs.existsSync(
      path.join(projectPath, ".github", "copilot-instructions.md")
    )
  ) {
    agents.push("copilot");
  }

  if (fs.existsSync(path.join(projectPath, "AGENTS.md"))) {
    agents.push("agents-md");
  }

  return agents;
}

module.exports = detectAgent;
