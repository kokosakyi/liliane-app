import { speakText } from '../utils/soundManager'

function Question({ question, showVisuals = true }) {
  const renderVisualAids = () => {
    if (!showVisuals) return null

    const { num1, num2, type, visualItem } = question

    if (type === 'story') {
      if (question.operation === 'addition') {
        return (
          <div className="visual-aids story-visual">
            <div className="visual-group">
              {Array(num1)
                .fill(null)
                .map((_, i) => (
                  <span key={`a-${i}`} className="visual-item">
                    {visualItem}
                  </span>
                ))}
            </div>
            <span className="operator-display">+</span>
            <div className="visual-group">
              {Array(num2)
                .fill(null)
                .map((_, i) => (
                  <span key={`b-${i}`} className="visual-item">
                    {visualItem}
                  </span>
                ))}
            </div>
          </div>
        )
      } else {
        return (
          <div className="visual-aids story-visual">
            <div className="visual-group">
              {Array(num1)
                .fill(null)
                .map((_, i) => (
                  <span
                    key={`a-${i}`}
                    className={`visual-item ${i >= num1 - num2 ? 'crossed' : ''}`}
                  >
                    {visualItem}
                  </span>
                ))}
            </div>
          </div>
        )
      }
    }

    return (
      <div className="visual-aids">
        <div className="visual-group">
          {Array(num1)
            .fill(null)
            .map((_, i) => (
              <span
                key={`a-${i}`}
                className={`visual-item ${
                  type === 'subtraction' && i >= num1 - num2 ? 'crossed' : ''
                }`}
              >
                {visualItem}
              </span>
            ))}
        </div>

        {type === 'addition' && (
          <>
            <span className="operator-display">+</span>
            <div className="visual-group">
              {Array(num2)
                .fill(null)
                .map((_, i) => (
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

  const spokenText = question.type === 'story' ? question.story : question.expression

  return (
    <div className="question-container">
      <div className="question-header-with-speaker">
        {question.type === 'story' ? (
          <p className="story-text">{question.story}</p>
        ) : (
          <div className="math-expression">{question.expression}</div>
        )}
        <button
          type="button"
          className="btn-icon-speaker"
          onClick={() => speakText(spokenText)}
          title="Tap to hear question"
          aria-label="Read question aloud"
        >
          🔊
        </button>
      </div>

      {renderVisualAids()}
    </div>
  )
}

export default Question
