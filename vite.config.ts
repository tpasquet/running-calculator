import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'PaceTool',
        short_name: 'PaceTool',
        description: 'Free running calculator: pace converter, split times, training zones from MAS/VMA, and race performance prediction. Works offline.',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['sports', 'health', 'fitness'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: 'og-image.png',
            sizes: '1200x630',
            type: 'image/png',
            form_factor: 'wide',
            label: 'PaceTool — Pace converter and training tools',
          },
        ],
      },
      workbox: {
        // Cache all app assets for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        // SPA fallback: serve index.html for any navigate request (covers /fr/ offline too)
        navigateFallback: '/index.html',
        // Serve stale content while revalidating in the background
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pacetool\.run\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    // Target modern browsers for smaller bundles (better LCP/FID)
    target: 'es2020',
    // Enable source maps for debugging without bloating production
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
    // Inline small assets as base64 to reduce HTTP requests
    assetsInlineLimit: 4096,
  },
})
