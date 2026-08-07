const logger = require("../../core/utils/logger");

/**
 * Print a formatted integration report for any platform InstallResult.
 * @param {import('../../core/context/install-result')} result
 * @param {object} [context]
 */
function printReport(result, context = {}) {
  logger.section(`AppTrove ${result.platform} Integration Report`);

  const steps = result.steps || {};
  for (const [name, step] of Object.entries(steps)) {
    const msg = step && step.message ? step.message : JSON.stringify(step);
    const mark = step && step.changed === false && step.found === false ? "⚠️ " : "✅ ";
    console.log(`${mark}${name}: ${msg}`);
  }

  if (context.hint) {
    logger.warning(context.hint);
  }

  if (context.nextSteps && context.nextSteps.length) {
    console.log("\nNext steps:");
    context.nextSteps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  }

  console.log("=================================\n");
}

module.exports = printReport;
