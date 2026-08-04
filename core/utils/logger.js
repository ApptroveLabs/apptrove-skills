class Logger {

    info(message) {

        console.log(message);

    }

    success(message) {

        console.log(`✅ ${message}`);

    }

    warning(message) {

        console.log(`⚠️  ${message}`);

    }

    error(message) {

        console.log(`❌ ${message}`);

    }

    section(title) {

        console.log("");
        console.log("=================================");
        console.log(title);
        console.log("=================================");

    }

}

module.exports = new Logger();