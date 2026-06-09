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
          '**/songReferences*',
          '**/ExploreView-*',
          '**/PlayView-*',
          '**/LearnView-*',
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
          // Curriculum levels + exercises + templates + song refs + view chunks:
          // StaleWhileRevalidate so users get offline support after first touch
          // without blowing up the first-visit precache.
          {
            urlPattern: /\/assets\/(curriculum[Ll]|exercisesL|templatesL|songReferences|ExploreView-|PlayView-|LearnView-).*\.js$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'content-cache',
              expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
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
