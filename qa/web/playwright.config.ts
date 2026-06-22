import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";
import { getAppEnv, resetAppEnvCache } from "./src/config/env";

// .env e artefatos vivem na raiz do pacote qa/ (um nível acima de web/).
const repoRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.resolve(repoRoot, ".env") });
dotenv.config({ path: path.resolve(repoRoot, ".env.local"), override: true });

resetAppEnvCache();
const env = getAppEnv();

export default defineConfig({
  testDir: "./specs",
  testMatch: ["**/*.spec.ts"],
  testIgnore: ["**/example.spec.ts", "**/exemplo.spec.ts"],
  fullyParallel: true,
  retries: Number.parseInt(process.env.PW_RETRIES ?? "0", 10),
  workers: env.workers,
  timeout: env.timeouts.test,
  expect: { timeout: env.timeouts.expect },
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(repoRoot, "playwright-report"), open: "never" }],
    ["./src/reporters/failure-summary-reporter.ts"],
  ],
  outputDir: path.join(repoRoot, "test-results"),
  use: {
    baseURL: env.urls.base,
    headless: env.headless,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    testIdAttribute: "data-cy",
    storageState: process.env.PW_STORAGE_STATE || undefined,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Exemplo de setup com dependência (descomente e adapte ao seu projeto):
    // { name: "setup:exemplo", testMatch: "testes/**/*.setup.ts" },
    // { name: "exemplo", dependencies: ["setup:exemplo"], use: { ...devices["Desktop Chrome"] } },
  ],
});
