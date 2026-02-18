import './UnitToggle.scss'
import type { Unit } from '../../utils/paceSpeed'

interface UnitToggleProps {
  value: Unit
  onChange: (unit: Unit) => void
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="unit-toggle" role="group" aria-label="Unit of measure">
      <button
        className={`unit-toggle__option${value === 'km' ? ' unit-toggle__option--active' : ''}`}
        onClick={() => onChange('km')}
        type="button"
      >
        km
      </button>
      <button
        className={`unit-toggle__option${value === 'mile' ? ' unit-toggle__option--active' : ''}`}
        onClick={() => onChange('mile')}
        type="button"
      >
        mile
      </button>
    </div>
  )
}
