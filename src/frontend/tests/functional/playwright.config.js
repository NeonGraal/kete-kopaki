const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  globalSetup: require.resolve("./global-setup.js"),
  reporter: [["list"], ["html", { outputFolder: "../../artifacts/playwright-report" }], ["junit", { outputFile: "../../artifacts/junit.xml" }]],
  testDir: "./specs",
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:19006",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  }
});
