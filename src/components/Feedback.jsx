import { useEffect, useState } from 'react'

function Feedback({ isCorrect, onContinue }) {
  const [stars, setStars] = useState([])

  useEffect(() => {
    if (isCorrect) {
      // Generate random stars for celebration
      const newStars = Array(8).fill(null).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
      setStars(newStars)
    }

    // Auto-continue after delay
    const timer = setTimeout(() => {
      onContinue()
    }, isCorrect ? 1500 : 1200)

    return () => clearTimeout(timer)
  }, [isCorrect, onContinue])

  const successMessages = [
    'Great job!',
    'Awesome!',
    'You did it!',
    'Super!',
    'Wonderful!',
    'Amazing!',
    'Fantastic!'
  ]

  const tryAgainMessages = [
    'Try again!',
    'Almost!',
    'Keep trying!',
    'You can do it!'
  ]

  const getMessage = () => {
    const messages = isCorrect ? successMessages : tryAgainMessages
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="feedback-overlay" onClick={onContinue}>
      <div className={`feedback-content ${isCorrect ? 'feedback-success' : 'feedback-tryagain'}`}>
        {isCorrect && (
          <div className="stars-container">
            {stars.map((star) => (
              <span
                key={star.id}
                className="star"
                style={{
                  left: `${star.left}%`,
                  animationDelay: `${star.delay}s`
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        )}
        
        <div className="feedback-icon">
          {isCorrect ? '🎉' : '🤔'}
        </div>
        
        <div className="feedback-text">
          {getMessage()}
        </div>
      </div>
    </div>
  )
}

export default Feedback
