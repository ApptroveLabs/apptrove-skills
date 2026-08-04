function printReport(report){

    console.log("\n==============================");
    logger.section("Apptrove Integration Report");
    console.log("==============================");

    logger.info(`Dependency : ${report.dependency.message}`);
    logger.info(`Application: ${report.application.message}`);
    logger.info(`Manifest   : ${report.manifest.message}`);

    console.log("==============================\n");

    console.log("Validation  :", report.deepLink.validation);
    console.log("Deep Link   :", report.deepLink ?report.deepLink.message : "Not executed");

}

module.exports = printReport;