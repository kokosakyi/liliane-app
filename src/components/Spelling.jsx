import { useEffect, useRef, useState } from 'react'
import { playSfx, speakText, spellOutWord } from '../utils/soundManager'

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg'

function emojiToTwemojiUrl(emoji) {
  const codePoints = []
  for (const ch of emoji) {
    const cp = ch.codePointAt(0)
    if (cp === 0xfe0f) continue
    codePoints.push(cp.toString(16))
  }
  return `${TWEMOJI_BASE}/${codePoints.join('-')}.svg`
}

const WORD_BANK = [
  // ── 3-letter words ──
  { word: 'cat', category: 'Animal', emoji: '🐱' },
  { word: 'dog', category: 'Animal', emoji: '🐶' },
  { word: 'hen', category: 'Animal', emoji: '🐔' },
  { word: 'cow', category: 'Animal', emoji: '🐄' },
  { word: 'ant', category: 'Animal', emoji: '🐜' },
  { word: 'bee', category: 'Animal', emoji: '🐝' },
  { word: 'owl', category: 'Animal', emoji: '🦉' },
  { word: 'fox', category: 'Animal', emoji: '🦊' },
  { word: 'pig', category: 'Animal', emoji: '🐷' },
  { word: 'rat', category: 'Animal', emoji: '🐀' },
  { word: 'egg', category: 'Food', emoji: '🥚' },
  { word: 'sun', category: 'Nature', emoji: '☀️' },
  { word: 'hat', category: 'Thing', emoji: '🎩' },
  { word: 'cup', category: 'Thing', emoji: '☕' },
  { word: 'bus', category: 'Thing', emoji: '🚌' },
  { word: 'key', category: 'Thing', emoji: '🔑' },
  { word: 'bed', category: 'Thing', emoji: '🛏️' },
  { word: 'box', category: 'Thing', emoji: '📦' },
  // ── 4-letter words ──
  { word: 'frog', category: 'Animal', emoji: '🐸' },
  { word: 'duck', category: 'Animal', emoji: '🦆' },
  { word: 'bear', category: 'Animal', emoji: '🐻' },
  { word: 'fish', category: 'Animal', emoji: '🐟' },
  { word: 'wolf', category: 'Animal', emoji: '🐺' },
  { word: 'deer', category: 'Animal', emoji: '🦌' },
  { word: 'lion', category: 'Animal', emoji: '🦁' },
  { word: 'crab', category: 'Animal', emoji: '🦀' },
  { word: 'bird', category: 'Animal', emoji: '🐦' },
  { word: 'goat', category: 'Animal', emoji: '🐐' },
  { word: 'bull', category: 'Animal', emoji: '🐂' },
  { word: 'swan', category: 'Animal', emoji: '🦢' },
  { word: 'ball', category: 'Thing', emoji: '⚽' },
  { word: 'book', category: 'Thing', emoji: '📚' },
  { word: 'cake', category: 'Food', emoji: '🎂' },
  { word: 'milk', category: 'Food', emoji: '🥛' },
  { word: 'door', category: 'Thing', emoji: '🚪' },
  { word: 'leaf', category: 'Nature', emoji: '🍃' },
  { word: 'drum', category: 'Thing', emoji: '🥁' },
  { word: 'boat', category: 'Thing', emoji: '⛵' },
  { word: 'star', category: 'Nature', emoji: '⭐' },
  { word: 'ring', category: 'Thing', emoji: '💍' },
  { word: 'lamp', category: 'Thing', emoji: '💡' },
  { word: 'shoe', category: 'Thing', emoji: '👟' },
  // ── 5-letter words ──
  { word: 'tiger', category: 'Animal', emoji: '🐯' },
  { word: 'horse', category: 'Animal', emoji: '🐴' },
  { word: 'shark', category: 'Animal', emoji: '🦈' },
  { word: 'eagle', category: 'Animal', emoji: '🦅' },
  { word: 'snake', category: 'Animal', emoji: '🐍' },
  { word: 'mouse', category: 'Animal', emoji: '🐭' },
  { word: 'sheep', category: 'Animal', emoji: '🐑' },
  { word: 'whale', category: 'Animal', emoji: '🐋' },
  { word: 'panda', category: 'Animal', emoji: '🐼' },
  { word: 'otter', category: 'Animal', emoji: '🦦' },
  { word: 'zebra', category: 'Animal', emoji: '🦓' },
  { word: 'llama', category: 'Animal', emoji: '🦙' },
  { word: 'camel', category: 'Animal', emoji: '🐪' },
  { word: 'hippo', category: 'Animal', emoji: '🦛' },
  { word: 'apple', category: 'Food', emoji: '🍎' },
  { word: 'bread', category: 'Food', emoji: '🍞' },
  { word: 'grape', category: 'Food', emoji: '🍇' },
  { word: 'lemon', category: 'Food', emoji: '🍋' },
  { word: 'mango', category: 'Food', emoji: '🥭' },
  { word: 'clock', category: 'Thing', emoji: '🕐' },
  { word: 'chair', category: 'Thing', emoji: '🪑' },
  { word: 'plant', category: 'Nature', emoji: '🌿' },
  { word: 'piano', category: 'Thing', emoji: '🎹' },
  { word: 'truck', category: 'Thing', emoji: '🚚' },
  { word: 'house', category: 'Thing', emoji: '🏠' },
  { word: 'acorn', category: 'Nature', emoji: '🌰' },
  { word: 'tulip', category: 'Nature', emoji: '🌷' },
].map((entry) => ({ ...entry, image: emojiToTwemojiUrl(entry.emoji) }))

const LENGTH_OPTIONS = [3, 4, 5]

const PROMPTS = {
  3: 'Three-letter starters',
  4: 'Four-letter builders',
  5: 'Five-letter challenge',
}

function shuffleArray(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildScrambledBank(word) {
  const chars = word.toUpperCase().split('')
  const extraPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  chars.push(extraPool[Math.floor(Math.random() * extraPool.length)])
  return shuffleArray(chars).map((char, idx) => ({ id: `${char}-${idx}`, char }))
}

function Spelling({ onBack, soundEnabled = true, onEarnBonusStars }) {
  const [selectedLength, setSelectedLength] = useState(3)
  const [roundWords, setRoundWords] = useState(() =>
    shuffleArray(WORD_BANK.filter((w) => w.word.length === 3)).slice(0, 8),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [bankTiles, setBankTiles] = useState([])
  const [usedTileIds, setUsedTileIds] = useState([])
  const [score, setScore] = useState(0)
  const [result, setResult] = useState(null)
  const [imageError, setImageError] = useState(false)
  const inputRef = useRef(null)

  const currentWord = roundWords[currentIndex]
  const isDone = currentIndex >= roundWords.length

  useEffect(() => {
    if (!currentWord) return
    setImageError(false)
    setBankTiles(buildScrambledBank(currentWord.word))
    setUsedTileIds([])
  }, [currentIndex, roundWords, currentWord])

  const startRound = (length) => {
    playSfx('tap', soundEnabled)
    const filtered = WORD_BANK.filter((w) => w.word.length === length)
    const round = shuffleArray(filtered).slice(0, 8)
    setSelectedLength(length)
    setRoundWords(round)
    setCurrentIndex(0)
    setInput('')
    setUsedTileIds([])
    setScore(0)
    setResult(null)
    setImageError(false)
  }

  const handleSay = () => {
    if (currentWord) speakText(currentWord.word, { rate: 0.78 })
  }

  const handleSpell = () => {
    if (currentWord) spellOutWord(currentWord.word)
  }

  const handleTapTile = (tile) => {
    if (result || !currentWord || input.length >= currentWord.word.length) return
    if (usedTileIds.includes(tile.id)) return
    playSfx('tap', soundEnabled)
    setInput((prev) => `${prev}${tile.char.toLowerCase()}`)
    setUsedTileIds((prev) => [...prev, tile.id])
  }

  const handleClearInput = () => {
    if (result) return
    playSfx('tap', soundEnabled)
    setInput('')
    setUsedTileIds([])
  }

  const checkAnswer = () => {
    if (!currentWord || !input.trim()) return
    const isCorrect = input.trim().toLowerCase() === currentWord.word
    if (isCorrect) {
      playSfx('correct', soundEnabled)
      setScore((prev) => prev + 1)
    } else {
      playSfx('wrong', soundEnabled)
    }
    setResult({ isCorrect, correctWord: currentWord.word })
  }

  const moveNext = () => {
    const nextIdx = currentIndex + 1
    if (nextIdx >= roundWords.length) {
      playSfx('fanfare', soundEnabled)
      onEarnBonusStars?.(2)
    }
    setCurrentIndex(nextIdx)
    setInput('')
    setUsedTileIds([])
    setResult(null)
    setImageError(false)
  }

  if (isDone) {
    const perfect = score === roundWords.length
    const good = score >= Math.ceil(roundWords.length / 2)
    return (
      <div className="spelling-section">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={onBack}>
            ← Back
          </button>
          <h2 className="section-title">Spelling Jam 🎤</h2>
          <div style={{ width: '80px' }} />
        </div>
        <div className="completion-screen">
          <div className="feedback-icon">{perfect ? '🏆' : good ? '⭐' : '💪'}</div>
          <h2 className="title">Round Complete! (+2 ⭐)</h2>
          <p className="score-display" style={{ fontSize: '1.4rem' }}>
            {score} out of {roundWords.length} words correct!
          </p>
          <p className="story-text">
            {perfect
              ? 'Perfect score — you are a spelling champion!'
              : good
                ? 'Great work! Keep practising to ace the competition!'
                : 'Nice effort! Try again and beat your score!'}
          </p>
          <div className="section-buttons" style={{ marginTop: '20px' }}>
            <button className="btn btn-purple" onClick={() => startRound(selectedLength)}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={onBack}>
              Back to Library
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="spelling-section">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Spelling Jam 🎤</h2>
        <div className="score-badge">
          {score}/{roundWords.length}
        </div>
      </div>

      <p className="spelling-subtitle chalk-text">{PROMPTS[selectedLength]}</p>

      <div className="difficulty-selector">
        {LENGTH_OPTIONS.map((length) => (
          <button
            key={length}
            className={`difficulty-btn ${selectedLength === length ? 'active' : ''}`}
            onClick={() => startRound(length)}
          >
            {length}-letter
          </button>
        ))}
      </div>

      <div className="progress-container">
        {roundWords.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${
              i < currentIndex ? 'completed' : i === currentIndex ? 'current' : ''
            }`}
          />
        ))}
      </div>

      <div className="spelling-card">
        <div className="spelling-image-wrap">
          {imageError ? (
            <div className="spelling-emoji-fallback">{currentWord.emoji}</div>
          ) : (
            <img
              key={currentWord.word}
              className="spelling-image"
              src={currentWord.image}
              alt={currentWord.word}
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="spelling-card-info">
          <p className="spelling-meta">
            <span>{currentWord.category}</span> &bull; {currentWord.word.length} letters
          </p>
          <div className="spelling-actions">
            <button className="btn btn-blue btn-small" onClick={handleSay}>
              🔊 Say It
            </button>
            <button className="btn btn-yellow btn-small" onClick={handleSpell}>
              🧩 Spell It
            </button>
          </div>
        </div>
      </div>

      <div className="spell-tiles-row">
        {currentWord.word.split('').map((letter, i) => {
          let tileClass = ''
          if (result) {
            tileClass = input[i] === letter ? 'tile-correct' : 'tile-reveal'
          } else if (input[i]) {
            tileClass = 'tile-filled'
          } else if (i === input.length) {
            tileClass = 'tile-active'
          }
          return (
            <div key={i} className={`spell-tile ${tileClass}`}>
              {result ? letter.toUpperCase() : input[i]?.toUpperCase() || ''}
            </div>
          )
        })}
      </div>

      {!result && (
        <>
          {/* Tappable Scrambled Letter Tiles */}
          <div className="scrambled-bank">
            {bankTiles.map((tile) => {
              const isUsed = usedTileIds.includes(tile.id)
              return (
                <button
                  key={tile.id}
                  type="button"
                  className={`btn letter-bank-tile ${isUsed ? 'tile-used' : ''}`}
                  onClick={() => handleTapTile(tile)}
                  disabled={isUsed || input.length >= currentWord.word.length}
                >
                  {tile.char}
                </button>
              )
            })}
          </div>

          <div className="spelling-answer">
            <input
              ref={inputRef}
              className="number-input spelling-input"
              type="text"
              value={input.toUpperCase()}
              onChange={(e) => {
                setUsedTileIds([])
                setInput(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())
              }}
              placeholder="TAP TILES OR TYPE"
              maxLength={currentWord.word.length}
              autoComplete="off"
              autoCapitalize="none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) checkAnswer()
              }}
            />
            {input.length > 0 && (
              <button
                type="button"
                className="btn btn-pink btn-small"
                onClick={handleClearInput}
              >
                ↺ Clear
              </button>
            )}
            <button
              className="btn btn-green btn-small"
              onClick={checkAnswer}
              disabled={!input.trim()}
            >
              Check ✓
            </button>
          </div>
        </>
      )}

      {result && (
        <div
          className={`spelling-result ${result.isCorrect ? 'result-correct' : 'result-wrong'}`}
        >
          <span className="result-icon">{result.isCorrect ? '🎉' : '💡'}</span>
          <span>
            {result.isCorrect
              ? `Amazing! "${result.correctWord}" is correct!`
              : `It's "${result.correctWord.toUpperCase()}" — keep going!`}
          </span>
          <button className="btn btn-purple btn-small" onClick={moveNext}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Spelling
