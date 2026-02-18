import { useState } from 'react'
import './TrainingZones.scss'
import { NumericInput } from '../../components/NumericInput/NumericInput'
import { UnitToggle } from '../../components/UnitToggle/UnitToggle'
import { ZoneCard } from '../../components/ZoneCard/ZoneCard'
import type { Unit } from '../../utils/paceSpeed'
import { computeTrainingZones } from '../../utils/trainingZones'
import { useSettingsContext } from '../../store/settings'
import { useT } from '../../i18n/useT'

export function TrainingZones() {
  const t = useT()
  const { settings } = useSettingsContext()
  const [unit, setUnit] = useState<Unit>(settings.unit)
  const [masInput, setMasInput] = useState(
    settings.mas !== null ? String(settings.mas) : ''
  )

  const mas = parseFloat(masInput)
  const isValid = !isNaN(mas) && mas > 0
  const isMasError = masInput !== '' && !isValid

  const zones = isValid ? computeTrainingZones(mas, unit) : []

  return (
    <div className="training-zones">
      <header className="training-zones__header">
        <h1 className="training-zones__title">{t('trainingZones.title')}</h1>
        <UnitToggle value={unit} onChange={setUnit} />
      </header>

      <NumericInput
        label={t('trainingZones.masLabel')}
        value={masInput}
        onChange={setMasInput}
        placeholder={t('trainingZones.masPlaceholder')}
        hint={t('trainingZones.masHint')}
        error={isMasError}
      />

      {!isValid && (
        <p className="training-zones__empty">{t('trainingZones.emptyState')}</p>
      )}

      {isValid && (
        <div className="training-zones__zones">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} unit={unit} />
          ))}
        </div>
      )}
    </div>
  )
}
