import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./src/tests",
  globalSetup: "./src/tests/global.setup.ts",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  reporter: [["list"], ["allure-playwright", { detail: true }]],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  grep: /@smoke/,
});
