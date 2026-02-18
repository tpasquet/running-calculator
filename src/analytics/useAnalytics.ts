/**
 * Google Analytics 4 integration.
 *
 * - GA is loaded only when the user has accepted cookies (RGPD/GDPR compliance).
 * - The measurement ID is read from the VITE_GA_MEASUREMENT_ID env variable.
 * - If the variable is not set, analytics is silently disabled.
 * - Tracks an initial pageview on load and a virtual pageview on each page change.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

let loaded = false

function loadGtag() {
  if (loaded || !GA_ID) return
  loaded = true

  // Inject the gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function (...args) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, {
    // Anonymize IP for GDPR compliance
    anonymize_ip: true,
    // Disable ad personalization signals
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

function trackPageview(pagePath: string, pageTitle?: string) {
  if (!GA_ID || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

/**
 * Call once on app mount with the current consent.
 * Call again whenever consent changes (accept after decline, etc.).
 */
export function initAnalytics(consent: 'accepted' | 'declined' | null) {
  if (consent === 'accepted') {
    loadGtag()
  }
}

/**
 * Track a virtual pageview. Safe to call unconditionally —
 * silently does nothing if GA is not loaded.
 */
export function trackPage(path: string, title?: string) {
  trackPageview(path, title)
}
