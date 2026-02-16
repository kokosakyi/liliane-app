import { useState } from 'react'
import CountryLearning from './CountryLearning'
import FlagQuiz from './FlagQuiz'

function Countries({ onBack }) {
  const [mode, setMode] = useState(null) // null = selection, 'learn', 'quiz'

  if (mode === 'learn') {
    return <CountryLearning onBack={() => setMode(null)} />
  }

  if (mode === 'quiz') {
    return <FlagQuiz onBack={() => setMode(null)} />
  }

  // Mode selection screen
  return (
    <div className="countries-section">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Countries 🌍</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      <p className="subtitle chalk-text">What would you like to do?</p>

      <div className="mode-selection">
        <button 
          className="btn btn-green mode-btn"
          onClick={() => setMode('learn')}
        >
          <span className="mode-icon">📚</span>
          <span className="mode-title">Learn</span>
          <span className="mode-desc">Browse countries, flags & capitals</span>
        </button>

        <button 
          className="btn btn-yellow mode-btn"
          onClick={() => setMode('quiz')}
        >
          <span className="mode-icon">🎯</span>
          <span className="mode-title">Quiz</span>
          <span className="mode-desc">Test your knowledge!</span>
        </button>
      </div>
    </div>
  )
}

export default Countries
