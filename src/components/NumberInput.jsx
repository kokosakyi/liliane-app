import { useState } from 'react'

function NumberInput({ onSubmit, disabled, maxDigits = 2 }) {
  const [value, setValue] = useState('')

  const handleNumberClick = (num) => {
    if (value.length < maxDigits) {
      setValue(prev => prev + num)
    }
  }

  const handleClear = () => {
    setValue('')
  }

  const handleSubmit = () => {
    if (value !== '') {
      onSubmit(parseInt(value, 10))
      setValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value !== '') {
      handleSubmit()
    }
  }

  return (
    <div className="number-input-container">
      <input
        type="text"
        className="number-input"
        value={value}
        readOnly
        placeholder="?"
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="num-btn"
            onClick={() => handleNumberClick(num.toString())}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
        
        <button 
          className="num-btn clear" 
          onClick={handleClear}
          disabled={disabled}
        >
          ✕
        </button>
        
        <button
          className="num-btn"
          onClick={() => handleNumberClick('0')}
          disabled={disabled}
        >
          0
        </button>
        
        <button 
          className="num-btn submit" 
          onClick={handleSubmit}
          disabled={disabled || value === ''}
        >
          ✓
        </button>
      </div>
    </div>
  )
}

export default NumberInput
