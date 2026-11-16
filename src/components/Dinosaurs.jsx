import { useState } from 'react'
import DinosaurLearning from './DinosaurLearning'
import DinosaurQuiz from './DinosaurQuiz'
import { playSfx } from '../utils/soundManager'

function Dinosaurs({ onBack, soundEnabled = true, onEarnBonusStars }) {
  const [mode, setMode] = useState(null) // null = selection, 'learn', 'quiz'

  if (mode === 'learn') {
    return (
      <DinosaurLearning
        soundEnabled={soundEnabled}
        onBack={() => {
          playSfx('tap', soundEnabled)
          setMode(null)
        }}
      />
    )
  }

  if (mode === 'quiz') {
    return (
      <DinosaurQuiz
        soundEnabled={soundEnabled}
        onEarnBonusStars={onEarnBonusStars}
        onBack={() => {
          playSfx('tap', soundEnabled)
          setMode(null)
        }}
      />
    )
  }

  // Mode selection screen (follows Countries.jsx layout & rules)
  return (
    <div className="countries-section dinosaurs-section">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Dinosaurs 🦖</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      <p className="subtitle chalk-text">What would you like to do?</p>

      <div className="mode-selection">
        <button
          type="button"
          className="btn btn-green mode-btn"
          onClick={() => {
            playSfx('tap', soundEnabled)
            setMode('learn')
          }}
        >
          <span className="mode-icon">📚</span>
          <span className="mode-title">Study</span>
          <span className="mode-desc">Meet dinosaurs, traits & fun facts</span>
        </button>

        <button
          type="button"
          className="btn btn-yellow mode-btn"
          onClick={() => {
            playSfx('tap', soundEnabled)
            setMode('quiz')
          }}
        >
          <span className="mode-icon">🎯</span>
          <span className="mode-title">Quiz</span>
          <span className="mode-desc">Test your dinosaur knowledge!</span>
        </button>
      </div>
    </div>
  )
}

export default Dinosaurs
