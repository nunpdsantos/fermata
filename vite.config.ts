import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
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
        // Precache only the app shell + small core deps. Curriculum data,
        // exercises, and VexFlow stream in via runtimeCaching on demand —
        // a Level-1 user shouldn't pay for Level-9 content on first visit.
        globPatterns: ['**/*.{css,html,ico,png,svg,woff2}', 'assets/index-*.js', 'assets/i18next-*.js', 'assets/framer-motion-*.js', 'assets/zustand-*.js'],
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
          // WS11 (temporary A/B bake-off): Iowa classical-guitar bank B
          // (~2.4 MB, 39 notes) under /samples/guitar-b/. Same CacheFirst policy
          // as bank A so whichever bank the owner selects works offline. The
          // bank-A pattern above requires the literal "guitar/" segment and does
          // NOT match "guitar-b/", so the two caches stay disjoint. Remove with
          // the rest of the bake-off once a bank is chosen.
          {
            urlPattern: /\/samples\/guitar-b\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'guitar-b-samples',
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
