const fs = require("fs-extra");
const path = require("path");
const constants = require("../../core/constants");
const InstallResult = require("../../core/context/install-result");

/**
 * MAUI installer — adds AppTroveSDK.Maui PackageReference to .csproj when found.
 */
function install(context) {
  console.log("\nInstalling .NET MAUI AppTrove SDK...\n");
  const result = new InstallResult("maui");

  const csproj = findCsproj(context.projectRoot);
  if (!csproj) {
    result.add("project", {
      changed: false,
      message: "No .csproj found — run: dotnet add package AppTroveSDK.Maui --version 2.1.0"
    });
    result.nextSteps = getNextSteps();
    return result;
  }

  let content = fs.readFileSync(csproj, "utf8");
  if (content.includes("AppTroveSDK.Maui")) {
    result.add("nuget", {
      changed: false,
      message: "AppTroveSDK.Maui already referenced"
    });
  } else {
    const packageRef = `    <PackageReference Include="${constants.maui.nuget}" Version="${constants.maui.version}" />\n`;
    if (/<\/ItemGroup>/.test(content)) {
      content = content.replace(
        /<\/ItemGroup>/,
        `${packageRef}  </ItemGroup>`
      );
    } else if (/<\/Project>/.test(content)) {
      content = content.replace(
        /<\/Project>/,
        `  <ItemGroup>\n${packageRef}  </ItemGroup>\n</Project>`
      );
    }
    fs.writeFileSync(csproj, content);
    result.add("nuget", {
      changed: true,
      message: `Added ${constants.maui.nuget} ${constants.maui.version} to ${path.basename(csproj)}`
    });
  }

  result.nextSteps = getNextSteps();
  return result;
}

function findCsproj(root) {
  if (!fs.existsSync(root)) return null;
  const entries = fs.readdirSync(root);
  const direct = entries.find((f) => f.endsWith(".csproj"));
  if (direct) return path.join(root, direct);
  return null;
}

function getNextSteps() {
  return [
    "Or run: dotnet add package AppTroveSDK.Maui --version 2.1.0",
    "using AppTroveSDK.Maui; then AppTroveSDK.Initialize(new AppTroveSDKConfig(token, env))",
    "Call WaitForATTUserAuthorization before Initialize on iOS",
    "Call SubscribeAttributionLink after Initialize on iOS for deferred links",
    "Add Android permissions + NSUserTrackingUsageDescription on iOS"
  ];
}

module.exports = install;
