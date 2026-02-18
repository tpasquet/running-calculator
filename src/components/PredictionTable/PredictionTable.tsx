import './PredictionTable.scss'
import type { PredictionResult } from '../../utils/jackDaniels'
import { formatTime, formatPace } from '../../utils/splitTimes'
import type { Unit } from '../../utils/paceSpeed'
import { useT } from '../../i18n/useT'

interface PredictionTableProps {
  predictions: PredictionResult[]
  unit: Unit
  highlightMeters?: number
}

export function PredictionTable({ predictions, unit, highlightMeters }: PredictionTableProps) {
  const t = useT()

  if (predictions.length === 0) {
    return <p className="prediction-table__empty">{t('predictionTable.emptyState')}</p>
  }

  const paceUnit = unit === 'km' ? 'min/km' : 'min/mi'

  return (
    <table className="prediction-table">
      <thead>
        <tr>
          <th className="prediction-table__th">{t('predictionTable.colDistance')}</th>
          <th className="prediction-table__th prediction-table__th--right">{t('predictionTable.colPredictedTime')}</th>
          <th className="prediction-table__th prediction-table__th--right">{t('predictionTable.colPace', { unit: paceUnit })}</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((p) => {
          const isRef = p.meters === highlightMeters
          return (
            <tr
              key={p.label}
              className={`prediction-table__row${isRef ? ' prediction-table__row--ref' : ''}`}
            >
              <td className="prediction-table__td prediction-table__td--label">
                {p.label}
                {isRef && <span className="prediction-table__ref-badge">{t('predictionTable.refBadge')}</span>}
              </td>
              <td className="prediction-table__td prediction-table__td--right">
                {formatTime(p.timeSeconds)}
              </td>
              <td className="prediction-table__td prediction-table__td--right prediction-table__td--muted">
                {formatPace(p.paceSeconds)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
