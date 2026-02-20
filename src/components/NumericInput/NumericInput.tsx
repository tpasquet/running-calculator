import './NumericInput.scss'

interface NumericInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  error?: boolean
  inputMode?: 'decimal' | 'numeric' | 'text'
}

export function NumericInput({ label, value, onChange, placeholder, hint, error, inputMode = 'decimal' }: NumericInputProps) {
  return (
    <div className={`numeric-input${error ? ' numeric-input--error' : ''}`}>
      <label className="numeric-input__label">{label}</label>
      <input
        className="numeric-input__field"
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <span className="numeric-input__hint">{hint}</span>}
    </div>
  )
}
