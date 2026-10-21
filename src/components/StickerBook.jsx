import { useState } from 'react'
import { STICKER_CATALOG } from '../utils/curriculumData'
import { getNextStickerToUnlock, getTotalStars } from '../utils/storage'
import { playSfx, speakText } from '../utils/soundManager'

function StickerBook({ appState, onBack }) {
  const [selectedSticker, setSelectedSticker] = useState(null)
  const totalStars = getTotalStars(appState)
  const unlockedCount = STICKER_CATALOG.filter((s) => totalStars >= s.starsRequired).length
  const nextSticker = getNextStickerToUnlock(totalStars)

  const handleStickerClick = (sticker, isUnlocked) => {
    if (!isUnlocked) return
    playSfx('tap', appState.soundEnabled)
    setSelectedSticker(sticker)
  }

  return (
    <div className="sticker-book-section">
      <div className="section-header">
        <button type="button" className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">⭐ {appState.childName}’s Sticker Book</h2>
        <div className="score-badge">
          {unlockedCount}/{STICKER_CATALOG.length}
        </div>
      </div>

      {/* Progress to Next Sticker */}
      <div className="sticker-progress-banner">
        {nextSticker ? (
          <>
            <div className="sticker-next-text">
              Earn <strong>{nextSticker.starsRequired - totalStars} more ⭐</strong> to unlock{' '}
              <strong>{nextSticker.name}</strong>!
            </div>
            <div className="sticker-progress-bar-bg">
              <div
                className="sticker-progress-bar-fill"
                style={{
                  width: `${Math.min(100, Math.round((totalStars / nextSticker.starsRequired) * 100))}%`,
                }}
              />
            </div>
          </>
        ) : (
          <div className="sticker-next-text">
            🎉 Amazing! You have unlocked every single sticker in the album!
          </div>
        )}
      </div>

      {/* Selected Sticker Fact Spotlight */}
      {selectedSticker && (
        <div className="sticker-spotlight-card">
          <div className="spotlight-emoji">{selectedSticker.emoji}</div>
          <div className="spotlight-info">
            <div className="spotlight-title">
              {selectedSticker.name}{' '}
              <span className="spotlight-cat">{selectedSticker.category}</span>
            </div>
            <p className="spotlight-fact">{selectedSticker.fact}</p>
          </div>
          <button
            type="button"
            className="btn-icon-speaker"
            onClick={() => speakText(`${selectedSticker.name}. ${selectedSticker.fact}`)}
            title="Read sticker fact aloud"
            aria-label={`Read fact about ${selectedSticker.name}`}
          >
            🔊
          </button>
        </div>
      )}

      {/* Grid of Stickers */}
      <div className="sticker-grid">
        {STICKER_CATALOG.map((sticker) => {
          const isUnlocked = totalStars >= sticker.starsRequired
          const isSelected = selectedSticker?.id === sticker.id

          return (
            <button
              key={sticker.id}
              type="button"
              className={`sticker-card ${isUnlocked ? 'sticker-unlocked' : 'sticker-locked'} ${
                isSelected ? 'sticker-selected' : ''
              }`}
              onClick={() => handleStickerClick(sticker, isUnlocked)}
              disabled={!isUnlocked}
            >
              <div className="sticker-emoji">{isUnlocked ? sticker.emoji : '🔒'}</div>
              <div className="sticker-name">{isUnlocked ? sticker.name : '???'}</div>
              <div className="sticker-req">
                {isUnlocked ? '✨ Collected' : `Needs ${sticker.starsRequired} ⭐`}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StickerBook
