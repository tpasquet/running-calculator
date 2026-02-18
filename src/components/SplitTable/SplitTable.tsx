import './SplitTable.scss'
import type { SplitResult } from '../../utils/splitTimes'
import { formatTime, formatPace } from '../../utils/splitTimes'
import type { Unit } from '../../utils/paceSpeed'
import { useT } from '../../i18n/useT'

interface SplitTableProps {
  splits: SplitResult[]
  unit: Unit
}

export function SplitTable({ splits, unit }: SplitTableProps) {
  const t = useT()

  if (splits.length === 0) {
    return <p className="split-table__empty">{t('splitTable.emptyState')}</p>
  }

  const paceUnit = unit === 'km' ? 'min/km' : 'min/mi'

  return (
    <table className="split-table">
      <thead>
        <tr>
          <th className="split-table__th">{t('splitTable.colDistance')}</th>
          <th className="split-table__th split-table__th--right">{t('splitTable.colTime')}</th>
          <th className="split-table__th split-table__th--right">{t('splitTable.colPace', { unit: paceUnit })}</th>
        </tr>
      </thead>
      <tbody>
        {splits.map((split) => (
          <tr key={split.distance.label} className="split-table__row">
            <td className="split-table__td split-table__td--label">{split.distance.label}</td>
            <td className="split-table__td split-table__td--right">{formatTime(split.timeSeconds)}</td>
            <td className="split-table__td split-table__td--right split-table__td--muted">
              {formatPace(split.paceSeconds)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
