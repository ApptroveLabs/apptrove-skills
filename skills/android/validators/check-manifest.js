#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const manifest = path.join(
  process.cwd(),
  "app/src/main/AndroidManifest.xml"
);

if (!fs.existsSync(manifest)) {
  console.error("FAIL: AndroidManifest.xml not found");
  process.exit(1);
}

const content = fs.readFileSync(manifest, "utf8");
const checks = {
  INTERNET: content.includes("android.permission.INTERNET"),
  AD_ID: content.includes("com.google.android.gms.permission.AD_ID"),
  APPLICATION: /android:name\s*=\s*"/.test(content)
};

const failed = Object.entries(checks).filter(([, ok]) => !ok);
if (failed.length) {
  console.error("FAIL:", failed.map(([k]) => k).join(", "));
  process.exit(1);
}

console.log("PASS: Manifest permissions + application name OK");
