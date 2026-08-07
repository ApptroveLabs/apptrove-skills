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
const ok =
  content.includes("android.intent.action.VIEW") &&
  content.includes("android.intent.category.BROWSABLE") &&
  content.includes('android:scheme="https"');

if (!ok) {
  console.error("FAIL: deep link intent-filter incomplete");
  process.exit(1);
}

console.log("PASS: Deep link intent-filter present");
