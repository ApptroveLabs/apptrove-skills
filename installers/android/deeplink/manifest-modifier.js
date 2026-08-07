const fs = require("fs-extra");

/**
 * Ensure required permissions and add a sample AppTrove deep-link intent-filter
 * if no VIEW/BROWSABLE filter exists yet.
 */
function addDeepLink(manifestPath, options = {}) {
  const host = options.host || "YOUR_SUBDOMAIN.u9ilnk.me";
  let content = fs.readFileSync(manifestPath, "utf8");
  const changes = [];
  const active = content.replace(/<!--[\s\S]*?-->/g, "");

  const requiredPermissions = [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.ACCESS_WIFI_STATE",
    "com.google.android.gms.permission.AD_ID"
  ];

  for (const perm of requiredPermissions) {
    if (!content.includes(perm)) {
      content = content.replace(
        /<manifest([^>]*)>/,
        `<manifest$1>\n\n    <uses-permission android:name="${perm}" />`
      );
      changes.push(`permission:${perm}`);
    }
  }

  const hasViewBrowsable =
    active.includes("android.intent.action.VIEW") &&
    active.includes("android.intent.category.BROWSABLE");

  if (hasViewBrowsable) {
    fs.writeFileSync(manifestPath, content);
    return {
      changed: changes.length > 0,
      message:
        changes.length > 0
          ? `Permissions added (${changes.length}). Deep link intent-filter already present.`
          : "Deep link already configured",
      validation: validate(content)
    };
  }

  const deepLinkConfig = `
            <!-- AppTrove deep link — replace host with your UniLink domain -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="${host}" />
            </intent-filter>
`;

  if (content.includes("</activity>")) {
    content = content.replace("</activity>", `${deepLinkConfig}\n        </activity>`);
    changes.push("intent-filter");
  } else {
    return {
      changed: changes.length > 0,
      message: "No <activity> found to attach deep link intent-filter",
      validation: validate(content)
    };
  }

  fs.writeFileSync(manifestPath, content);

  return {
    changed: true,
    message: "AppTrove deep link intent-filter and permissions configured",
    validation: validate(content)
  };
}

function validate(content) {
  return {
    VIEW: content.includes("android.intent.action.VIEW"),
    BROWSABLE: content.includes("android.intent.category.BROWSABLE"),
    HTTPS: content.includes('android:scheme="https"'),
    AD_ID: content.includes("com.google.android.gms.permission.AD_ID"),
    INTERNET: content.includes("android.permission.INTERNET")
  };
}

module.exports = addDeepLink;
