const fs = require("node:fs");
const path = require("node:path");
const { defineConfig } = require("@playwright/test");

const artifactsDir = fs.existsSync("/workspace/artifacts")
  ? "/workspace/artifacts"
  : path.resolve(__dirname, "../../../../artifacts");

module.exports = defineConfig({
  globalSetup: require.resolve("./global-setup.js"),
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(artifactsDir, "playwright-report") }],
    ["junit", { outputFile: path.join(artifactsDir, "junit.xml") }]
  ],
  testDir: "./specs",
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:19006",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  }
});
