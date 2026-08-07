#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const groovy = path.join(root, "app/build.gradle");
const kts = path.join(root, "app/build.gradle.kts");

const file = fs.existsSync(kts) ? kts : fs.existsSync(groovy) ? groovy : null;

if (!file) {
  console.error("FAIL: app/build.gradle(.kts) not found");
  process.exit(1);
}

const content = fs.readFileSync(file, "utf8");
const hasSdk = content.includes("com.apptrove:android-sdk");
const hasReferrer = content.includes("com.android.installreferrer");
const hasAds = content.includes("play-services-ads-identifier");

if (!hasSdk) {
  console.error("FAIL: missing com.apptrove:android-sdk");
  process.exit(1);
}

console.log("PASS: AppTrove Android Gradle dependency present");
if (!hasReferrer) console.warn("WARN: installreferrer missing");
if (!hasAds) console.warn("WARN: play-services-ads-identifier missing");
