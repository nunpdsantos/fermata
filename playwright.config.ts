import { defineConfig, devices } from '@playwright/test';
import { welcomeSeenState } from './e2e/helpers/welcome';

// PW_PORT lets parallel checkouts run their own dev server instead of
// silently reusing another checkout's server on the default port.
const PORT = Number(process.env.PW_PORT ?? 5173);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The first-visit welcome is already "seen": specs that start from empty
    // storage keep testing what they test (e2e/helpers/welcome.ts).
    storageState: welcomeSeenState(`http://localhost:${PORT}`),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
