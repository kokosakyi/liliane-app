function Question({ question, showVisuals = true }) {
  // Render visual aids (objects to count)
  const renderVisualAids = () => {
    if (!showVisuals) return null

    const { num1, num2, type, visualItem } = question

    if (type === 'story') {
      // For story problems, show two groups to match the story
      if (question.operation === 'addition') {
        // Show first group + second group
        return (
          <div className="visual-aids story-visual">
            <div className="visual-group">
              {Array(num1).fill(null).map((_, i) => (
                <span key={`a-${i}`} className="visual-item">
                  {visualItem}
                </span>
              ))}
            </div>
            <span className="operator-display">+</span>
            <div className="visual-group">
              {Array(num2).fill(null).map((_, i) => (
                <span key={`b-${i}`} className="visual-item">
                  {visualItem}
                </span>
              ))}
            </div>
          </div>
        )
      } else {
        // Subtraction: show starting amount with some crossed out
        return (
          <div className="visual-aids story-visual">
            <div className="visual-group">
              {Array(num1).fill(null).map((_, i) => (
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

    // For addition/subtraction, show two groups
    return (
      <div className="visual-aids">
        <div className="visual-group">
          {Array(num1).fill(null).map((_, i) => (
            <span 
              key={`a-${i}`} 
              className={`visual-item ${type === 'subtraction' && i >= num1 - num2 ? 'crossed' : ''}`}
            >
              {visualItem}
            </span>
          ))}
        </div>
        
        {type === 'addition' && (
          <>
            <span className="operator-display">+</span>
            <div className="visual-group">
              {Array(num2).fill(null).map((_, i) => (
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

  return (
    <div className="question-container">
      {question.type === 'story' ? (
        <p className="story-text">{question.story}</p>
      ) : (
        <div className="math-expression">{question.expression}</div>
      )}
      
      {renderVisualAids()}
    </div>
  )
}

export default Question
