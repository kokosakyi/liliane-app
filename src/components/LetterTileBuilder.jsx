import { useEffect, useState } from 'react'
import { playSfx } from '../utils/soundManager'

function LetterTileBuilder({
  targetWord,
  tiles = [],
  onSubmit,
  disabled = false,
  showHint = false,
  soundEnabled = true,
  questionKey,
}) {
  const wordLength = targetWord.length
  // Array of placed tile objects (or null for empty slots)
  const [slots, setSlots] = useState(() => Array(wordLength).fill(null))

  useEffect(() => {
    setSlots(Array(targetWord.length).fill(null))
  }, [questionKey, targetWord])

  const usedTileIds = new Set(slots.filter(Boolean).map((t) => t.id))

  const handleSelectTile = (tile) => {
    if (disabled || usedTileIds.has(tile.id)) return
    const emptyIdx = slots.findIndex((s) => s === null)
    if (emptyIdx === -1) return

    playSfx('tap', soundEnabled)
    const next = [...slots]
    next[emptyIdx] = tile
    setSlots(next)
  }

  const handleRemoveSlot = (slotIndex) => {
    if (disabled || !slots[slotIndex]) return
    playSfx('tap', soundEnabled)
    const next = [...slots]
    next[slotIndex] = null
    setSlots(next)
  }

  const handleClear = () => {
    if (disabled) return
    playSfx('tap', soundEnabled)
    setSlots(Array(wordLength).fill(null))
  }

  const currentBuiltWord = slots.map((s) => s?.char || '').join('')
  const isFull = slots.every((s) => s !== null)

  const handleSubmit = () => {
    if (disabled || !isFull) return
    onSubmit(currentBuiltWord.toUpperCase())
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (disabled) return
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key)) {
        const availableTile = tiles.find(
          (t) => t.char.toUpperCase() === key && !usedTileIds.has(t.id),
        )
        if (availableTile) {
          e.preventDefault()
          handleSelectTile(availableTile)
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        // Remove rightmost filled slot
        for (let i = slots.length - 1; i >= 0; i--) {
          if (slots[i] !== null) {
            handleRemoveSlot(i)
            break
          }
        }
      } else if (e.key === 'Enter' && isFull) {
        e.preventDefault()
        onSubmit(currentBuiltWord.toUpperCase())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="tile-builder">
      {/* Answer Slots */}
      <div className="spell-tiles-row">
        {slots.map((slotTile, idx) => {
          const ghostChar = targetWord[idx]?.toUpperCase()
          const isNextActive = !slotTile && slots.findIndex((s) => s === null) === idx
          return (
            <button
              key={idx}
              type="button"
              className={`spell-tile spell-slot-btn ${
                slotTile ? 'tile-filled' : isNextActive ? 'tile-active' : ''
              }`}
              onClick={() => handleRemoveSlot(idx)}
              disabled={disabled || !slotTile}
              title={slotTile ? 'Tap to remove letter' : 'Empty letter slot'}
            >
              {slotTile ? (
                slotTile.char
              ) : showHint ? (
                <span className="slot-ghost-hint">{ghostChar}</span>
              ) : (
                ''
              )}
            </button>
          )
        })}
      </div>

      {/* Scrambled Letter Bank */}
      <div className="scrambled-bank">
        {tiles.map((tile) => {
          const isUsed = usedTileIds.has(tile.id)
          return (
            <button
              key={tile.id}
              type="button"
              className={`btn letter-bank-tile ${isUsed ? 'tile-used' : ''}`}
              onClick={() => handleSelectTile(tile)}
              disabled={disabled || isUsed}
            >
              {tile.char}
            </button>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="tile-builder-actions">
        <button
          type="button"
          className="btn btn-pink btn-small"
          onClick={handleClear}
          disabled={disabled || slots.every((s) => s === null)}
        >
          ↺ Clear
        </button>
        <button
          type="button"
          className="btn btn-green btn-small"
          onClick={handleSubmit}
          disabled={disabled || !isFull}
        >
          Check ✓
        </button>
      </div>
    </div>
  )
}

export default LetterTileBuilder
