import { speakText } from '../utils/soundManager'

function DinosaurCard({ dinosaur, size = 'large' }) {
  const categorySlug = dinosaur.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const handleSpeak = () => {
    speakText(
      `${dinosaur.name}. Means ${dinosaur.meaning}. ${dinosaur.diet}. Spot it by: ${dinosaur.feature}. Fun fact: ${dinosaur.funFact}`,
    )
  }

  return (
    <div className={`country-card dinosaur-card country-card-${size}`}>
      <div className="country-flag-container dinosaur-image-container">
        <img
          src={dinosaur.image}
          alt={dinosaur.name}
          className="dinosaur-card-img"
          fetchpriority="high"
        />
      </div>

      <div className="country-info dinosaur-info">
        <div className="dinosaur-title-row">
          <h3 className="country-name dinosaur-name">{dinosaur.name}</h3>
          <button
            type="button"
            className="btn-icon-speaker btn-speaker-mini"
            onClick={handleSpeak}
            title={`Listen to ${dinosaur.name}`}
            aria-label={`Listen to ${dinosaur.name}`}
          >
            🔊
          </button>
        </div>

        <div className="dinosaur-pronunciation">🗣️ {dinosaur.pronunciation}</div>

        <p className="country-capital dinosaur-meaning">
          <span className="capital-label">Name Means:</span> “{dinosaur.meaning}”
        </p>

        <p className="dinosaur-feature">
          <span className="capital-label">Spot It By:</span> {dinosaur.feature}
        </p>

        <p className="dinosaur-fact">💡 {dinosaur.funFact}</p>

        <div className="dinosaur-badges-row">
          <span className={`continent-badge dino-badge-${categorySlug}`}>
            {dinosaur.diet}
          </span>
          <span className="continent-badge dino-period-badge">
            ⏳ {dinosaur.period}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DinosaurCard
