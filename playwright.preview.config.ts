import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * The same browser tests against the PRODUCTION build served by `vite
 * preview` (audit W9-07). The dev server has no service worker and no PWA
 * manifest, so e2e/pwa.spec.ts skips its offline/manifest/update checks
 * there; here they actually run. Needs `dist/` — `npm run build` first
 * (`npm run test:e2e:preview` does both).
 */
const PORT = Number(process.env.PW_PREVIEW_PORT ?? 4173);

export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
