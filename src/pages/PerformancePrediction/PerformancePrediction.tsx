import { useState } from 'react'
import './PerformancePrediction.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import { PredictionTable } from '../../components/PredictionTable/PredictionTable'
import type { Unit } from '../../utils/paceSpeed'
import { parseTimeInput, formatTime } from '../../utils/splitTimes'
import { generatePredictions, PREDICTION_DISTANCES } from '../../utils/jackDaniels'
import type { PredictionResult } from '../../utils/jackDaniels'
import { generateRiegelPredictions } from '../../utils/riegel'
import { useSettingsContext } from '../../store/settings'
import { useT } from '../../i18n/useT'

type Model = 'daniels' | 'riegel'

export function PerformancePrediction() {
  const t = useT()
  const { settings } = useSettingsContext()

  // Pre-fill from settings reference performance
  const initDistIdx = settings.refDistanceMeters !== null
    ? PREDICTION_DISTANCES.findIndex((d) => d.meters === settings.refDistanceMeters)
    : 3 // default: 5 km
  const initTimeInput = settings.refTimeSeconds !== null ? formatTime(settings.refTimeSeconds) : ''

  const [unit, setUnit] = useState<Unit>('km')
  const [model, setModel] = useState<Model>('daniels')
  const [distanceIdx, setDistanceIdx] = useState(initDistIdx < 0 ? 3 : initDistIdx)
  const [timeInput, setTimeInput] = useState(initTimeInput)

  const refDistance = PREDICTION_DISTANCES[distanceIdx]
  const timeSeconds = parseTimeInput(timeInput)
  const isTimeError = timeInput !== '' && isNaN(timeSeconds)
  const isValid = !isNaN(timeSeconds) && timeSeconds > 0

  const MODELS = [
    { id: 'daniels' as Model, label: t('perfPrediction.modelDanielsLabel'), description: t('perfPrediction.modelDanielsDescription') },
    { id: 'riegel' as Model, label: t('perfPrediction.modelRiegelLabel'), description: t('perfPrediction.modelRiegelDescription') },
  ]
  const activeModel = MODELS.find((m) => m.id === model)!

  let predictions: PredictionResult[] = []
  let vdot = 0

  if (isValid) {
    if (model === 'daniels') {
      const result = generatePredictions(refDistance.meters, timeSeconds, unit)
      predictions = result.predictions
      vdot = result.vdot
    } else {
      predictions = generateRiegelPredictions(refDistance.meters, timeSeconds, unit)
    }
  }

  return (
    <div className="perf-prediction">
      <header className="perf-prediction__header">
        <h1 className="perf-prediction__title">{t('perfPrediction.title')}</h1>
        <UnitToggle value={unit} onChange={setUnit} />
      </header>

      {/* Model tabs */}
      <div className="perf-prediction__tabs" role="tablist">
        {MODELS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={model === m.id}
            className={`perf-prediction__tab${model === m.id ? ' perf-prediction__tab--active' : ''}`}
            onClick={() => setModel(m.id)}
            type="button"
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="perf-prediction__subtitle">{activeModel.description}</p>

      <div className="perf-prediction__inputs">
        <div className="perf-prediction__select-wrap">
          <label className="perf-prediction__select-label">{t('perfPrediction.referenceDistanceLabel')}</label>
          <select
            className="perf-prediction__select"
            value={distanceIdx}
            onChange={(e) => setDistanceIdx(Number(e.target.value))}
          >
            {PREDICTION_DISTANCES.map((d, i) => (
              <option key={d.label} value={i}>{d.label}</option>
            ))}
          </select>
        </div>

        <NumericInput
          label={t('perfPrediction.raceTimeLabel')}
          value={timeInput}
          onChange={setTimeInput}
          placeholder={t('perfPrediction.raceTimePlaceholder')}
          hint={t('perfPrediction.raceTimeHint')}
          error={isTimeError}
          inputMode="text"
        />
      </div>

      {isValid && model === 'daniels' && vdot > 0 && (
        <div className="perf-prediction__vdot">
          <span className="perf-prediction__vdot-label">{t('perfPrediction.vdotLabel')}</span>
          <span className="perf-prediction__vdot-value">{vdot.toFixed(1)}</span>
        </div>
      )}

      <PredictionTable
        predictions={predictions}
        unit={unit}
        highlightMeters={refDistance.meters}
      />
    </div>
  )
}
