import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import { PaceSpeedConverter } from './pages/PaceSpeedConverter/PaceSpeedConverter'
import { SplitTimeCalculator } from './pages/SplitTimeCalculator/SplitTimeCalculator'
import { TrainingZones } from './pages/TrainingZones/TrainingZones'
import { PerformancePrediction } from './pages/PerformancePrediction/PerformancePrediction'
import { Settings } from './pages/Settings/Settings'
import { Legal } from './pages/Legal/Legal'
import { Footer } from './components/Footer/Footer'
import { CookieBanner } from './components/CookieBanner/CookieBanner'
import { SettingsContext, useSettings } from './store/settings'
import type { Language } from './store/settings'
import { useT } from './i18n/useT'
import { initAnalytics, trackPage } from './analytics/useAnalytics'

type LegalPage = 'legal' | 'privacy' | 'terms' | 'cookies'
type Page = 'pace' | 'splits' | 'zones' | 'prediction' | 'settings' | LegalPage

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

const MAIN_PAGES: Page[] = ['pace', 'splits', 'zones', 'prediction', 'settings']

function AppNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const t = useT()
  const NAV_ITEMS: { id: Page; label: string }[] = [
    { id: 'pace', label: t('nav.paceSpeed') },
    { id: 'splits', label: t('nav.splitTimes') },
    { id: 'zones', label: t('nav.zones') },
    { id: 'prediction', label: t('nav.prediction') },
    { id: 'settings', label: '⚙' },
  ]
  // Highlight the nav as "settings" when on a legal sub-page accessed from settings
  const activeNav = MAIN_PAGES.includes(page) ? page : 'settings'
  return (
    <nav className="app-nav">
      {NAV_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          className={`app-nav__item${activeNav === id ? ' app-nav__item--active' : ''}${id === 'settings' ? ' app-nav__item--icon' : ''}`}
          onClick={() => onNavigate(id)}
          type="button"
          aria-label={id === 'settings' ? t('nav.settingsAriaLabel') : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
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

  const isLegalPage = (page === 'legal' || page === 'privacy' || page === 'terms' || page === 'cookies')

  return (
    <SettingsContext.Provider value={settingsStore}>
      <AppNav page={page} onNavigate={setPage} />
      <main className="app">
        {page === 'pace' && <PaceSpeedConverter />}
        {page === 'splits' && <SplitTimeCalculator />}
        {page === 'zones' && <TrainingZones />}
        {page === 'prediction' && <PerformancePrediction />}
        {page === 'settings' && <Settings />}
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

function App() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)

  return (
    <Routes>
      <Route path="/fr/*" element={<AppShell lang="fr" />} />
      <Route path="/*" element={<AppShell lang={lang} />} />
    </Routes>
  )
}

export default App
