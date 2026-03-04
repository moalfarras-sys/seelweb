import { defineConfig } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: process.env.E2E_BASE_URL || "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
