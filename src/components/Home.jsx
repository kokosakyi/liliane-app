function Home({
  onSelectSection,
  difficulty,
  onDifficultyChange,
  onGoToAdventure,
}) {
  const difficultyLabels = {
    1: 'Tier 1: Pre-K (0–5)',
    2: 'Tier 2: Kinder (0–10)',
    3: 'Tier 3: Gr 1–2 (0–50)',
    4: 'Tier 4: Gr 3–4 (0–100)',
  }

  return (
    <div className="home">
      <span className="chalk-decoration top-left">⭐</span>
      <span className="chalk-decoration top-right">🌟</span>
      <span className="chalk-decoration bottom-left">✨</span>
      <span className="chalk-decoration bottom-right">💫</span>

      <h1 className="title">📚 Free-Play Library</h1>
      <p className="subtitle chalk-text">
        Pick a difficulty tier and jump into any activity!
      </p>

      {/* 4-Tier Difficulty Selector for Free-Play */}
      <div className="difficulty-selector">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            type="button"
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
          type="button"
          className="btn btn-yellow section-btn"
          onClick={() => onSelectSection('addition')}
        >
          <span className="icon">➕</span>
          Addition
        </button>

        <button
          type="button"
          className="btn btn-pink section-btn"
          onClick={() => onSelectSection('subtraction')}
        >
          <span className="icon">➖</span>
          Subtraction
        </button>

        <button
          type="button"
          className="btn btn-blue section-btn"
          onClick={() => onSelectSection('story')}
        >
          <span className="icon">📖</span>
          Story Problems
        </button>

        <button
          type="button"
          className="btn btn-purple section-btn"
          onClick={() => onSelectSection('spelling')}
        >
          <span className="icon">🎤</span>
          Spelling Jam (3–9 Letters)
        </button>

        <button
          type="button"
          className="btn btn-green section-btn"
          onClick={() => onSelectSection('countries')}
        >
          <span className="icon">🌍</span>
          Countries & Flags
        </button>

        {onGoToAdventure && (
          <button
            type="button"
            className="btn btn-back section-btn"
            onClick={onGoToAdventure}
          >
            <span className="icon">🗺️</span>
            Back to Adventure Map
          </button>
        )}
      </div>
    </div>
  )
}

export default Home
