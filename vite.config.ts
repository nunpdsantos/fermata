import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { parseReleaseNotes, versionInfo } from './src/release/releaseNotes.ts'

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
 * Release notes + the build's version file (W9b). release-notes.json (repo
 * root, newest first) is the source; a malformed file fails the build. The
 * app gets its own release number and note (`__APP_RELEASE__`), and every
 * build publishes dist/version.json — build id, date, release, critical,
 * criticalSince, one-line notes in EN/PT/ES — which a running app fetches to
 * show "What's new" and to tell a critical update. It is NOT precached (the
 * globs below have no *.json): the network copy describes the waiting version.
 */
const RELEASES = parseReleaseNotes(JSON.parse(readFileSync(new URL('./release-notes.json', import.meta.url), 'utf8')))
const BUILD_DATE = new Date().toISOString().slice(0, 10)
function buildId(): string {
  const fromVercel = process.env.VERCEL_GIT_COMMIT_SHA
  if (fromVercel) return fromVercel.slice(0, 12)
  try {
    return execSync('git rev-parse --short=12 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'unknown'
  }
}
function versionJson(): Plugin {
  return {
    name: 'fermata-version-json',
    apply: 'build',
    generateBundle() {
      const info = versionInfo(RELEASES, buildId(), BUILD_DATE)
      this.emitFile({ type: 'asset', fileName: 'version.json', source: `${JSON.stringify(info, null, 2)}\n` })
    },
  }
}

/** Entry module of a translated-content chunk (see chunkFileNames). */
function isTranslatedContent(modulePath: string): boolean {
  return modulePath.includes('/src/i18n/content/') || /\/src\/.+\.[a-z]{2}\.(ts|json)$/.test(modulePath)
}

export default defineConfig({
  // The build's UTC date, shown in Settings ("Fermata · build 2026-10-31",
  // W11-A). src/buildInfo.ts reads it; unit tests run without it.
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
    // This build's newest release and its note (src/buildInfo.ts) — never
    // the build id, so a commit without code changes ships no update the same
    // UTC day (__BUILD_DATE__ above does change the bundle on a later day).
    __APP_RELEASE__: JSON.stringify({ release: RELEASES[0].release, notes: RELEASES[0].notes }),
  },
  preview: {
    headers: productionHeaders(),
  },
  plugins: [
    react(),
    tailwindcss(),
    versionJson(),
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
        // prompt mode adds no skipWaiting on install (only a SKIP_WAITING
        // message handler the toast's Reload sends). Spelled out as `false` so
        // it cannot come back by accident; src/__tests__/promptModeWorker.test.ts
        // fails if it does.
        clientsClaim: true,
        skipWaiting: false,
        // W9b: a worker can count the app's open windows for a page about to
        // apply an update silently (public/sw-window-count.js; a tab that
        // cannot say it is idle counts as busy — src/services/otherTabs.ts).
        importScripts: ['sw-window-count.js'],
        // EVERY JS and CSS file of the build is precached (W9b, superseding
        // D-22's "load on demand" for code chunks): app code, every level's
        // curriculum / exercises / templates, VexFlow, and every translated-
        // content `i18n-*` chunk. This includes the lazy Fretboard, Quick
        // Search and W11-B NeckView, plus Explore / Learn / StaffNotation /
        // celebrationSound; Drill and its shared prng must work from a fresh
        // offline install (the manifest's "Start Drill" shortcut). Views must
        // open offline after one online visit, even without an HTTP cache;
        // usePWA warms files loaded before the worker took control.
        // A page still running an older build — an
        // update waiting, "Later" — then never needs the server for its own
        // files: after a deploy those URLs are gone from the server, and a
        // view or level opened for the first time used to fail until the
        // reload. Cost (measured, CLAUDE.md PWA section): the precache grows
        // to the whole code bundle, downloaded once, AFTER the page has
        // loaded (the worker registers on window load — first paint is not
        // delayed), then only changed files per update (hashed names).
        // Audio samples stay on demand (runtime-cached below). `npm run
        // check:sw` fails if any JS/CSS file is not precached.
        globPatterns: ['**/*.{css,html,ico,png,svg,woff2}', 'assets/**/*.js'],
        // A precached file's static imports, transitively — a no-op while the
        // globs take every chunk; kept so narrowing them can never leave a
        // precached file with an import that is not.
        manifestTransforms: [addStaticImportClosure],
        runtimeCaching: [
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
          // (The code-chunk runtime caches of before W9b — vexflow-cache,
          // content-cache, app-chunks — are gone: every chunk is precached.
          // usePWA deletes the old caches once this worker controls the page.)
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
        // Translated content gets an `i18n-` file-name prefix: any chunk whose
        // entry module lives under src/i18n/content/ (the PT/ES overlays,
        // loaded per language and level) or is a language-suffixed data file
        // (e.g. moduleTitles.pt.ts). `npm run check:sw` finds every overlay
        // chunk by it (and by the loader's glob map) and fails if one is not
        // precached.
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
