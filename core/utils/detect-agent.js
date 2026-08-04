const fs = require("fs-extra");
const path = require("path");


function detectAgent(projectPath = process.cwd()) {

    const agents = [];


    // Claude Code
    if (
        fs.existsSync(
            path.join(projectPath, ".claude")
        )
    ) {
        agents.push("claude-code");
    }


    // Cursor
    if (
        fs.existsSync(
            path.join(projectPath, ".cursor")
        )
    ) {
        agents.push("cursor");
    }


    // Windsurf
    if (
        fs.existsSync(
            path.join(projectPath, ".windsurf")
        )
    ) {
        agents.push("windsurf");
    }


    // GitHub Copilot
    if (
        fs.existsSync(
            path.join(
                projectPath,
                ".github",
                "copilot-instructions.md"
            )
        )
    ) {
        agents.push("copilot");
    }


    // Generic agent instructions
    if (
        fs.existsSync(
            path.join(
                projectPath,
                "AGENTS.md"
            )
        )
    ) {
        agents.push("agents-md");
    }


    return agents;

}


module.exports = detectAgent;