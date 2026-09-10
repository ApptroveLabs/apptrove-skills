const fs = require("fs-extra");
const constants = require("../../core/constants");

const SDK_KEY = constants.placeholderSdkKey;
const ENV = constants.defaultEnv;

/**
 * Inject AppTroveSDK.initialize(config) into an Application class file.
 * @param {string} file
 * @param {{ sdkKey?: string, env?: string, sdkSecretId?: string, sdkSecretKey?: string }} [options]
 */
function injectApptrove(file, options = {}) {
  const sdkKey = options.sdkKey || SDK_KEY;
  const env = options.env || ENV;

  let content = fs.readFileSync(file, "utf8");

  if (content.includes("AppTroveSDK.initialize")) {
    return {
      changed: false,
      message: "AppTrove SDK initialization already exists"
    };
  }

  if (file.endsWith(".kt")) {
    content = injectKotlin(
      content,
      sdkKey,
      env,
      getSigningCode(options.sdkSecretId, options.sdkSecretKey, false)
    );
  } else if (file.endsWith(".java")) {
    content = injectJava(
      content,
      sdkKey,
      env,
      getSigningCode(options.sdkSecretId, options.sdkSecretKey, true)
    );
  } else {
    return {
      changed: false,
      message: "Unsupported Application file type"
    };
  }

  fs.writeFileSync(file, content);

  if (content.includes("AppTroveSDK.initialize")) {
    return {
      changed: true,
      message: "AppTrove SDK initialization added"
    };
  }

  return {
    changed: false,
    message: "Failed to inject AppTrove SDK initialization"
  };
}

function getSigningCode(secretId, secretKey, java) {
  const suffix = java ? ";" : "";

  if (secretId && secretKey) {
    return `        sdkConfig.setAppSecret("${secretId}", "${secretKey}")${suffix}\n`;
  }

  return `        // sdkConfig.setAppSecret("YOUR_SECRET_ID", "YOUR_SECRET_KEY")${suffix}\n`;
}

function injectKotlin(content, sdkKey, env, signing) {
  const sdkCode = `
        val sdkConfig = AppTroveSDKConfig(this, "${sdkKey}", "${env}")
${signing}
        AppTroveSDK.initialize(sdkConfig)
`;

  if (/override\s+fun\s+onCreate\s*\([^)]*\)\s*\{/.test(content)) {
    content = content.replace(
      /(override\s+fun\s+onCreate\s*\([^)]*\)\s*\{)/,
      `$1\n${sdkCode}`
    );
  } else {
    // Insert onCreate before closing brace of class
    content = content.replace(
      /\}\s*$/,
      `
    override fun onCreate() {
        super.onCreate()
${sdkCode}
    }
}
`
    );
  }

  if (!content.includes("import com.apptrove.sdk.AppTroveSDK")) {
    content = content.replace(
      /^package\s+(.+)$/m,
      `package $1\n\nimport com.apptrove.sdk.AppTroveSDK\nimport com.apptrove.sdk.AppTroveSDKConfig`
    );
  }

  return content;
}

function injectJava(content, sdkKey, env, signing) {
  const sdkCode = `
        AppTroveSDKConfig sdkConfig = new AppTroveSDKConfig(this, "${sdkKey}", "${env}");
${signing}
        AppTroveSDK.initialize(sdkConfig);
`;

  if (/@Override[\s\n]*public\s+void\s+onCreate\s*\(\s*\)\s*\{/.test(content)) {
    content = content.replace(
      /(@Override[\s\n]*public\s+void\s+onCreate\s*\(\s*\)\s*\{)/,
      `$1\n${sdkCode}`
    );
  } else {
    content = content.replace(
      /\}\s*$/,
      `
    @Override
    public void onCreate() {
        super.onCreate();
${sdkCode}
    }
}
`
    );
  }

  if (!content.includes("import com.apptrove.sdk.AppTroveSDK;")) {
    content = content.replace(
      /^package\s+([^;]+);/m,
      `package $1;\n\nimport com.apptrove.sdk.AppTroveSDK;\nimport com.apptrove.sdk.AppTroveSDKConfig;`
    );
  }

  return content;
}

module.exports = injectApptrove;
