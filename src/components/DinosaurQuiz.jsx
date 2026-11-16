import { useState, useCallback, useMemo } from 'react'
import Feedback from './Feedback'
import { generateDinoQuizBatch, getDinosaurCategories } from '../utils/dinosaurUtils'
import { playSfx, speakText } from '../utils/soundManager'

function DinosaurQuiz({ onBack, soundEnabled = true, onEarnBonusStars }) {
  const [quizType, setQuizType] = useState('imageToName')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const categories = useMemo(() => ['All', ...getDinosaurCategories()], [])

  const startQuiz = useCallback(() => {
    playSfx('tap', soundEnabled)
    const count = selectedCategory === 'All' ? 8 : 4
    const newQuestions = generateDinoQuizBatch(quizType, selectedCategory, count)
    if (newQuestions.length > 0) {
      setQuestions(newQuestions)
      setCurrentIndex(0)
      setScore(0)
      setIsComplete(false)
      setQuizStarted(true)
    }
  }, [quizType, selectedCategory, soundEnabled])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (choice) => {
    const isCorrect = choice.isCorrect

    if (isCorrect) {
      playSfx('correct', soundEnabled)
      setScore((prev) => prev + 1)
    } else {
      playSfx('wrong', soundEnabled)
    }

    setFeedback({ isCorrect, correctAnswer: currentQuestion.correctAnswer })
  }

  const handleContinue = useCallback(() => {
    setFeedback(null)

    if (feedback?.isCorrect) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        playSfx('fanfare', soundEnabled)
        onEarnBonusStars?.(2)
        setIsComplete(true)
      }
    }
    // If incorrect, stay on same question (allow retry, matching FlagQuiz)
  }, [feedback, currentIndex, questions.length, soundEnabled, onEarnBonusStars])

  const handleRestart = () => {
    startQuiz()
  }

  const handleBackToSetup = () => {
    playSfx('tap', soundEnabled)
    setQuizStarted(false)
    setQuestions([])
    setIsComplete(false)
  }

  // Quiz setup screen
  if (!quizStarted) {
    return (
      <div className="flag-quiz dinosaur-quiz">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={onBack}>
            ← Back
          </button>
          <h2 className="section-title">Dinosaur Quiz 🎯</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="quiz-setup">
          <div className="setup-section">
            <h3 className="setup-label">Quiz Type</h3>
            <div className="quiz-type-selector">
              <button
                type="button"
                className={`quiz-type-btn ${quizType === 'imageToName' ? 'active' : ''}`}
                onClick={() => {
                  playSfx('tap', soundEnabled)
                  setQuizType('imageToName')
                }}
              >
                🦖 → Name
                <span className="quiz-type-desc">See dinosaur, pick name</span>
              </button>
              <button
                type="button"
                className={`quiz-type-btn ${quizType === 'nameToImage' ? 'active' : ''}`}
                onClick={() => {
                  playSfx('tap', soundEnabled)
                  setQuizType('nameToImage')
                }}
              >
                Name → 🦖
                <span className="quiz-type-desc">See name, pick picture</span>
              </button>
              <button
                type="button"
                className={`quiz-type-btn ${quizType === 'featureToName' ? 'active' : ''}`}
                onClick={() => {
                  playSfx('tap', soundEnabled)
                  setQuizType('featureToName')
                }}
              >
                🔍 Dino Clues
                <span className="quiz-type-desc">Read clue & pick dino</span>
              </button>
            </div>
          </div>

          <div className="setup-section">
            <h3 className="setup-label">Dinosaur Group</h3>
            <div className="continent-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`continent-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    playSfx('tap', soundEnabled)
                    setSelectedCategory(category)
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn-green btn-large" onClick={startQuiz}>
            Start Quiz!
          </button>
        </div>
      </div>
    )
  }

  // Fallback if not enough items
  if (questions.length === 0) {
    return (
      <div className="flag-quiz dinosaur-quiz">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={handleBackToSetup}>
            ← Back
          </button>
          <h2 className="section-title">Dinosaur Quiz 🎯</h2>
          <div style={{ width: '80px' }}></div>
        </div>
        <div className="chalk-text">
          Not enough dinosaurs in this group for a quiz. Please select a different group.
        </div>
        <button className="btn btn-back" onClick={handleBackToSetup}>
          Choose Another Group
        </button>
      </div>
    )
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="completion-screen">
        <h2 className="title">Dino Expert! 🦖</h2>
        <div className="score-display" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
          You identified {score} out of {questions.length} dinosaurs! (+2 ⭐ Bonus Stars)
        </div>
        <div className="feedback-icon" style={{ fontSize: '4rem', marginBottom: '15px' }}>
          {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '💪'}
        </div>
        <div className="section-buttons">
          <button type="button" className="btn btn-green" onClick={handleRestart}>
            Play Again
          </button>
          <button type="button" className="btn btn-blue" onClick={handleBackToSetup}>
            Change Settings
          </button>
          <button type="button" className="btn btn-back" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flag-quiz dinosaur-quiz">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={handleBackToSetup}>
          ← Back
        </button>
        <h2 className="section-title">Dinosaur Quiz 🎯</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Progress dots */}
      <div className="progress-container">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${
              index < currentIndex
                ? 'completed'
                : index === currentIndex
                  ? 'current'
                  : ''
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
        {currentQuestion.type === 'imageToName' && (
          <>
            <div className="question-header-with-speaker">
              <p className="question-prompt" style={{ marginBottom: 0 }}>
                Which dinosaur is this?
              </p>
              <button
                type="button"
                className="btn-icon-speaker btn-speaker-mini"
                onClick={() => speakText('Which dinosaur is this?')}
                title="Listen to question"
                aria-label="Listen to question"
              >
                🔊
              </button>
            </div>
            <div className="quiz-flag-display quiz-dino-display">
              <img
                src={currentQuestion.image}
                alt="Mystery dinosaur"
                className="quiz-dino-img"
                fetchpriority="high"
              />
            </div>
            <div className="quiz-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
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

        {currentQuestion.type === 'nameToImage' && (
          <>
            <div className="question-header-with-speaker" style={{ marginBottom: '12px' }}>
              <p className="question-prompt" style={{ marginBottom: 0 }}>
                Which picture shows the <strong>{currentQuestion.dinosaurName}</strong> (
                <em>“{currentQuestion.meaning}”</em>)?
              </p>
              <button
                type="button"
                className="btn-icon-speaker btn-speaker-mini"
                onClick={() =>
                  speakText(
                    `Which picture shows the ${currentQuestion.dinosaurName}, which means ${currentQuestion.meaning}?`,
                  )
                }
                title="Listen to question"
                aria-label="Listen to question"
              >
                🔊
              </button>
            </div>
            <div className="quiz-flag-choices quiz-dino-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
                  className="flag-choice-btn dino-choice-btn"
                  onClick={() => handleAnswer(choice)}
                  disabled={feedback !== null}
                >
                  <img
                    src={choice.image}
                    alt={`Dinosaur option ${index + 1}`}
                    className="flag-choice-img dino-choice-img"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.type === 'featureToName' && (
          <>
            <div className="question-header-with-speaker">
              <p className="question-prompt" style={{ marginBottom: 0 }}>
                Name means <strong>“{currentQuestion.meaning}”</strong> — {currentQuestion.feature}!
              </p>
              <button
                type="button"
                className="btn-icon-speaker btn-speaker-mini"
                onClick={() =>
                  speakText(
                    `Which dinosaur’s name means ${currentQuestion.meaning}, and has ${currentQuestion.feature}?`,
                  )
                }
                title="Listen to clue"
                aria-label="Listen to clue"
              >
                🔊
              </button>
            </div>
            <div className="quiz-flag-display quiz-dino-display">
              <img
                src={currentQuestion.image}
                alt="Clue dinosaur"
                className="quiz-dino-img"
                fetchpriority="high"
              />
            </div>
            <div className="quiz-choices">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
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
        <Feedback isCorrect={feedback.isCorrect} onContinue={handleContinue} />
      )}
    </div>
  )
}

export default DinosaurQuiz
