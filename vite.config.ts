import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { existsSync, readFileSync, statSync } from 'node:fs'

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

/**
 * Precache CLOSURE (workbox manifestTransform): any chunk a precached file
 * imports statically is precached too, followed transitively. Otherwise a
 * precached shell file (Quick Search, the fretboard, Drill …) fails offline
 * on a fresh install the moment a refactor splits one of its imports into a
 * new chunk — the old fix was to list each such chunk by name (prng,
 * fingeringStore, moduleIndex, scaleParser), which breaks on every split.
 * `npm run check:sw` verifies the result.
 */
const DIST_DIR = new URL('./dist/', import.meta.url)
type PrecacheEntry = { url: string; revision: string | null; size: number }
function addStaticImportClosure(entries: PrecacheEntry[]): { manifest: PrecacheEntry[]; warnings: string[] } {
  const manifest = [...entries]
  const seen = new Set(manifest.map((e) => e.url))
  const queue = manifest.map((e) => e.url).filter((u) => u.startsWith('assets/') && u.endsWith('.js'))
  while (queue.length) {
    const url = queue.shift()!
    const file = new URL(url, DIST_DIR)
    if (!existsSync(file)) continue
    const source = readFileSync(file, 'utf8')
    for (const m of source.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) {
      const dep = `assets/${m[1]}`
      if (seen.has(dep)) continue
      seen.add(dep)
      // Hashed file names: the name is the revision.
      manifest.push({ url: dep, revision: null, size: statSync(new URL(dep, DIST_DIR)).size })
      queue.push(dep)
    }
  }
  return { manifest, warnings: [] }
}

/**
 * ONE-OFF FOR THE W9 RELEASE ONLY (2026-10-31, coordinator decision, review
 * B2). Installed clients still run the previous autoUpdate build: their page
 * code never sends SKIP_WAITING, so a prompt-mode worker would wait until
 * every window is closed — with no toast. This release therefore ships
 * workbox `skipWaiting: true` so those clients take it and reload themselves
 * as before; from the NEXT release on, prompt mode applies (set
 * ONE_OFF_SKIP_WAITING to false and delete this block).
 * src/__tests__/oneOffSkipWaiting.test.ts FAILS after the expiry date while it
 * is still on; CLAUDE.md carries the same note.
 */
const ONE_OFF_SKIP_WAITING = true
const ONE_OFF_SKIP_WAITING_EXPIRES = '2026-11-14'
void ONE_OFF_SKIP_WAITING_EXPIRES // read by the test (source text), not at build time

/** Entry module of a translated-content chunk (see chunkFileNames). */
function isTranslatedContent(modulePath: string): boolean {
  return modulePath.includes('/src/i18n/content/') || /\/src\/.+\.[a-z]{2}\.(ts|json)$/.test(modulePath)
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
        // session — as it did under autoUpdate. Updates wait for the learner:
        // prompt mode adds no skipWaiting (only a SKIP_WAITING message handler
        // the toast's Reload sends) — EXCEPT the one-off below.
        clientsClaim: true,
        // ONE-OFF, this release only — see ONE_OFF_SKIP_WAITING above.
        skipWaiting: ONE_OFF_SKIP_WAITING,
        // Precache only the app shell + small core deps. Curriculum data,
        // exercises, and VexFlow stream in via runtimeCaching on demand —
        // a Level-1 user shouldn't pay for Level-9 content on first visit.
        // Drill chunks ARE precached: the manifest advertises a "Start Drill"
        // shortcut, which must work from a fresh offline install.
        // prng is shared by Drill and the Learn exercise shuffle → its own
        // chunk; it must ride along or the DrillView import fails offline.
        // The lazy Fretboard and Quick Search chunks are part of the shell, so
        // they are precached too (audit W9-11); their own imports ride along
        // via manifestTransforms below. `npm run check:sw` fails if a
        // precached file imports a chunk that is not precached.
        globPatterns: [
          '**/*.{css,html,ico,png,svg,woff2}',
          'assets/index-*.js', 'assets/i18next-*.js', 'assets/framer-motion-*.js', 'assets/zustand-*.js',
          'assets/DrillView-*.js', 'assets/drillStore-*.js', 'assets/prng-*.js', 'assets/workbox-window*.js',
          'assets/Fretboard-*.js', 'assets/QuickSearch-*.js',
        ],
        // …plus every chunk those import statically, transitively (their
        // split-out dependencies: fingeringStore, moduleIndex, parsers, …).
        manifestTransforms: [addStaticImportClosure],
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
          // `i18n-` = EVERY translated-content chunk, whatever its file is
          // called (PT/ES curriculum / exercise / template / song overlays,
          // per-language module titles …) — see chunkFileNames below. One
          // generic pattern, so a new overlay file can't silently fall
          // outside the cache and drop to English offline.
          {
            urlPattern: /\/assets\/(i18n-|curriculum[Ll]|exercisesL|templatesL|ExploreView-|LearnView-|StaffNotation|notationHelpers|celebrationSound).*\.js$/,
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
        // Translated content gets an `i18n-` file-name prefix so the service
        // worker's content-cache route covers all of it generically: any chunk
        // whose entry module lives under src/i18n/content/ (the PT/ES
        // overlays, loaded per language and level) or is a language-suffixed
        // data file (e.g. moduleTitles.pt.ts). `npm run check:sw` fails if a
        // content-overlay chunk is not covered by that route.
        chunkFileNames(chunk) {
          const entry = chunk.facadeModuleId?.replace(/\\/g, '/') ?? '';
          return isTranslatedContent(entry) ? 'assets/i18n-[name]-[hash].js' : 'assets/[name]-[hash].js';
        },
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
