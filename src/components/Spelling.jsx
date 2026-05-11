import { useEffect, useRef, useState } from 'react'

// Word images come from Twemoji SVG icons hosted on jsDelivr. The emoji for
// each entry is curated to match the word, so the rendered icon is always
// semantically correct, the URL is a stable CDN path that does not 404, and
// the bright illustrated style fits the "Spelling Jam" vibe. The plain emoji
// is kept as an ultimate fallback if the SVG ever fails to load.
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

function shuffleWords(words) {
  const copy = [...words]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  if (voices.length === 0) return null
  // Prefer a child-friendly English voice when available, else any en-* voice.
  const friendlyNames = ['samantha', 'karen', 'google us english', 'microsoft zira', 'microsoft aria']
  const lower = (v) => (v.name || '').toLowerCase()
  return (
    voices.find((v) => friendlyNames.some((n) => lower(v).includes(n))) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
    voices[0]
  )
}

function speakWord(text, { rate = 0.75 } = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  // Chrome occasionally gets stuck after rapid cancel/speak cycles; pumping
  // resume() before speaking clears the queue reliably.
  try { window.speechSynthesis.cancel() } catch {}
  try { window.speechSynthesis.resume() } catch {}
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = 1.1
  utterance.volume = 1
  utterance.lang = 'en-US'
  const voice = pickEnglishVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

function spellOutLetters(word) {
  // Pause between letters so each one is heard distinctly.
  speakWord(word.toUpperCase().split('').join(', '), { rate: 0.7 })
}

function Spelling({ onBack }) {
  const [selectedLength, setSelectedLength] = useState(3)
  const [roundWords, setRoundWords] = useState(() =>
    shuffleWords(WORD_BANK.filter((w) => w.word.length === 3)).slice(0, 8),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState(null)
  const [imageError, setImageError] = useState(false)
  const hasInteractedRef = useRef(false)
  const inputRef = useRef(null)

  const currentWord = roundWords[currentIndex]
  const isDone = currentIndex >= roundWords.length

  // Voices in Chrome load asynchronously; trigger a re-read when they arrive
  // so pickEnglishVoice() returns a real voice on the first speak.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const handler = () => {
      // Touching getVoices() warms the cache; no state needed.
      window.speechSynthesis.getVoices()
    }
    window.speechSynthesis.addEventListener?.('voiceschanged', handler)
    handler()
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', handler)
  }, [])

  useEffect(() => {
    if (!currentWord) return
    setImageError(false)
    const timer = setTimeout(() => {
      // Browsers block speech until a user gesture; only auto-speak after the
      // child has clicked at least once. Otherwise the first word is silent.
      if (hasInteractedRef.current) speakWord(currentWord.word)
      inputRef.current?.focus()
    }, 250)
    return () => clearTimeout(timer)
  }, [currentIndex, roundWords, currentWord])

  const startRound = (length) => {
    const filtered = WORD_BANK.filter((w) => w.word.length === length)
    const round = shuffleWords(filtered).slice(0, 8)
    setSelectedLength(length)
    setRoundWords(round)
    setCurrentIndex(0)
    setInput('')
    setScore(0)
    setResult(null)
    setImageError(false)
    hasInteractedRef.current = true
    // The button click counts as a user gesture, so the first auto-speak
    // (handled by the effect above) will go through. No manual speak needed.
  }

  const handleSay = () => {
    hasInteractedRef.current = true
    if (currentWord) speakWord(currentWord.word)
  }

  const handleSpell = () => {
    hasInteractedRef.current = true
    if (currentWord) spellOutLetters(currentWord.word)
  }

  const checkAnswer = () => {
    if (!currentWord || !input.trim()) return
    const isCorrect = input.trim().toLowerCase() === currentWord.word
    if (isCorrect) setScore((prev) => prev + 1)
    setResult({ isCorrect, correctWord: currentWord.word })
  }

  const moveNext = () => {
    setCurrentIndex((prev) => prev + 1)
    setInput('')
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
          <h2 className="title">Round Complete!</h2>
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
              Back to Menu
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
        <div className="score-badge">{score}/{roundWords.length}</div>
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
            className={`progress-dot ${i < currentIndex ? 'completed' : i === currentIndex ? 'current' : ''}`}
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
              {result ? letter.toUpperCase() : (input[i]?.toUpperCase() || '')}
            </div>
          )
        })}
      </div>

      {!result && (
        <div className="spelling-answer">
          <input
            ref={inputRef}
            className="number-input spelling-input"
            type="text"
            value={input.toUpperCase()}
            onChange={(e) =>
              setInput(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())
            }
            placeholder="TYPE HERE"
            maxLength={currentWord.word.length}
            autoComplete="off"
            autoCapitalize="none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) checkAnswer()
            }}
          />
          <button
            className="btn btn-green btn-small"
            onClick={checkAnswer}
            disabled={!input.trim()}
          >
            Check ✓
          </button>
        </div>
      )}

      {result && (
        <div className={`spelling-result ${result.isCorrect ? 'result-correct' : 'result-wrong'}`}>
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
