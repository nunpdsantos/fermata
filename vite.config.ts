import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

// `vite preview` serves the PRODUCTION security headers from vercel.json (the
// catch-all rule), so the preview-build browser tests run under the real CSP
// — the dev server has none, which is how the data:-font and inline-script
// gotchas in CLAUDE.md used to slip through to production.
function productionHeaders(): Record<string, string> {
  const vercel = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  }
  const all = vercel.headers.find((r) => r.source === '/(.*)')?.headers ?? []
  return Object.fromEntries(all.map((h) => [h.key, h.value]))
}

export default defineConfig({
  preview: {
    headers: productionHeaders(),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt' (audit W9-06 / D-21): a new version installs in the background
      // and WAITS; the "new version — reload" toast asks, and only the
      // learner's tap activates it (usePWA.ts). 'autoUpdate' reloaded the page
      // a few seconds after launch without asking.
      registerType: 'prompt',
      manifest: {
        name: 'Fermata — Music Theory',
        short_name: 'Fermata',
        description: 'Fermata — interactive music theory through your instrument. Explore scales, chords, and keys with a piano or guitar always in reach.',
        theme_color: '#f5efe2',
        background_color: '#f5efe2',
        display: 'standalone',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Start Drill',
            short_name: 'Drill',
            url: '/?view=drill',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // The FIRST install takes control of the open page at once, so runtime
        // caching (samples, notation, lesson data) works from the first
        // session — as it did under autoUpdate. Updates still wait for the
        // learner: prompt mode adds no skipWaiting (only a SKIP_WAITING message
        // handler the toast's Reload sends).
        clientsClaim: true,
        // Precache only the app shell + small core deps. Curriculum data,
        // exercises, and VexFlow stream in via runtimeCaching on demand —
        // a Level-1 user shouldn't pay for Level-9 content on first visit.
        // Drill chunks ARE precached: the manifest advertises a "Start Drill"
        // shortcut, which must work from a fresh offline install.
        // prng is shared by Drill and the Learn exercise shuffle → its own
        // chunk; it must ride along or the DrillView import fails offline.
        // The lazy Fretboard (+ fingeringStore) and Quick Search (+ its index
        // and parsers) chunks are part of the shell, so they are precached
        // too (audit W9-11). `npm run check:sw` fails if a precached file
        // imports a chunk that is not precached.
        globPatterns: [
          '**/*.{css,html,ico,png,svg,woff2}',
          'assets/index-*.js', 'assets/i18next-*.js', 'assets/framer-motion-*.js', 'assets/zustand-*.js',
          'assets/DrillView-*.js', 'assets/drillStore-*.js', 'assets/prng-*.js', 'assets/workbox-window*.js',
          'assets/Fretboard-*.js', 'assets/fingeringStore-*.js',
          'assets/QuickSearch-*.js', 'assets/moduleIndex-*.js', 'assets/scaleParser-*.js',
        ],
        globIgnores: [
          '**/vexflow*',
          '**/curriculum[lL]*',
          '**/exercisesL*',
          '**/templatesL*',
          '**/ExploreView-*',
          '**/LearnView-*',
          '**/StaffNotation*',
          '**/notationHelpers*',
          '**/celebrationSound*',
        ],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/vexflow-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vexflow-cache',
              expiration: { maxEntries: 2, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          // Salamander piano samples (~2 MB total): immutable, fetched lazily,
          // cached forever so the sampled piano works offline after first use.
          {
            urlPattern: /\/samples\/piano\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'piano-samples',
              expiration: { maxEntries: 40, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          // FreePats classical-guitar samples (~1.7 MB, 39 notes): immutable,
          // fetched lazily, cached forever so the sampled guitar works offline
          // after first use. Mirrors the piano-samples entry.
          {
            urlPattern: /\/samples\/guitar\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'guitar-samples',
              expiration: { maxEntries: 45, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          // Curriculum levels + exercises + templates + view chunks + the
          // notation/celebration satellites those views lazy-import:
          // StaleWhileRevalidate so users get offline support after first
          // touch without blowing up the first-visit precache. StaffNotation
          // is the entry point for the cached vexflow chunk — without it,
          // notation exercises broke offline even with vexflow cached.
          {
            urlPattern: /\/assets\/(curriculum[Ll]|exercisesL|templatesL|ExploreView-|LearnView-|StaffNotation|notationHelpers|celebrationSound).*\.js$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'content-cache',
              expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          // Every OTHER code-split file (a store split out by a dynamic
          // import, the lazy Fretboard / Quick Search chunks, …). Hashed names
          // never change content, so CacheFirst. Must stay LAST: workbox uses
          // the first matching route. `npm run check:sw` fails if any emitted
          // JS/CSS file is neither precached nor matched by a route.
          {
            urlPattern: /\/assets\/[^/]+\.(js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-chunks',
              expiration: { maxEntries: 120, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      // Dev service worker disabled: a registered SW during development
      // serves stale-cached modules and causes confusing behavior. Production
      // registration is unaffected.
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vexflow')) return 'vexflow';
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
          if (id.includes('node_modules/zustand')) return 'zustand';
          if (id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next')) return 'i18next';
        },
      },
    },
  },
})
