import { useState } from 'react'
import { STUDY_BUDDIES } from '../utils/curriculumData'
import { speakText } from '../utils/soundManager'

function StudyBuddy({
  buddyId = 'owl',
  message,
  hintText,
  showHint = false,
  onToggleHint,
  compact = false,
}) {
  const [imgErr, setImgErr] = useState(false)
  const buddy = STUDY_BUDDIES.find((b) => b.id === buddyId) || STUDY_BUDDIES[0]
  const displayMessage = showHint && hintText ? hintText : message || buddy.greeting

  return (
    <div
      className={`study-buddy-bar ${compact ? 'buddy-compact' : ''} ${
        showHint ? 'buddy-hint-active' : ''
      }`}
    >
      <div className="buddy-avatar" title={buddy.name}>
        {buddy.avatar && !imgErr ? (
          <img
            src={buddy.avatar}
            alt={buddy.name}
            className="buddy-avatar-img"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="buddy-emoji">{buddy.emoji}</span>
        )}
      </div>

      <div className="buddy-bubble">
        <div className="buddy-name">{buddy.name}</div>
        <div className="buddy-text">{displayMessage}</div>
      </div>

      <div className="buddy-actions">
        <button
          type="button"
          className="btn-icon-speaker"
          onClick={() => speakText(displayMessage)}
          title="Read aloud"
          aria-label="Read buddy message aloud"
        >
          🔊
        </button>

        {hintText && onToggleHint && (
          <button
            type="button"
            className={`btn btn-small buddy-hint-btn ${
              showHint ? 'btn-yellow' : 'btn-purple'
            }`}
            onClick={onToggleHint}
          >
            💡 {showHint ? 'Hide Hint' : 'Hint'}
          </button>
        )}
      </div>
    </div>
  )
}

export default StudyBuddy
