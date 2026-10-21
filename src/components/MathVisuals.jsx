function SingleTenFrame({ filledA = 0, filledB = 0, showMissingQuestion = false, emoji = '⭐' }) {
  const cells = Array.from({ length: 10 }, (_, idx) => {
    if (idx < filledA) {
      return { type: 'groupA', content: emoji }
    }
    if (idx < filledA + filledB) {
      return {
        type: showMissingQuestion ? 'missing' : 'groupB',
        content: showMissingQuestion ? '❓' : '🔵',
      }
    }
    return { type: 'empty', content: '' }
  })

  return (
    <div className="ten-frame-grid" role="img" aria-label="Ten frame visual aid">
      {cells.map((cell, i) => (
        <div key={i} className={`ten-frame-cell cell-${cell.type}`}>
          <span className="ten-frame-token">{cell.content}</span>
        </div>
      ))}
    </div>
  )
}

function NumberLineVisual({ num1, num2, operation = 'addition', showHint = false }) {
  const numbers = Array.from({ length: 11 }, (_, i) => i)
  const target = operation === 'addition' ? num1 + num2 : num1 - num2
  const steps = Array.from({ length: num2 }, (_, idx) =>
    operation === 'addition' ? num1 + idx : num1 - idx,
  )

  return (
    <div className="number-line-wrap">
      <div className="number-line-track">
        {numbers.map((n) => {
          const isStart = n === num1
          const isEnd = showHint && n === target
          const isHopMid =
            operation === 'addition'
              ? n > num1 && n <= target
              : n < num1 && n >= target

          return (
            <div
              key={n}
              className={`nl-point ${isStart ? 'nl-start' : ''} ${isEnd ? 'nl-end' : ''} ${
                isHopMid ? 'nl-hop-step' : ''
              }`}
            >
              {isStart && <span className="nl-badge">Start</span>}
              {isEnd && <span className="nl-badge nl-badge-answer">Here!</span>}
              <div className="nl-tick" />
              <div className="nl-num">{n}</div>
            </div>
          )
        })}
      </div>
      <div className="nl-caption">
        Start at <strong>{num1}</strong> and hop{' '}
        <strong>
          {num2} step{num2 > 1 ? 's' : ''} {operation === 'addition' ? 'forward →' : 'backward ←'}
        </strong>
        {showHint && (
          <span>
            {' '}
            ({steps.map((s) => `${s} → `).join('')}
            <strong>{target}</strong>)
          </span>
        )}
      </div>
    </div>
  )
}

function PlaceValueVisual({ tens = 0, ones = 0 }) {
  return (
    <div className="place-value-visual">
      <div className="pv-group">
        <div className="pv-label">{tens} Tens ({tens * 10})</div>
        <div className="pv-rods">
          {Array.from({ length: tens }, (_, i) => (
            <div key={i} className="pv-ten-rod" title="Ten Rod (10)" />
          ))}
        </div>
      </div>

      <div className="pv-group">
        <div className="pv-label">{ones} Ones ({ones})</div>
        <div className="pv-ones">
          {Array.from({ length: ones }, (_, i) => (
            <div key={i} className="pv-one-cube" title="One Cube (1)" />
          ))}
        </div>
      </div>
    </div>
  )
}

function MultiplicationArrayVisual({ rows = 2, cols = 2, emoji = '⭐' }) {
  return (
    <div className="mult-array-wrap">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="mult-array-row">
          <span className="mult-row-label">Row {r + 1}:</span>
          {Array.from({ length: cols }, (_, c) => (
            <span key={c} className="mult-array-item">
              {emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function FractionVisual({ num = 1, den = 4 }) {
  return (
    <div className="fraction-visual-wrap">
      <div className="fraction-bar">
        {Array.from({ length: den }, (_, idx) => (
          <div
            key={idx}
            className={`fraction-segment ${idx < num ? 'seg-filled' : 'seg-empty'}`}
          >
            1/{den}
          </div>
        ))}
      </div>
      <div className="fraction-caption">
        <strong>{num}</strong> shaded out of <strong>{den}</strong> equal parts
      </div>
    </div>
  )
}

function AnalogClockVisual({ hour = 3, minute = 0 }) {
  const minuteAngle = minute * 6
  const hourAngle = (hour % 12) * 30 + minute * 0.5

  return (
    <div className="clock-visual-wrap">
      <svg viewBox="0 0 120 120" className="clock-svg" role="img" aria-label="Analog clock">
        <circle cx="60" cy="60" r="54" fill="#fffdf7" stroke="#f59e0b" strokeWidth="5" />
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, idx) => {
          const rad = ((idx * 30 - 90) * Math.PI) / 180
          const x = 60 + 41 * Math.cos(rad)
          const y = 60 + 41 * Math.sin(rad) + 4
          return (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#1e293b"
            >
              {n}
            </text>
          )
        })}
        {/* Hour hand */}
        <line
          x1="60"
          y1="60"
          x2={60 + 26 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={60 - 26 * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="#ef4444"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="60"
          y1="60"
          x2={60 + 38 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={60 - 38 * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="#2563eb"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="60" r="4" fill="#1e293b" />
      </svg>
    </div>
  )
}

function CoinsVisual({ coins = {} }) {
  const { quarters = 0, dimes = 0, nickels = 0, pennies = 0 } = coins
  const list = [
    ...Array(quarters).fill({ label: '25¢', cls: 'coin-25', name: 'Quarter' }),
    ...Array(dimes).fill({ label: '10¢', cls: 'coin-10', name: 'Dime' }),
    ...Array(nickels).fill({ label: '5¢', cls: 'coin-5', name: 'Nickel' }),
    ...Array(pennies).fill({ label: '1¢', cls: 'coin-1', name: 'Penny' }),
  ]

  return (
    <div className="coins-visual-wrap">
      {list.map((c, idx) => (
        <div key={idx} className={`coin-circle ${c.cls}`} title={c.name}>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

function MathVisuals({ question, showHint = false }) {
  if (!question || question.visualType === 'none') return null

  const {
    visualType,
    num1 = 0,
    num2 = 0,
    operation = 'addition',
    visualItem = '⭐',
  } = question

  if (visualType === 'ten-frame') {
    return (
      <div className="math-visual-box">
        <SingleTenFrame filledA={num1} filledB={num2} emoji={visualItem} />
      </div>
    )
  }

  if (visualType === 'ten-frame-missing') {
    return (
      <div className="math-visual-box">
        <SingleTenFrame
          filledA={num1}
          filledB={showHint ? num2 : 0}
          showMissingQuestion={showHint}
          emoji={visualItem}
        />
      </div>
    )
  }

  if (visualType === 'ten-frame-double') {
    const total = num1 + num2
    const frame1A = Math.min(10, num1)
    const frame1B = Math.max(0, Math.min(10 - frame1A, num2))
    const remA = Math.max(0, num1 - 10)
    const remB = Math.max(0, total - 10 - remA)

    return (
      <div className="math-visual-box double-ten-frame">
        <SingleTenFrame filledA={frame1A} filledB={frame1B} emoji={visualItem} />
        <SingleTenFrame filledA={remA} filledB={remB} emoji={visualItem} />
      </div>
    )
  }

  if (visualType === 'number-line') {
    return (
      <div className="math-visual-box">
        <NumberLineVisual
          num1={num1}
          num2={num2}
          operation={operation}
          showHint={showHint}
        />
      </div>
    )
  }

  if (visualType === 'place-value') {
    return (
      <div className="math-visual-box">
        <PlaceValueVisual tens={question.tens} ones={question.ones} />
      </div>
    )
  }

  if (visualType === 'mult-array') {
    return (
      <div className="math-visual-box">
        <MultiplicationArrayVisual
          rows={question.rows}
          cols={question.cols}
          emoji={visualItem}
        />
      </div>
    )
  }

  if (visualType === 'fraction') {
    return (
      <div className="math-visual-box">
        <FractionVisual num={question.fractionNum} den={question.fractionDen} />
      </div>
    )
  }

  if (visualType === 'clock') {
    return (
      <div className="math-visual-box">
        <AnalogClockVisual hour={question.clockHour} minute={question.clockMinute} />
      </div>
    )
  }

  if (visualType === 'coins') {
    return (
      <div className="math-visual-box">
        <CoinsVisual coins={question.coins} />
      </div>
    )
  }

  if (visualType === 'story-scene' && question.sceneImage) {
    return (
      <div className="math-visual-box">
        <img
          src={question.sceneImage}
          alt="Story adventure illustration"
          className="story-scene-banner"
        />
      </div>
    )
  }

  if (visualType === 'comparison') {
    return (
      <div className="math-visual-box comparison-visual">
        <div className="comparison-side">
          <div className="comparison-count">{num1}</div>
          {num1 <= 12 && (
            <div className="visual-group">
              {Array.from({ length: num1 }, (_, i) => (
                <span key={i} className="visual-item">
                  {visualItem}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="comparison-vs">VS</div>
        <div className="comparison-side">
          <div className="comparison-count">{num2}</div>
          {num2 <= 12 && (
            <div className="visual-group">
              {Array.from({ length: num2 }, (_, i) => (
                <span key={i} className="visual-item">
                  {visualItem}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default: emoji-groups (for numbers <= 20)
  if (num1 > 20) return null

  return (
    <div className="visual-aids">
      <div className="visual-group">
        {Array.from({ length: num1 }, (_, i) => (
          <span
            key={`a-${i}`}
            className={`visual-item ${
              operation === 'subtraction' && i >= num1 - num2 ? 'crossed' : ''
            }`}
          >
            {visualItem}
          </span>
        ))}
      </div>

      {operation === 'addition' && num2 > 0 && num2 <= 15 && (
        <>
          <span className="operator-display">+</span>
          <div className="visual-group">
            {Array.from({ length: num2 }, (_, i) => (
              <span key={`b-${i}`} className="visual-item">
                {visualItem}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MathVisuals
