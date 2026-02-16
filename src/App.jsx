import { useState } from 'react'
import Home from './components/Home'
import Addition from './components/Addition'
import Subtraction from './components/Subtraction'
import StoryProblems from './components/StoryProblems'
import Countries from './components/Countries'

function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [difficulty, setDifficulty] = useState(1)

  const goHome = () => setCurrentSection('home')

  const renderSection = () => {
    switch (currentSection) {
      case 'addition':
        return <Addition difficulty={difficulty} onBack={goHome} />
      case 'subtraction':
        return <Subtraction difficulty={difficulty} onBack={goHome} />
      case 'story':
        return <StoryProblems difficulty={difficulty} onBack={goHome} />
      case 'countries':
        return <Countries onBack={goHome} />
      default:
        return (
          <Home 
            onSelectSection={setCurrentSection} 
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
          />
        )
    }
  }

  return (
    <div className="app">
      <div className="blackboard">
        <div className="blackboard-frame">
          {renderSection()}
        </div>
      </div>
    </div>
  )
}

export default App
