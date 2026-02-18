import { useState } from 'react'
import './SplitTimeCalculator.scss'
import { useSettingsContext } from '../../store/settings'
import { useT } from '../../i18n/useT'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import { SplitTable } from '../../components/SplitTable/SplitTable'
import type { Unit } from '../../utils/paceSpeed'
import { mmssToSeconds, secondsToMMSS } from '../../utils/paceSpeed'
import {
  splitsFromMasPercent,
  splitsFromPace,
  splitsFromTargetTime,
  parseTimeInput,
  STANDARD_DISTANCES,
  type SplitResult,
} from '../../utils/splitTimes'

type Mode = 'mas' | 'pace' | 'target'

export function SplitTimeCalculator() {
  const t = useT()
  const { settings } = useSettingsContext()
  const [unit, setUnit] = useState<Unit>(settings.unit)
  const [mode, setMode] = useState<Mode>('pace')

  // Mode: MAS %
  const [masInput, setMasInput] = useState(
    settings.mas !== null ? String(settings.mas) : ''
  )
  const [masPercent, setMasPercent] = useState('100')

  // Mode: pace
  const [paceInput, setPaceInput] = useState('')

  // Mode: target time
  const [targetTime, setTargetTime] = useState('')
  const [targetDistanceIdx, setTargetDistanceIdx] = useState(6) // 5 km default

  function handleUnitChange(u: Unit) {
    setUnit(u)
    setMasInput('')
    setPaceInput('')
    setTargetTime('')
  }

  const splits: SplitResult[] = (() => {
    if (mode === 'mas') {
      const mas = parseFloat(masInput)
      const pct = parseFloat(masPercent)
      if (isNaN(mas) || mas <= 0 || isNaN(pct) || pct <= 0) return []
      return splitsFromMasPercent(mas, pct, unit)
    }
    if (mode === 'pace') {
      const seconds = mmssToSeconds(paceInput)
      if (isNaN(seconds) || seconds <= 0) return []
      return splitsFromPace(seconds, unit)
    }
    if (mode === 'target') {
      const seconds = parseTimeInput(targetTime)
      const dist = STANDARD_DISTANCES[targetDistanceIdx]
      if (isNaN(seconds) || seconds <= 0 || !dist) return []
      return splitsFromTargetTime(seconds, dist.meters, unit)
    }
    return []
  })()

  const paceUnit = unit === 'km' ? 'min/km' : 'min/mi'

  const isPaceError = paceInput !== '' && isNaN(mmssToSeconds(paceInput))
  const isMasError = masInput !== '' && (isNaN(parseFloat(masInput)) || parseFloat(masInput) <= 0)
  const isTargetError = targetTime !== '' && isNaN(parseTimeInput(targetTime))

  // Derive a summary line to show the equivalent pace/speed
  const summaryPace =
    splits.length > 0 ? secondsToMMSS(splits[0].paceSeconds) : null

  return (
    <div className="split-calculator">
      <header className="split-calculator__header">
        <h1 className="split-calculator__title">{t('splitTimes.title')}</h1>
        <UnitToggle value={unit} onChange={handleUnitChange} />
      </header>

      {/* Mode tabs */}
      <div className="split-calculator__tabs" role="tablist">
        {(['pace', 'mas', 'target'] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={`split-calculator__tab${mode === m ? ' split-calculator__tab--active' : ''}`}
            onClick={() => setMode(m)}
            type="button"
          >
            {m === 'pace' && t('splitTimes.tabByPace')}
            {m === 'mas' && t('splitTimes.tabByMas')}
            {m === 'target' && t('splitTimes.tabByTarget')}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="split-calculator__inputs">
        {mode === 'pace' && (
          <NumericInput
            label={t('splitTimes.paceLabel', { unit: paceUnit })}
            value={paceInput}
            onChange={setPaceInput}
            placeholder={t('splitTimes.pacePlaceholder')}
            hint={t('splitTimes.paceHint')}
            error={isPaceError}
          />
        )}

        {mode === 'mas' && (
          <>
            <NumericInput
              label={t('splitTimes.masLabel')}
              value={masInput}
              onChange={setMasInput}
              placeholder={t('splitTimes.masPlaceholder')}
              error={isMasError}
            />
            <NumericInput
              label={t('splitTimes.masPercentLabel')}
              value={masPercent}
              onChange={setMasPercent}
              placeholder={t('splitTimes.masPercentPlaceholder')}
              hint={t('splitTimes.masPercentHint')}
            />
          </>
        )}

        {mode === 'target' && (
          <>
            <div className="split-calculator__select-wrap">
              <label className="split-calculator__select-label">{t('splitTimes.distanceLabel')}</label>
              <select
                className="split-calculator__select"
                value={targetDistanceIdx}
                onChange={(e) => setTargetDistanceIdx(Number(e.target.value))}
              >
                {STANDARD_DISTANCES.map((d, i) => (
                  <option key={d.label} value={i}>{d.label}</option>
                ))}
              </select>
            </div>
            <NumericInput
              label={t('splitTimes.targetTimeLabel')}
              value={targetTime}
              onChange={setTargetTime}
              placeholder={t('splitTimes.targetTimePlaceholder')}
              hint={t('splitTimes.targetTimeHint')}
              error={isTargetError}
            />
          </>
        )}
      </div>

      {/* Summary */}
      {summaryPace && (
        <p className="split-calculator__summary">
          {t('splitTimes.equivalentPace')} <strong>{summaryPace}</strong> {paceUnit}
        </p>
      )}

      {/* Results */}
      <SplitTable splits={splits} unit={unit} />
    </div>
  )
}
