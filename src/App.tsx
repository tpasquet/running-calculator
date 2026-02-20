import { useState, useEffect, type JSX } from 'react'
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import { PaceSpeedConverter } from './pages/PaceSpeedConverter/PaceSpeedConverter'
import { SplitTimeCalculator } from './pages/SplitTimeCalculator/SplitTimeCalculator'
import { TrainingZones } from './pages/TrainingZones/TrainingZones'
import { PerformancePrediction } from './pages/PerformancePrediction/PerformancePrediction'
import { IntervalCalculator } from './pages/IntervalCalculator/IntervalCalculator'
import { Settings } from './pages/Settings/Settings'
import { Legal } from './pages/Legal/Legal'
import { Footer } from './components/Footer/Footer'
import { CookieBanner } from './components/CookieBanner/CookieBanner'
import { SettingsContext, useSettings } from './store/settings'
import type { Language } from './store/settings'
import { useT } from './i18n/useT'
import { initAnalytics, trackPage } from './analytics/useAnalytics'

type LegalPage = 'legal' | 'privacy' | 'terms' | 'cookies' | 'credits'
type Page = 'pace' | 'splits' | 'zones' | 'prediction' | 'intervals' | 'settings' | LegalPage

const COOKIE_CONSENT_KEY = 'running-calculator:cookie-consent'

function getCookieConsent(): 'accepted' | 'declined' | null {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) as 'accepted' | 'declined' | null
  } catch {
    return null
  }
}

function setCookieConsent(value: 'accepted' | 'declined') {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
  } catch {
    // ignore
  }
}

/** Derive the language from the URL path: /fr/* → 'fr', everything else → 'en' */
function langFromPath(pathname: string): Language {
  return pathname.startsWith('/fr') ? 'fr' : 'en'
}

const MAIN_PAGES: Page[] = ['pace', 'splits', 'zones', 'prediction', 'intervals', 'settings']

function OnboardingBanner({ onOpenSettings }: { onOpenSettings: () => void }) {
  const t = useT()
  return (
    <div className="onboarding-banner">
      <div className="onboarding-banner__content">
        <strong className="onboarding-banner__title">{t('onboarding.title')}</strong>
        <span className="onboarding-banner__body">{t('onboarding.body')}</span>
      </div>
      <button type="button" className="onboarding-banner__cta" onClick={onOpenSettings}>
        {t('onboarding.cta')}
      </button>
    </div>
  )
}

const NAV_ICONS: Record<string, JSX.Element> = {
  pace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  splits: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  zones: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  prediction: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  intervals: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="10" y="4" width="4" height="13" rx="1"/><rect x="18" y="9" width="4" height="8" rx="1"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

function AppNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const t = useT()
  const NAV_ITEMS: { id: Page; label: string; short: string }[] = [
    { id: 'pace', label: t('nav.paceSpeed'), short: t('nav.paceShort') },
    { id: 'splits', label: t('nav.splitTimes'), short: t('nav.splitsShort') },
    { id: 'zones', label: t('nav.zones'), short: t('nav.zones') },
    { id: 'prediction', label: t('nav.prediction'), short: t('nav.predictionShort') },
    { id: 'intervals', label: t('nav.intervals'), short: t('nav.intervalsShort') },
    { id: 'settings', label: t('nav.settingsAriaLabel'), short: t('nav.settingsShort') },
  ]
  const activeNav = MAIN_PAGES.includes(page) ? page : 'settings'
  return (
    <>
      {/* Mobile-only topbar */}
      <div className="app-topbar" aria-hidden="true">
        {/* <img src="/favicon.svg" alt="" className="app-topbar__logo" /> */}
        {/* <span className="app-topbar__name">PaceTool</span> */}
      </div>

      {/* Nav */}
      <nav className="app-nav" aria-label="Main navigation">
        {/* Desktop-only wordmark */}
        <span className="app-nav__wordmark" aria-hidden="true">
          {/* <img src="/favicon.svg" alt="" className="app-nav__wordmark-logo" /> */}
          {/* PaceTool */}
        </span>

        {NAV_ITEMS.map(({ id, label, short }) => (
          <button
            key={id}
            className={`app-nav__item${activeNav === id ? ' app-nav__item--active' : ''}`}
            onClick={() => onNavigate(id)}
            type="button"
            aria-label={label}
            aria-current={activeNav === id ? 'page' : undefined}
          >
            <span className="app-nav__icon">{NAV_ICONS[id]}</span>
            <span className="app-nav__label">{short}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

function AppShell({ lang }: { lang: Language }) {
  const [page, setPage] = useState<Page>('pace')
  const [cookieConsent, setCookieConsentState] = useState<'accepted' | 'declined' | null>(getCookieConsent)
  const settingsStore = useSettings(lang)
  const navigate = useNavigate()

  // Keep URL in sync with language setting changes (from Settings page)
  useEffect(() => {
    const currentLang = settingsStore.settings.language
    if (currentLang === 'fr') {
      navigate('/fr/', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [settingsStore.settings.language]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync <html lang> with the user's language preference for SEO and accessibility
  useEffect(() => {
    document.documentElement.lang = settingsStore.settings.language
  }, [settingsStore.settings.language])

  // Sync data-theme attribute for explicit light/dark override
  useEffect(() => {
    const { theme } = settingsStore.settings
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [settingsStore.settings.theme])

  // Initialize GA when consent is already known (returning visitor)
  useEffect(() => {
    initAnalytics(cookieConsent)
  }, [cookieConsent])

  // Track virtual pageview on every page change
  useEffect(() => {
    trackPage(`/${page}`)
  }, [page])

  function handleCookieAccept() {
    setCookieConsent('accepted')
    setCookieConsentState('accepted')
  }

  function handleCookieDecline() {
    setCookieConsent('declined')
    setCookieConsentState('declined')
  }

  function handleFooterNavigate(legalPage: LegalPage) {
    setPage(legalPage)
  }

  const isLegalPage = (page === 'legal' || page === 'privacy' || page === 'terms' || page === 'cookies' || page === 'credits')
  const showOnboarding = settingsStore.settings.mas === null && (page === 'pace' || page === 'splits' || page === 'zones' || page === 'intervals')

  return (
    <SettingsContext.Provider value={settingsStore}>
      <AppNav page={page} onNavigate={setPage} />
      <main className="app">
        {showOnboarding && <OnboardingBanner onOpenSettings={() => setPage('settings')} />}
        {page === 'pace' && <PaceSpeedConverter />}
        {page === 'splits' && <SplitTimeCalculator />}
        {page === 'zones' && <TrainingZones />}
        {page === 'prediction' && <PerformancePrediction />}
        {page === 'intervals' && <IntervalCalculator />}
        {page === 'settings' && <Settings onNavigate={setPage} />}
        {isLegalPage && <Legal page={page as LegalPage} />}
      </main>
      <Footer onNavigate={handleFooterNavigate} />
      {cookieConsent === null && (
        <CookieBanner
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
          onLearnMore={() => setPage('cookies')}
        />
      )}
    </SettingsContext.Provider>
  )
}

function NotFoundContent() {
  const t = useT()
  const navigate = useNavigate()
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">{t('notFound.title')}</h1>
      <p className="not-found__body">{t('notFound.body')}</p>
      <button type="button" className="not-found__back" onClick={() => navigate('/')}>
        {t('notFound.back')}
      </button>
    </div>
  )
}

function NotFoundShell({ lang }: { lang: Language }) {
  const settingsStore = useSettings(lang)
  return (
    <SettingsContext.Provider value={settingsStore}>
      <NotFoundContent />
    </SettingsContext.Provider>
  )
}

function App() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)

  return (
    <Routes>
      <Route path="/fr/*" element={<AppShell lang="fr" />} />
      <Route path="/" element={<AppShell lang={lang} />} />
      <Route path="*" element={<NotFoundShell lang={lang} />} />
    </Routes>
  )
}

export default App
