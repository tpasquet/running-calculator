import { useState } from 'react'
import './IntervalCalculator.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import type { Unit } from '../../utils/paceSpeed'
import {
  computeIntervalFromMas,
  formatRepTime,
  formatPaceStr,
  formatSpeedStr,
  formatTotalTime,
  formatDistance,
  INTERVAL_DISTANCES,
} from '../../utils/intervalCalculator'
import { useSettingsContext } from '../../store/settings'
import { useT } from '../../i18n/useT'

/** Durées de récupération prédéfinies (secondes) */
const RECOVERY_OPTIONS = [
  { label: '30 s', seconds: 30 },
  { label: '45 s', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '90 s', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '4 min', seconds: 240 },
  { label: '5 min', seconds: 300 },
]

export function IntervalCalculator() {
  const t = useT()
  const { settings } = useSettingsContext()

  const [unit, setUnit] = useState<Unit>(settings.unit)
  const [masInput, setMasInput] = useState(settings.mas !== null ? String(settings.mas) : '')
  const [masPercentInput, setMasPercentInput] = useState('100')
  const [repsInput, setRepsInput] = useState('10')
  const [distanceIdx, setDistanceIdx] = useState(3) // 400 m par défaut
  const [recoveryIdx, setRecoveryIdx] = useState(2) // 1 min par défaut

  const mas = parseFloat(masInput)
  const masPercent = parseFloat(masPercentInput)
  const reps = parseInt(repsInput)
  const repDistance = INTERVAL_DISTANCES[distanceIdx].meters
  const recoverySeconds = RECOVERY_OPTIONS[recoveryIdx].seconds

  const isMasValid = !isNaN(mas) && mas > 0
  const isMasError = masInput !== '' && !isMasValid
  const isMasPercentValid = !isNaN(masPercent) && masPercent > 0 && masPercent <= 200
  const isMasPercentError = masPercentInput !== '' && !isMasPercentValid
  const isRepsValid = !isNaN(reps) && reps > 0 && reps <= 50
  const isRepsError = repsInput !== '' && !isRepsValid

  const isValid = isMasValid && isMasPercentValid && isRepsValid

  const result = isValid
    ? computeIntervalFromMas(mas, masPercent, repDistance, reps, unit)
    : null

  const totalWithRecovery = result
    ? result.totalWorkSeconds + recoverySeconds * (reps - 1)
    : 0

  return (
    <div className="interval-calc">
      <header className="interval-calc__header">
        <h1 className="interval-calc__title">{t('intervalCalc.title')}</h1>
        <UnitToggle value={unit} onChange={setUnit} />
      </header>

      <div className="interval-calc__inputs">
        <NumericInput
          label={t('intervalCalc.masLabel')}
          value={masInput}
          onChange={setMasInput}
          placeholder={t('intervalCalc.masPlaceholder')}
          hint={t('intervalCalc.masHint')}
          error={isMasError}
        />

        <NumericInput
          label={t('intervalCalc.masPercentLabel')}
          value={masPercentInput}
          onChange={setMasPercentInput}
          placeholder={t('intervalCalc.masPercentPlaceholder')}
          hint={t('intervalCalc.masPercentHint')}
          error={isMasPercentError}
        />

        <div className="interval-calc__row">
          <div className="interval-calc__select-wrap">
            <label className="interval-calc__select-label">{t('intervalCalc.distanceLabel')}</label>
            <select
              className="interval-calc__select"
              value={distanceIdx}
              onChange={(e) => setDistanceIdx(Number(e.target.value))}
            >
              {INTERVAL_DISTANCES.map((d, i) => (
                <option key={d.label} value={i}>{d.label}</option>
              ))}
            </select>
          </div>

          <NumericInput
            label={t('intervalCalc.repsLabel')}
            value={repsInput}
            onChange={setRepsInput}
            placeholder={t('intervalCalc.repsPlaceholder')}
            error={isRepsError}
          />
        </div>

        <div className="interval-calc__select-wrap">
          <label className="interval-calc__select-label">{t('intervalCalc.recoveryLabel')}</label>
          <select
            className="interval-calc__select"
            value={recoveryIdx}
            onChange={(e) => setRecoveryIdx(Number(e.target.value))}
          >
            {RECOVERY_OPTIONS.map((r, i) => (
              <option key={r.label} value={i}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!isValid && (
        <p className="interval-calc__empty">{t('intervalCalc.emptyState')}</p>
      )}

      {result && (
        <>
          {/* Résumé de la séance */}
          <div className="interval-calc__summary-card">
            <div className="interval-calc__summary-title">{t('intervalCalc.sessionSummary')}</div>
            <div className="interval-calc__summary-grid">
              <div className="interval-calc__summary-item">
                <span className="interval-calc__summary-label">{t('intervalCalc.sessionLabel')}</span>
                <span className="interval-calc__summary-value">
                  {reps} × {INTERVAL_DISTANCES[distanceIdx].label}
                </span>
              </div>
              <div className="interval-calc__summary-item">
                <span className="interval-calc__summary-label">{t('intervalCalc.totalDistanceLabel')}</span>
                <span className="interval-calc__summary-value">{formatDistance(result.totalDistanceMeters)}</span>
              </div>
              <div className="interval-calc__summary-item">
                <span className="interval-calc__summary-label">{t('intervalCalc.workTimeLabel')}</span>
                <span className="interval-calc__summary-value">{formatTotalTime(result.totalWorkSeconds)}</span>
              </div>
              <div className="interval-calc__summary-item">
                <span className="interval-calc__summary-label">{t('intervalCalc.totalTimeLabel')}</span>
                <span className="interval-calc__summary-value">{formatTotalTime(totalWithRecovery)}</span>
              </div>
            </div>
          </div>

          {/* Détail par répétition */}
          <div className="interval-calc__rep-card">
            <div className="interval-calc__rep-title">{t('intervalCalc.repTitle')}</div>
            <div className="interval-calc__rep-stats">
              <div className="interval-calc__rep-stat">
                <span className="interval-calc__rep-stat-label">{t('intervalCalc.repTimeLabel')}</span>
                <span className="interval-calc__rep-stat-value interval-calc__rep-stat-value--primary">
                  {formatRepTime(result.repTimeSeconds)}
                </span>
              </div>
              <div className="interval-calc__rep-stat">
                <span className="interval-calc__rep-stat-label">{t('intervalCalc.repPaceLabel')}</span>
                <span className="interval-calc__rep-stat-value">
                  {formatPaceStr(result.repPaceSeconds, unit)}
                </span>
              </div>
              <div className="interval-calc__rep-stat">
                <span className="interval-calc__rep-stat-label">{t('intervalCalc.repSpeedLabel')}</span>
                <span className="interval-calc__rep-stat-value">
                  {formatSpeedStr(result.speedKmh, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Tableau des répétitions */}
          <table className="interval-calc__table">
            <thead>
              <tr>
                <th>{t('intervalCalc.colRep')}</th>
                <th>{t('intervalCalc.colTime')}</th>
                <th>{t('intervalCalc.colRecovery')}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: reps }, (_, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{formatRepTime(result.repTimeSeconds)}</td>
                  <td>{i < reps - 1 ? RECOVERY_OPTIONS[recoveryIdx].label : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
