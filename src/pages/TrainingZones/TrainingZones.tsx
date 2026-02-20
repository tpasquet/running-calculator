import { useState } from 'react'
import './TrainingZones.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import { ZoneCard } from '../../components/ZoneCard/ZoneCard'
import type { Unit } from '../../utils/paceSpeed'
import { computeTrainingZones, formatSpeedRange, formatPaceRange } from '../../utils/trainingZones'
import { computeDanielsZones, formatDanielsSpeedRange, formatDanielsPaceRange } from '../../utils/danielsZones'
import { computeHeartRateZones } from '../../utils/heartRateZones'
import { RPE_ZONES, BORG_ZONES } from '../../utils/rpeZones'
import { useSettingsContext } from '../../store/settings'
import { useT } from '../../i18n/useT'

type ZoneModel = 'mas' | 'daniels' | 'hr' | 'rpe' | 'borg'

export function TrainingZones() {
  const t = useT()
  const { settings } = useSettingsContext()
  const [model, setModel] = useState<ZoneModel>('mas')
  const [unit, setUnit] = useState<Unit>(settings.unit)

  // MAS inputs
  const [masInput, setMasInput] = useState(settings.mas !== null ? String(settings.mas) : '')
  const mas = parseFloat(masInput)
  const isMasValid = !isNaN(mas) && mas > 0
  const isMasError = masInput !== '' && !isMasValid

  // HR inputs
  const [maxHrInput, setMaxHrInput] = useState(settings.maxHr !== null ? String(settings.maxHr) : '')
  const [restingHrInput, setRestingHrInput] = useState(settings.restingHr !== null ? String(settings.restingHr) : '')
  const maxHr = parseInt(maxHrInput)
  const restingHr = parseInt(restingHrInput)
  const isHrValid = !isNaN(maxHr) && !isNaN(restingHr) && maxHr > restingHr && restingHr > 0
  const isMaxHrError = maxHrInput !== '' && (isNaN(maxHr) || maxHr <= 0)
  const isRestingHrError = restingHrInput !== '' && (isNaN(restingHr) || restingHr <= 0 || restingHr >= maxHr)

  const masZones = isMasValid ? computeTrainingZones(mas, unit) : []
  const danielsZones = isMasValid ? computeDanielsZones(mas, unit) : []
  const hrZones = isHrValid ? computeHeartRateZones(maxHr, restingHr) : []

  const MODELS: { id: ZoneModel; label: string }[] = [
    { id: 'mas', label: t('trainingZones.modelMas') },
    { id: 'daniels', label: t('trainingZones.modelDaniels') },
    { id: 'hr', label: t('trainingZones.modelHr') },
    { id: 'rpe', label: t('trainingZones.modelRpe') },
    { id: 'borg', label: t('trainingZones.modelBorg') },
  ]

  return (
    <div className="training-zones">
      <header className="training-zones__header">
        <h1 className="training-zones__title">{t('trainingZones.title')}</h1>
        {model !== 'hr' && model !== 'rpe' && model !== 'borg' && <UnitToggle value={unit} onChange={setUnit} />}
      </header>

      <div className="training-zones__tabs" role="tablist">
        {MODELS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={model === m.id}
            type="button"
            className={`training-zones__tab${model === m.id ? ' training-zones__tab--active' : ''}`}
            onClick={() => setModel(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {(model === 'mas' || model === 'daniels') && (
        <>
          <NumericInput
            label={t('trainingZones.masLabel')}
            value={masInput}
            onChange={setMasInput}
            placeholder={t('trainingZones.masPlaceholder')}
            hint={t('trainingZones.masHint')}
            error={isMasError}
          />
          {!isMasValid && <p className="training-zones__empty">{t('trainingZones.emptyState')}</p>}
          {isMasValid && (
            <div className="training-zones__zones">
              {model === 'mas' && masZones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} unit={unit}
                  speedRange={formatSpeedRange(zone.minSpeedKmh, zone.maxSpeedKmh, unit)}
                  paceRange={formatPaceRange(zone.minPaceSeconds, zone.maxPaceSeconds, unit)}
                  badge={`${zone.minPercent}–${zone.maxPercent}%`}
                />
              ))}
              {model === 'daniels' && danielsZones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} unit={unit}
                  speedRange={formatDanielsSpeedRange(zone.minSpeedKmh, zone.maxSpeedKmh, unit)}
                  paceRange={formatDanielsPaceRange(zone.minPaceSeconds, zone.maxPaceSeconds, unit)}
                  badge={`${zone.minPercent}–${zone.maxPercent}%`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {model === 'rpe' && (
        <div className="training-zones__zones">
          {RPE_ZONES.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              unit={unit}
              badge={String(zone.level)}
            />
          ))}
        </div>
      )}

      {model === 'borg' && (
        <div className="training-zones__zones">
          {BORG_ZONES.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              unit={unit}
              badge={String(zone.level)}
            />
          ))}
        </div>
      )}

      {model === 'hr' && (
        <>
          <NumericInput
            label={t('trainingZones.hrMaxLabel')}
            value={maxHrInput}
            onChange={setMaxHrInput}
            placeholder={t('trainingZones.hrMaxPlaceholder')}
            error={isMaxHrError}
          />
          <NumericInput
            label={t('trainingZones.hrRestingLabel')}
            value={restingHrInput}
            onChange={setRestingHrInput}
            placeholder={t('trainingZones.hrRestingPlaceholder')}
            error={isRestingHrError}
          />
          {!isHrValid && <p className="training-zones__empty">{t('trainingZones.hrEmptyState')}</p>}
          {isHrValid && (
            <div className="training-zones__zones">
              {hrZones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} unit={unit}
                  speedRange={undefined}
                  paceRange={undefined}
                  badge={`${zone.minPercent}–${zone.maxPercent}%`}
                  hrRange={t('trainingZones.hrZoneRange', { min: zone.minBpm, max: zone.maxBpm })}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
