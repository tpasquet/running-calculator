import './ZoneCard.scss'
import type { Unit } from '../../utils/paceSpeed'
import { useT } from '../../i18n/useT'

interface ZoneCardProps {
  zone: {
    color: string
    nameKey: string
    descriptionKey: string
  }
  unit: Unit
  badge: string
  speedRange?: string
  paceRange?: string
  hrRange?: string
}

export function ZoneCard({ zone, badge, speedRange, paceRange, hrRange }: ZoneCardProps) {
  const t = useT()
  return (
    <div className="zone-card" style={{ '--zone-color': zone.color } as React.CSSProperties}>
      <div className="zone-card__bar" />
      <div className="zone-card__content">
        <div className="zone-card__header">
          <span className="zone-card__name">{t(zone.nameKey)}</span>
          <span className="zone-card__percent">{badge}</span>
        </div>
        <p className="zone-card__description">{t(zone.descriptionKey)}</p>
        <div className="zone-card__stats">
          {hrRange && (
            <span className="zone-card__stat">{hrRange}</span>
          )}
          {paceRange && (
            <span className="zone-card__stat">{paceRange}</span>
          )}
          {speedRange && (
            <span className="zone-card__stat zone-card__stat--muted">{speedRange}</span>
          )}
        </div>
      </div>
    </div>
  )
}
