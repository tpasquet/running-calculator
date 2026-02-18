import './ResultDisplay.scss'

interface ResultDisplayProps {
  label: string
  value: string
  unit: string
}

export function ResultDisplay({ label, value, unit }: ResultDisplayProps) {
  return (
    <div className="result-display">
      <span className="result-display__label">{label}</span>
      <div className="result-display__value-row">
        <span className="result-display__value">{value}</span>
        <span className="result-display__unit">{unit}</span>
      </div>
    </div>
  )
}
