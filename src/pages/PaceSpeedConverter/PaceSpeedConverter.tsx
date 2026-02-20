import { useState } from 'react'
import './PaceSpeedConverter.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import { ResultDisplay } from '../../components/ResultDisplay/ResultDisplay'
import {
  type Unit,
  speedToPaceSeconds,
  paceSecondsToSpeed,
  secondsToMMSS,
  mmssToSeconds,
} from '../../utils/paceSpeed'
import { useT } from '../../i18n/useT'

export function PaceSpeedConverter() {
  const t = useT()
  const [unit, setUnit] = useState<Unit>('km')
  const [paceInput, setPaceInput] = useState('')
  const [speedInput, setSpeedInput] = useState('')

  const paceUnit = unit === 'km' ? 'min/km' : 'min/mile'
  const speedUnit = unit === 'km' ? 'km/h' : 'mph'

  const derivedSpeed: string = (() => {
    const seconds = mmssToSeconds(paceInput)
    if (isNaN(seconds) || seconds <= 0) return '—'
    return paceSecondsToSpeed(seconds, unit).toFixed(2)
  })()

  const derivedPace: string = (() => {
    const speed = parseFloat(speedInput)
    if (isNaN(speed) || speed <= 0) return '—:——'
    return secondsToMMSS(speedToPaceSeconds(speed, unit))
  })()

  const isPaceError = paceInput !== '' && isNaN(mmssToSeconds(paceInput))
  const isSpeedError = speedInput !== '' && (isNaN(parseFloat(speedInput)) || parseFloat(speedInput) <= 0)

  function handleUnitChange(newUnit: Unit) {
    setUnit(newUnit)
    setPaceInput('')
    setSpeedInput('')
  }

  return (
    <div className="pace-speed-converter">
      <header className="pace-speed-converter__header">
        <h1 className="pace-speed-converter__title">{t('paceSpeed.title')}</h1>
        <UnitToggle value={unit} onChange={handleUnitChange} />
      </header>

      <section className="pace-speed-converter__section">
        <h2 className="pace-speed-converter__section-title">{t('paceSpeed.sectionPaceToSpeed')}</h2>
        <NumericInput
          label={t('paceSpeed.paceLabel', { unit: paceUnit })}
          value={paceInput}
          onChange={setPaceInput}
          placeholder={t('paceSpeed.pacePlaceholder')}
          hint={t('paceSpeed.paceHint')}
          error={isPaceError}
          inputMode="text"
        />
        <ResultDisplay
          label={t('paceSpeed.speedLabel')}
          value={derivedSpeed}
          unit={speedUnit}
        />
      </section>

      <div className="pace-speed-converter__divider" aria-hidden="true" />

      <section className="pace-speed-converter__section">
        <h2 className="pace-speed-converter__section-title">{t('paceSpeed.sectionSpeedToPace')}</h2>
        <NumericInput
          label={t('paceSpeed.speedInputLabel', { unit: speedUnit })}
          value={speedInput}
          onChange={setSpeedInput}
          placeholder={t('paceSpeed.speedPlaceholder')}
          error={isSpeedError}
        />
        <ResultDisplay
          label={t('paceSpeed.paceResultLabel')}
          value={derivedPace}
          unit={paceUnit}
        />
      </section>
    </div>
  )
}
