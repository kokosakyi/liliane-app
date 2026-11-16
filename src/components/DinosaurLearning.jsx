import { useState, useMemo } from 'react'
import DinosaurCard from './DinosaurCard'
import { getDinosaursByCategory, getDinosaurCategories } from '../utils/dinosaurUtils'
import { playSfx } from '../utils/soundManager'

function DinosaurLearning({ onBack, soundEnabled = true }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = useMemo(() => ['All', ...getDinosaurCategories()], [])

  const dinosaurs = useMemo(() => {
    return getDinosaursByCategory(selectedCategory)
  }, [selectedCategory])

  const currentDinosaur = dinosaurs[currentIndex]

  const handleCategoryChange = (category) => {
    playSfx('tap', soundEnabled)
    setSelectedCategory(category)
    setCurrentIndex(0)
  }

  const handlePrevious = () => {
    playSfx('tap', soundEnabled)
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : dinosaurs.length - 1))
  }

  const handleNext = () => {
    playSfx('tap', soundEnabled)
    setCurrentIndex((prev) => (prev < dinosaurs.length - 1 ? prev + 1 : 0))
  }

  if (!currentDinosaur) {
    return (
      <div className="country-learning dinosaur-learning">
        <div className="section-header">
          <button className="btn btn-back btn-small" onClick={onBack}>
            ← Back
          </button>
          <h2 className="section-title">Study Dinosaurs 🦕</h2>
          <div style={{ width: '80px' }}></div>
        </div>
        <p className="chalk-text">No dinosaurs found for this filter.</p>
      </div>
    )
  }

  return (
    <div className="country-learning dinosaur-learning">
      <div className="section-header">
        <button className="btn btn-back btn-small" onClick={onBack}>
          ← Back
        </button>
        <h2 className="section-title">Study Dinosaurs 🦕</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Category filter */}
      <div className="continent-filter">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`continent-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="learning-progress">
        <span className="progress-text">
          {currentIndex + 1} of {dinosaurs.length}
        </span>
      </div>

      {/* Dinosaur flashcard */}
      <div className="flashcard-container">
        <button
          type="button"
          className="nav-arrow nav-arrow-left"
          onClick={handlePrevious}
          aria-label="Previous dinosaur"
        >
          ‹
        </button>

        <DinosaurCard dinosaur={currentDinosaur} />

        <button
          type="button"
          className="nav-arrow nav-arrow-right"
          onClick={handleNext}
          aria-label="Next dinosaur"
        >
          ›
        </button>
      </div>

      {/* Navigation dots */}
      {dinosaurs.length <= 20 && (
        <div className="progress-container">
          {dinosaurs.map((dino, index) => (
            <div
              key={dino.id}
              className={`progress-dot ${index === currentIndex ? 'current' : ''}`}
              onClick={() => {
                playSfx('tap', soundEnabled)
                setCurrentIndex(index)
              }}
              title={dino.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DinosaurLearning
