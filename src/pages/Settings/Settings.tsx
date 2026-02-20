import './Settings.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { useSettingsContext } from '../../store/settings'
import type { Language, Theme } from '../../store/settings'
import type { Unit } from '../../utils/paceSpeed'
import { PREDICTION_DISTANCES } from '../../utils/jackDaniels'
import { parseTimeInput, formatTime } from '../../utils/splitTimes'
import { useState, useEffect, useCallback } from 'react'
import { useT } from '../../i18n/useT'

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'Français' },
]

type LegalPage = 'legal' | 'privacy' | 'terms' | 'cookies' | 'credits'

interface SettingsProps {
  onNavigate: (page: LegalPage) => void
}

export function Settings({ onNavigate }: SettingsProps) {
  const t = useT()
  const { settings, updateSettings } = useSettingsContext()

  const THEMES: { id: Theme; label: string }[] = [
    { id: 'light', label: t('settings.themeLight') },
    { id: 'dark', label: t('settings.themeDark') },
    { id: 'system', label: t('settings.themeSystem') },
  ]

  const UNITS: { id: Unit; label: string }[] = [
    { id: 'km', label: t('settings.unitKilometers') },
    { id: 'mile', label: t('settings.unitMiles') },
  ]

  // MAS input
  const [masInput, setMasInput] = useState(settings.mas !== null ? String(settings.mas) : '')
  useEffect(() => {
    setMasInput(settings.mas !== null ? String(settings.mas) : '')
  }, [])

  function handleMasChange(value: string) {
    setMasInput(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed) && parsed > 0) {
      updateSettings({ mas: parsed })
    } else if (value === '') {
      updateSettings({ mas: null })
    }
  }
  const isMasError = masInput !== '' && (isNaN(parseFloat(masInput)) || parseFloat(masInput) <= 0)

  // Reference performance inputs
  const initDistIdx = settings.refDistanceMeters !== null
    ? PREDICTION_DISTANCES.findIndex((d) => d.meters === settings.refDistanceMeters)
    : 2 // default: 5 km index
  const [refDistIdx, setRefDistIdx] = useState(initDistIdx < 0 ? 2 : initDistIdx)

  const initRefTime = settings.refTimeSeconds !== null ? formatTime(settings.refTimeSeconds) : ''
  const [refTimeInput, setRefTimeInput] = useState(initRefTime)

  function handleRefDistChange(idx: number) {
    setRefDistIdx(idx)
    updateSettings({ refDistanceMeters: PREDICTION_DISTANCES[idx].meters })
  }

  function handleRefTimeChange(value: string) {
    setRefTimeInput(value)
    const parsed = parseTimeInput(value)
    if (!isNaN(parsed) && parsed > 0) {
      updateSettings({ refTimeSeconds: parsed })
    } else if (value === '') {
      updateSettings({ refTimeSeconds: null })
    }
  }

  const isRefTimeError = refTimeInput !== '' && isNaN(parseTimeInput(refTimeInput))
  const refDist = PREDICTION_DISTANCES[refDistIdx]
  const refTimeSeconds = parseTimeInput(refTimeInput)
  const isRefSaved = !isRefTimeError && refTimeInput !== '' && !isNaN(refTimeSeconds) && refTimeSeconds > 0

  // HR inputs
  const [maxHrInput, setMaxHrInput] = useState(settings.maxHr !== null ? String(settings.maxHr) : '')
  const [restingHrInput, setRestingHrInput] = useState(settings.restingHr !== null ? String(settings.restingHr) : '')

  const handleMaxHrChange = useCallback((value: string) => {
    setMaxHrInput(value)
    const parsed = parseInt(value)
    if (!isNaN(parsed) && parsed > 0) updateSettings({ maxHr: parsed })
    else if (value === '') updateSettings({ maxHr: null })
  }, [updateSettings])

  const handleRestingHrChange = useCallback((value: string) => {
    setRestingHrInput(value)
    const parsed = parseInt(value)
    if (!isNaN(parsed) && parsed > 0) updateSettings({ restingHr: parsed })
    else if (value === '') updateSettings({ restingHr: null })
  }, [updateSettings])

  const maxHr = parseInt(maxHrInput)
  const restingHr = parseInt(restingHrInput)
  const isMaxHrError = maxHrInput !== '' && (isNaN(maxHr) || maxHr <= 0)
  const isRestingHrError = restingHrInput !== '' && (isNaN(restingHr) || restingHr <= 0 || restingHr >= maxHr)
  const isHrSaved = settings.maxHr !== null && settings.restingHr !== null && !isMaxHrError && !isRestingHrError

  return (
    <div className="settings">
      <header className="settings__header">
        <h1 className="settings__title">{t('settings.title')}</h1>
      </header>

      {/* VMA — premier */}
      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.masSection')}</h2>
        <NumericInput
          label={t('settings.masLabel')}
          value={masInput}
          onChange={handleMasChange}
          placeholder={t('settings.masPlaceholder')}
          hint={t('settings.masHint')}
          error={isMasError}
        />
        {settings.mas !== null && !isMasError && (
          <p className="settings__saved">{t('settings.masSaved', { mas: settings.mas })}</p>
        )}
      </section>

      {/* Performance de référence */}
      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.refPerfSection')}</h2>
        <p className="settings__hint">{t('settings.refPerfHint')}</p>
        <div className="settings__select-wrap">
          <label className="settings__select-label">{t('settings.refPerfDistanceLabel')}</label>
          <select
            className="settings__select"
            value={refDistIdx}
            onChange={(e) => handleRefDistChange(Number(e.target.value))}
          >
            {PREDICTION_DISTANCES.map((d, i) => (
              <option key={d.label} value={i}>{d.label}</option>
            ))}
          </select>
        </div>
        <NumericInput
          label={t('settings.refPerfTimeLabel')}
          value={refTimeInput}
          onChange={handleRefTimeChange}
          placeholder={t('settings.refPerfTimePlaceholder')}
          hint={t('settings.refPerfTimeHint')}
          error={isRefTimeError}
          inputMode="text"
        />
        {isRefSaved && (
          <p className="settings__saved">{t('settings.refPerfSaved', { distance: refDist.label, time: formatTime(refTimeSeconds) })}</p>
        )}
      </section>

      {/* Fréquence cardiaque */}
      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.hrSection')}</h2>
        <NumericInput
          label={t('settings.hrMaxLabel')}
          value={maxHrInput}
          onChange={handleMaxHrChange}
          placeholder={t('settings.hrMaxPlaceholder')}
          hint={t('settings.hrMaxHint')}
          error={isMaxHrError}
        />
        <NumericInput
          label={t('settings.hrRestingLabel')}
          value={restingHrInput}
          onChange={handleRestingHrChange}
          placeholder={t('settings.hrRestingPlaceholder')}
          hint={t('settings.hrRestingHint')}
          error={isRestingHrError}
        />
        {isHrSaved && (
          <p className="settings__saved">{t('settings.hrSaved', { max: settings.maxHr!, resting: settings.restingHr! })}</p>
        )}
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.languageSection')}</h2>
        <div className="settings__options">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              className={`settings__option${settings.language === lang.id ? ' settings__option--active' : ''}`}
              onClick={() => updateSettings({ language: lang.id })}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.themeSection')}</h2>
        <div className="settings__options">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              className={`settings__option${settings.theme === th.id ? ' settings__option--active' : ''}`}
              onClick={() => updateSettings({ theme: th.id })}
            >
              {th.label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h2 className="settings__section-title">{t('settings.unitSection')}</h2>
        <div className="settings__options">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`settings__option${settings.unit === u.id ? ' settings__option--active' : ''}`}
              onClick={() => updateSettings({ unit: u.id })}
            >
              {u.label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings__section settings__about">
        <h2 className="settings__section-title">{t('settings.aboutSection')}</h2>
        <nav className="settings__about-links">
          {([
            ['legal',   t('settings.aboutLegal')],
            ['privacy', t('settings.aboutPrivacy')],
            ['terms',   t('settings.aboutTerms')],
            ['cookies', t('settings.aboutCookies')],
            ['credits', t('settings.aboutCredits')],
          ] as [LegalPage, string][]).map(([page, label]) => (
            <button
              key={page}
              type="button"
              className="settings__about-link"
              onClick={() => onNavigate(page)}
            >
              {label}
              <svg className="settings__about-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </nav>
      </section>
    </div>
  )
}
