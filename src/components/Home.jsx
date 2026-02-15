function Home({ onSelectSection, difficulty, onDifficultyChange }) {
  const difficultyLabels = {
    1: 'Easy (0-5)',
    2: 'Medium (0-10)',
    3: 'Hard (0-20)'
  }

  return (
    <div className="home">
      {/* Decorative chalk drawings */}
      <span className="chalk-decoration top-left">⭐</span>
      <span className="chalk-decoration top-right">🌟</span>
      <span className="chalk-decoration bottom-left">✨</span>
      <span className="chalk-decoration bottom-right">💫</span>

      <h1 className="title">Math Fun!</h1>
      <p className="subtitle chalk-text">Let's learn together!</p>

      {/* Difficulty selector */}
      <div className="difficulty-selector">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
            onClick={() => onDifficultyChange(level)}
          >
            {difficultyLabels[level]}
          </button>
        ))}
      </div>

      {/* Section buttons */}
      <div className="section-buttons">
        <button 
          className="btn btn-yellow section-btn"
          onClick={() => onSelectSection('addition')}
        >
          <span className="icon">➕</span>
          Addition
        </button>

        <button 
          className="btn btn-pink section-btn"
          onClick={() => onSelectSection('subtraction')}
        >
          <span className="icon">➖</span>
          Subtraction
        </button>

        <button 
          className="btn btn-blue section-btn"
          onClick={() => onSelectSection('story')}
        >
          <span className="icon">📖</span>
          Story Problems
        </button>
      </div>
    </div>
  )
}

export default Home
