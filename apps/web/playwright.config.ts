import { defineConfig, devices } from "@playwright/test";
import { APP_PORT, APP_URL, MOCK_PORT, MOCK_SERVER_URL } from "./e2e/config";

// All E2E tests share one mock backend's in-memory data (see e2e/mock-server.mjs),
// so tests run serially — each test resets/seeds its own data via
// e2e/api.ts, but concurrent workers would race on the same shared store.
export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: APP_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node e2e/mock-server.mjs",
      url: MOCK_SERVER_URL,
      env: { PORT: String(MOCK_PORT) },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      // Uses a production build rather than `next dev`, since this Next.js
      // version refuses to start a second `next dev` instance for the same
      // project directory even on a different port.
      command: `npx next build && npx next start -p ${APP_PORT}`,
      url: APP_URL,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: MOCK_SERVER_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
