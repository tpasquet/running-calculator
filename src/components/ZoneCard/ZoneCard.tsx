import './ZoneCard.scss'
import type { TrainingZone } from '../../utils/trainingZones'
import { formatSpeedRange, formatPaceRange } from '../../utils/trainingZones'
import type { Unit } from '../../utils/paceSpeed'
import { useT } from '../../i18n/useT'

interface ZoneCardProps {
  zone: TrainingZone
  unit: Unit
}

export function ZoneCard({ zone, unit }: ZoneCardProps) {
  const t = useT()
  return (
    <div className="zone-card" style={{ '--zone-color': zone.color } as React.CSSProperties}>
      <div className="zone-card__bar" />
      <div className="zone-card__content">
        <div className="zone-card__header">
          <span className="zone-card__name">{t(zone.nameKey)}</span>
          <span className="zone-card__percent">
            {t('zoneCard.masPercent', { min: zone.minPercent, max: zone.maxPercent })}
          </span>
        </div>
        <p className="zone-card__description">{t(zone.descriptionKey)}</p>
        <div className="zone-card__stats">
          <span className="zone-card__stat">
            {formatPaceRange(zone.minPaceSeconds, zone.maxPaceSeconds, unit)}
          </span>
          <span className="zone-card__stat zone-card__stat--muted">
            {formatSpeedRange(zone.minSpeedKmh, zone.maxSpeedKmh, unit)}
          </span>
        </div>
      </div>
    </div>
  )
}
