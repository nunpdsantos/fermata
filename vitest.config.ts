import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // vite-plugin-pwa's virtual module doesn't exist under vitest; without
      // this stub, usePWA.ts fails to transform and silently drops out of
      // coverage (audit R-02).
      'virtual:pwa-register': fileURLToPath(new URL('./src/test/stubs/pwa-register.ts', import.meta.url)),
    },
  },
  test: {
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/i18n/index.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.test.*',
        'src/core/**',
        'src/data/**',
        'src/design/tokens/motion.ts',
        'src/main.tsx',
        'src/test/**',
      ],
      // Ratcheted from the 2026-07-24 baseline (69.2/60.2/66.8/70.9) — raise
      // these as coverage grows; never lower them (audit R-02).
      thresholds: {
        statements: 68,
        branches: 59,
        functions: 65,
        lines: 69,
      },
    },
  },
})
