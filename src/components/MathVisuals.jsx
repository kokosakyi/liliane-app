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

function MathVisuals({ question, showHint = false }) {
  if (!question) return null

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

  if (visualType === 'comparison') {
    return (
      <div className="math-visual-box comparison-visual">
        <div className="comparison-side">
          <div className="comparison-count">{num1}</div>
          <div className="visual-group">
            {Array.from({ length: num1 }, (_, i) => (
              <span key={i} className="visual-item">
                {visualItem}
              </span>
            ))}
          </div>
        </div>
        <div className="comparison-vs">VS</div>
        <div className="comparison-side">
          <div className="comparison-count">{num2}</div>
          <div className="visual-group">
            {Array.from({ length: num2 }, (_, i) => (
              <span key={i} className="visual-item">
                {visualItem}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default: emoji-groups (addition / subtraction / story)
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

      {operation === 'addition' && num2 > 0 && (
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
