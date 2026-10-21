import { useEffect, useState } from 'react'
import { playSfx } from '../utils/soundManager'

function NumberPad({ onSubmit, disabled = false, soundEnabled = true, questionKey }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue('')
  }, [questionKey])

  const handleDigit = (digit) => {
    if (disabled) return
    playSfx('tap', soundEnabled)
    setValue((prev) => (prev.length < 2 ? `${prev}${digit}` : prev))
  }

  const handleBackspace = () => {
    if (disabled) return
    playSfx('tap', soundEnabled)
    setValue((prev) => prev.slice(0, -1))
  }

  const handleSubmit = () => {
    if (disabled || value === '') return
    onSubmit(Number(value))
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (disabled) return
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        setValue((prev) => (prev.length < 2 ? `${prev}${e.key}` : prev))
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        setValue((prev) => prev.slice(0, -1))
      } else if (e.key === 'Enter' && value !== '') {
        e.preventDefault()
        onSubmit(Number(value))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [disabled, value, onSubmit])

  return (
    <div className="numpad-container">
      <div className="numpad-display">
        {value !== '' ? value : <span className="numpad-placeholder">?</span>}
      </div>

      <div className="numpad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            className="btn numpad-btn"
            onClick={() => handleDigit(digit)}
            disabled={disabled}
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-pink numpad-btn"
          onClick={handleBackspace}
          disabled={disabled || value === ''}
          aria-label="Backspace"
        >
          ⌫
        </button>

        <button
          type="button"
          className="btn numpad-btn"
          onClick={() => handleDigit(0)}
          disabled={disabled}
        >
          0
        </button>

        <button
          type="button"
          className="btn btn-green numpad-btn numpad-check"
          onClick={handleSubmit}
          disabled={disabled || value === ''}
          aria-label="Submit answer"
        >
          ✓
        </button>
      </div>
    </div>
  )
}

export default NumberPad
