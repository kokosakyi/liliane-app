import { useState, useMemo } from 'react'
import CountryCard from './CountryCard'
import { getCountriesByContinent, getContinents } from '../utils/countryUtils'

function CountryLearning({ onBack }) {
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const continents = useMemo(() => ['All', ...getContinents()], [])
  
  const countries = useMemo(() => {
    return getCountriesByContinent(selectedContinent)
  }, [selectedContinent])

  const currentCountry = countries[currentIndex]

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent)
    setCurrentIndex(0)
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : countries.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < countries.length - 1 ? prev + 1 : 0))
  }

  if (!currentCountry) {
    return (
      <div className="country-learning">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={onBack}>
            ← Back
          </button>
          <h2 className="section-title">Learn Countries 🌍</h2>
          <div style={{ width: '80px' }}></div>
        </div>
        <p className="chalk-text">No countries found for this filter.</p>
      </div>
    )
  }

  return (
    <div className="country-learning">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Learn Countries 🌍</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Continent filter */}
      <div className="continent-filter">
        {continents.map(continent => (
          <button
            key={continent}
            className={`continent-btn ${selectedContinent === continent ? 'active' : ''}`}
            onClick={() => handleContinentChange(continent)}
          >
            {continent}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="learning-progress">
        <span className="progress-text">
          {currentIndex + 1} of {countries.length}
        </span>
      </div>

      {/* Country card */}
      <div className="flashcard-container">
        <button 
          className="nav-arrow nav-arrow-left" 
          onClick={handlePrevious}
          aria-label="Previous country"
        >
          ‹
        </button>

        <CountryCard country={currentCountry} />

        <button 
          className="nav-arrow nav-arrow-right" 
          onClick={handleNext}
          aria-label="Next country"
        >
          ›
        </button>
      </div>

      {/* Navigation dots for small sets */}
      {countries.length <= 20 && (
        <div className="progress-container">
          {countries.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${
                index === currentIndex ? 'current' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CountryLearning
