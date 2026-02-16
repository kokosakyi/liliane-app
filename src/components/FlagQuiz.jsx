import { useState, useCallback, useMemo } from 'react'
import Feedback from './Feedback'
import { generateQuizBatch, getContinents } from '../utils/countryUtils'
import { getFlagUrl } from '../utils/flagLoader'

function FlagQuiz({ onBack }) {
  const [quizType, setQuizType] = useState('flagToName')
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const continents = useMemo(() => ['All', ...getContinents()], [])

  const startQuiz = useCallback(() => {
    const newQuestions = generateQuizBatch(quizType, selectedContinent, 10)
    if (newQuestions.length > 0) {
      setQuestions(newQuestions)
      setCurrentIndex(0)
      setScore(0)
      setIsComplete(false)
      setQuizStarted(true)
    }
  }, [quizType, selectedContinent])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (choice) => {
    const isCorrect = choice.isCorrect
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    setFeedback({ isCorrect, correctAnswer: currentQuestion.correctAnswer })
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
    startQuiz()
  }

  const handleBackToSetup = () => {
    setQuizStarted(false)
    setQuestions([])
    setIsComplete(false)
  }

  // Quiz setup screen
  if (!quizStarted) {
    return (
      <div className="flag-quiz">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={onBack}>
            ← Back
          </button>
          <h2 className="section-title">Flag Quiz 🎯</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="quiz-setup">
          <div className="setup-section">
            <h3 className="setup-label">Quiz Type</h3>
            <div className="quiz-type-selector">
              <button
                className={`quiz-type-btn ${quizType === 'flagToName' ? 'active' : ''}`}
                onClick={() => setQuizType('flagToName')}
              >
                🏳️ → Name
                <span className="quiz-type-desc">See flag, pick country</span>
              </button>
              <button
                className={`quiz-type-btn ${quizType === 'nameToFlag' ? 'active' : ''}`}
                onClick={() => setQuizType('nameToFlag')}
              >
                Name → 🏳️
                <span className="quiz-type-desc">See country, pick flag</span>
              </button>
              <button
                className={`quiz-type-btn ${quizType === 'capital' ? 'active' : ''}`}
                onClick={() => setQuizType('capital')}
              >
                🏛️ Capitals
                <span className="quiz-type-desc">See country, pick capital</span>
              </button>
            </div>
          </div>

          <div className="setup-section">
            <h3 className="setup-label">Region</h3>
            <div className="continent-filter">
              {continents.map(continent => (
                <button
                  key={continent}
                  className={`continent-btn ${selectedContinent === continent ? 'active' : ''}`}
                  onClick={() => setSelectedContinent(continent)}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-green btn-large" onClick={startQuiz}>
            Start Quiz!
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="flag-quiz">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={handleBackToSetup}>
            ← Back
          </button>
          <h2 className="section-title">Flag Quiz 🎯</h2>
          <div style={{ width: '80px' }}></div>
        </div>
        <div className="chalk-text">
          Not enough countries in this region for a quiz. Please select a different region.
        </div>
        <button className="btn btn-back" onClick={handleBackToSetup}>
          Choose Another Region
        </button>
      </div>
    )
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="completion-screen">
        <h2 className="title">All Done!</h2>
        <div className="score-display" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
          You got {score} out of {questions.length} correct!
        </div>
        <div className="feedback-icon" style={{ fontSize: '4rem', marginBottom: '15px' }}>
          {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '💪'}
        </div>
        <div className="section-buttons">
          <button className="btn btn-green" onClick={handleRestart}>
            Play Again
          </button>
          <button className="btn btn-blue" onClick={handleBackToSetup}>
            Change Settings
          </button>
          <button className="btn btn-back" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flag-quiz">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={handleBackToSetup}>
          ← Back
        </button>
        <h2 className="section-title">Flag Quiz 🎯</h2>
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
      <div className="quiz-question">
        {currentQuestion.type === 'flagToName' && (
          <>
            <p className="question-prompt">Which country has this flag?</p>
            <div className="quiz-flag-display">
              <img 
                src={getFlagUrl(currentQuestion.flag)} 
                alt="Mystery flag"
                className="quiz-flag"
              />
            </div>
            <div className="quiz-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  className="btn quiz-choice-btn"
                  onClick={() => handleAnswer(choice)}
                  disabled={feedback !== null}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.type === 'nameToFlag' && (
          <>
            <p className="question-prompt">Which flag belongs to <strong>{currentQuestion.countryName}</strong>?</p>
            <div className="quiz-flag-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  className="flag-choice-btn"
                  onClick={() => handleAnswer(choice)}
                  disabled={feedback !== null}
                >
                  <img 
                    src={getFlagUrl(choice.flag)} 
                    alt={`Flag option ${index + 1}`}
                    className="flag-choice-img"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.type === 'capital' && (
          <>
            <p className="question-prompt">What is the capital of <strong>{currentQuestion.countryName}</strong>?</p>
            <div className="quiz-flag-display">
              <img 
                src={getFlagUrl(currentQuestion.flag)} 
                alt={`Flag of ${currentQuestion.countryName}`}
                className="quiz-flag"
              />
            </div>
            <div className="quiz-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  className="btn quiz-choice-btn"
                  onClick={() => handleAnswer(choice)}
                  disabled={feedback !== null}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

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

export default FlagQuiz
