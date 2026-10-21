import { useCallback, useEffect, useState } from 'react'
import MathVisuals from './MathVisuals'
import NumberPad from './NumberPad'
import LetterTileBuilder from './LetterTileBuilder'
import StudyBuddy from './StudyBuddy'
import Feedback from './Feedback'
import {
  ALL_NODES,
  STUDY_BUDDIES,
  generateDailyPracticeBatch,
  generateNodeQuestions,
} from '../utils/curriculumData'
import { playSfx, speakText, spellOutWord } from '../utils/soundManager'

function SkillSession({
  nodeId,
  isDailyPractice = false,
  mathFrontierId = 'math-1',
  readingFrontierId = 'read-1',
  buddyId = 'owl',
  soundEnabled = true,
  onCompleteNode,
  onCompleteDaily,
  onSelectNextNode,
  onBack,
}) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0)
  const [hadWrongAttemptOnCurrent, setHadWrongAttemptOnCurrent] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [buddyMessage, setBuddyMessage] = useState('')
  const [imageError, setImageError] = useState(false)
  const [sessionResult, setSessionResult] = useState(null)

  const nodeMeta = ALL_NODES.find((n) => n.id === nodeId)
  const buddy = STUDY_BUDDIES.find((b) => b.id === buddyId) || STUDY_BUDDIES[0]

  const startNewRound = useCallback(() => {
    const batch = isDailyPractice
      ? generateDailyPracticeBatch(mathFrontierId, readingFrontierId)
      : generateNodeQuestions(nodeId, 6)
    setQuestions(batch)
    setCurrentIndex(0)
    setFirstTryCorrectCount(0)
    setHadWrongAttemptOnCurrent(false)
    setShowHint(false)
    setFeedback(null)
    setImageError(false)
    setSessionResult(null)
    setBuddyMessage(
      isDailyPractice
        ? 'Daily Practice time! 6 fun questions to power up your streak!'
        : nodeMeta?.description || buddy.greeting,
    )
  }, [isDailyPractice, mathFrontierId, readingFrontierId, nodeId, nodeMeta, buddy.greeting])

  useEffect(() => {
    startNewRound()
  }, [startNewRound])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (submittedAnswer) => {
    if (!currentQuestion || feedback) return

    const normalizedSubmitted = String(submittedAnswer).trim().toUpperCase()
    const normalizedExpected = String(currentQuestion.answer).trim().toUpperCase()
    const isCorrect = normalizedSubmitted === normalizedExpected

    if (isCorrect) {
      playSfx('correct', soundEnabled)
      const nextFirstTryCount = hadWrongAttemptOnCurrent
        ? firstTryCorrectCount
        : firstTryCorrectCount + 1

      if (!hadWrongAttemptOnCurrent) {
        setFirstTryCorrectCount(nextFirstTryCount)
      }

      const randomCheer = buddy.cheers[Math.floor(Math.random() * buddy.cheers.length)]
      setBuddyMessage(randomCheer)
      setFeedback({ isCorrect: true, nextFirstTryCount })
    } else {
      playSfx('wrong', soundEnabled)
      setHadWrongAttemptOnCurrent(true)
      setShowHint(true) // Automatically show step-by-step hint on wrong answer
      setBuddyMessage(currentQuestion.hint || 'Try again! Look at the visual clue.')
      setFeedback({ isCorrect: false })
    }
  }

  const handleContinue = useCallback(() => {
    if (!feedback) return
    const wasCorrect = feedback.isCorrect
    const updatedFirstTry = feedback.nextFirstTryCount ?? firstTryCorrectCount
    setFeedback(null)

    if (wasCorrect) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setHadWrongAttemptOnCurrent(false)
        setShowHint(false)
        setImageError(false)
      } else {
        // Round finished!
        playSfx('fanfare', soundEnabled)
        if (isDailyPractice) {
          const summary = onCompleteDaily?.(updatedFirstTry, questions.length)
          setSessionResult({
            stars: 3,
            firstTryCorrect: updatedFirstTry,
            total: questions.length,
            unlockedStickers: summary?.newlyUnlockedStickers || [],
          })
        } else {
          const summary = onCompleteNode?.(nodeId, updatedFirstTry, questions.length)
          setSessionResult({
            stars: summary?.earnedStars || 1,
            firstTryCorrect: updatedFirstTry,
            total: questions.length,
            unlockedStickers: summary?.newlyUnlockedStickers || [],
            nextNode: summary?.nextNode || null,
          })
        }
      }
    }
  }, [
    feedback,
    firstTryCorrectCount,
    currentIndex,
    questions.length,
    soundEnabled,
    isDailyPractice,
    onCompleteDaily,
    onCompleteNode,
    nodeId,
  ])

  if (questions.length === 0) {
    return <div className="chalk-text">Preparing your adventure...</div>
  }

  // Completion Celebration View
  if (sessionResult) {
    const { stars, firstTryCorrect, total, unlockedStickers = [], nextNode } = sessionResult
    return (
      <div className="completion-screen mastery-complete">
        <div className="stars-earned-row" aria-label={`${stars} out of 3 stars earned`}>
          {[1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`mastery-star-big ${idx <= stars ? 'star-earned' : 'star-empty'}`}
            >
              {idx <= stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <h2 className="title">
          {isDailyPractice
            ? 'Daily Mission Complete!'
            : stars === 3
              ? 'Mastered! 3 Stars!'
              : stars === 2
                ? 'Great Job! Next Level Unlocked!'
                : 'Round Complete!'}
        </h2>

        <p className="score-display" style={{ fontSize: '1.35rem' }}>
          First-try accuracy: <strong>{firstTryCorrect}</strong> out of <strong>{total}</strong>
        </p>

        {unlockedStickers.length > 0 && (
          <div className="new-sticker-banner">
            <div className="new-sticker-title">🎁 New Sticker Unlocked!</div>
            <div className="new-sticker-items">
              {unlockedStickers.map((st) => (
                <div key={st.id} className="new-sticker-pill">
                  <span className="sticker-emoji-large">{st.emoji}</span>
                  <span>{st.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <StudyBuddy
          buddyId={buddyId}
          message={
            stars === 3
              ? 'Incredible mastery! You got every single question right on the first try!'
              : stars === 2
                ? 'Awesome work! You unlocked the next skill on the Adventure Map!'
                : 'Good practice! Play one more time to earn 2 or 3 stars!'
          }
          compact
        />

        <div className="section-buttons" style={{ marginTop: '16px' }}>
          {nextNode && stars >= 2 && onSelectNextNode && (
            <button
              type="button"
              className="btn btn-yellow"
              onClick={() => onSelectNextNode(nextNode.id)}
            >
              Next: {nextNode.title} →
            </button>
          )}
          <button type="button" className="btn btn-green" onClick={startNewRound}>
            ↺ Play Again
          </button>
          <button type="button" className="btn btn-back" onClick={onBack}>
            🗺️ Back to Map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="skill-session">
      {/* Top Header */}
      <div className="section-header">
        <button type="button" className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>

        <div className="session-title-group">
          {nodeMeta && <span className="kumon-badge">Level {nodeMeta.badge}</span>}
          <h2 className="section-title">
            {isDailyPractice
              ? '⚡ Daily Practice'
              : `${nodeMeta?.icon || ''} ${nodeMeta?.title || 'Skill'}`}
          </h2>
        </div>

        <div className="score-badge">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* 6-Question Progress Dots */}
      <div className="progress-container">
        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className={`progress-dot ${
              idx < currentIndex ? 'completed' : idx === currentIndex ? 'current' : ''
            }`}
          />
        ))}
      </div>

      {/* Prompt Bar with Tap-to-Read Speaker Button */}
      <div className="prompt-bar">
        <p className="prompt-text">{currentQuestion.prompt}</p>
        <button
          type="button"
          className="btn-icon-speaker"
          onClick={() => speakText(currentQuestion.spokenPrompt || currentQuestion.prompt)}
          title="Tap to hear question"
          aria-label="Read question aloud"
        >
          🔊
        </button>
      </div>

      {/* Main Question Stage */}
      <div className="question-stage">
        {currentQuestion.track === 'math' ? (
          <div className="math-question-stage">
            {currentQuestion.story ? (
              <div className="story-prompt-card">
                <p className="story-text">{currentQuestion.story}</p>
              </div>
            ) : (
              <div className="math-expression">{currentQuestion.expression}</div>
            )}

            <MathVisuals question={currentQuestion} showHint={showHint} />
          </div>
        ) : (
          <div className="reading-question-stage">
            {currentQuestion.wordData && (
              <div className="spelling-card">
                <div className="spelling-image-wrap">
                  {imageError ? (
                    <div className="spelling-emoji-fallback">
                      {currentQuestion.wordData.emoji}
                    </div>
                  ) : (
                    <img
                      key={currentQuestion.wordData.word}
                      className="spelling-image"
                      src={currentQuestion.wordData.image}
                      alt={currentQuestion.wordData.word}
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>

                <div className="spelling-card-info">
                  <p className="spelling-meta">
                    <span>{currentQuestion.wordData.category}</span>
                  </p>
                  <div className="spelling-actions">
                    <button
                      type="button"
                      className="btn btn-blue btn-small"
                      onClick={() => speakText(currentQuestion.wordData.word)}
                    >
                      🔊 Say Word
                    </button>
                    {currentQuestion.inputMode === 'letter-tiles' && (
                      <button
                        type="button"
                        className="btn btn-yellow btn-small"
                        onClick={() => spellOutWord(currentQuestion.wordData.word)}
                      >
                        🧩 Spell Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentQuestion.displayPattern && (
              <div className="phonics-pattern-display">{currentQuestion.displayPattern}</div>
            )}

            {currentQuestion.sentence && (
              <div className="sentence-card">
                <p className="story-text">{currentQuestion.sentence}</p>
                <button
                  type="button"
                  className="btn-icon-speaker"
                  onClick={() => speakText(currentQuestion.spokenPrompt)}
                  title="Listen to sentence"
                  aria-label="Listen to sentence"
                >
                  🔊
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer Input Mode */}
      <div className="answer-stage">
        {currentQuestion.inputMode === 'choices' && (
          <div className="choices-container">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                type="button"
                className="choice-btn"
                onClick={() => handleAnswer(choice)}
                disabled={feedback !== null}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.inputMode === 'numpad' && (
          <NumberPad
            questionKey={currentQuestion.id}
            onSubmit={handleAnswer}
            disabled={feedback !== null}
            soundEnabled={soundEnabled}
          />
        )}

        {currentQuestion.inputMode === 'letter-tiles' && (
          <LetterTileBuilder
            questionKey={currentQuestion.id}
            targetWord={currentQuestion.answer}
            tiles={currentQuestion.tiles}
            onSubmit={handleAnswer}
            disabled={feedback !== null}
            showHint={showHint}
            soundEnabled={soundEnabled}
          />
        )}
      </div>

      {/* Study Buddy & Step-by-Step Hint Bar */}
      <StudyBuddy
        buddyId={buddyId}
        message={buddyMessage}
        hintText={currentQuestion.hint}
        showHint={showHint}
        onToggleHint={() => setShowHint((prev) => !prev)}
        compact
      />

      {/* Celebration / Retry Feedback Overlay */}
      {feedback && (
        <Feedback isCorrect={feedback.isCorrect} onContinue={handleContinue} />
      )}
    </div>
  )
}

export default SkillSession
