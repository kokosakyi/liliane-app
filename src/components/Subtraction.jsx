import { useState, useEffect, useCallback } from 'react'
import Question from './Question'
import MultipleChoice from './MultipleChoice'
import Feedback from './Feedback'
import { generateQuestionBatch } from '../utils/questionGenerator'

function Subtraction({ difficulty, onBack }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Generate new questions when component mounts or difficulty changes
    setQuestions(generateQuestionBatch('subtraction', difficulty, 10))
    setCurrentIndex(0)
    setScore(0)
    setIsComplete(false)
  }, [difficulty])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.answer
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    setFeedback({ isCorrect })
  }

  const handleContinue = useCallback(() => {
    setFeedback(null)
    
    if (feedback?.isCorrect) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsComplete(true)
      }
    }
    // If incorrect, stay on same question (allow retry)
  }, [feedback, currentIndex, questions.length])

  const handleRestart = () => {
    setQuestions(generateQuestionBatch('subtraction', difficulty, 10))
    setCurrentIndex(0)
    setScore(0)
    setIsComplete(false)
  }

  if (questions.length === 0) {
    return <div className="chalk-text">Loading...</div>
  }

  if (isComplete) {
    return (
      <div className="completion-screen">
        <h2 className="title">All Done!</h2>
        <div className="score-display" style={{ fontSize: '2rem', marginBottom: '30px' }}>
          You got {score} out of {questions.length} correct!
        </div>
        <div className="feedback-icon" style={{ fontSize: '5rem', marginBottom: '20px' }}>
          {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '💪'}
        </div>
        <div className="section-buttons">
          <button className="btn btn-green" onClick={handleRestart}>
            Play Again
          </button>
          <button className="btn btn-back" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="subtraction-section">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Subtraction ➖</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Progress dots */}
      <div className="progress-container">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${
              index < currentIndex ? 'completed' : 
              index === currentIndex ? 'current' : ''
            }`}
          />
        ))}
      </div>

      {/* Score */}
      <div className="score-display">
        Score: {score} / {questions.length}
      </div>

      {/* Question */}
      <Question question={currentQuestion} showVisuals={difficulty <= 2} />

      {/* Answer input */}
      <MultipleChoice
        choices={currentQuestion.choices}
        onSelect={handleAnswer}
        disabled={feedback !== null}
      />

      {/* Feedback overlay */}
      {feedback && (
        <Feedback
          isCorrect={feedback.isCorrect}
          onContinue={handleContinue}
        />
      )}
    </div>
  )
}

export default Subtraction
