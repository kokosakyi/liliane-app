import { useEffect, useState } from 'react'
import Home from './components/Home'
import Addition from './components/Addition'
import Subtraction from './components/Subtraction'
import StoryProblems from './components/StoryProblems'
import Countries from './components/Countries'
import Spelling from './components/Spelling'
import AdventureMap from './components/AdventureMap'
import SkillSession from './components/SkillSession'
import StickerBook from './components/StickerBook'
import ParentCorner from './components/ParentCorner'
import { MATH_TRACK, READING_TRACK } from './utils/curriculumData'
import {
  DEFAULT_STATE,
  getCurrentFrontierNodes,
  getTotalStars,
  getUnlockedStickers,
  loadAppState,
  recordBonusSessionCompletion,
  recordNodeCompletion,
  saveAppState,
} from './utils/storage'
import { playSfx } from './utils/soundManager'

function App() {
  const [appState, setAppState] = useState(() => loadAppState())
  const [currentView, setCurrentView] = useState('map') // 'map' | 'daily' | 'library' | 'stickers' | 'skill' | 'addition' | 'subtraction' | 'story' | 'countries' | 'spelling'
  const [activeNodeId, setActiveNodeId] = useState('math-1')
  const [difficulty, setDifficulty] = useState(1)
  const [isParentOpen, setIsParentOpen] = useState(false)

  useEffect(() => {
    saveAppState(appState)
  }, [appState])

  const updateAppState = (patch) => {
    setAppState((prev) => ({ ...prev, ...patch }))
  }

  const handleResetProgress = () => {
    setAppState({
      ...DEFAULT_STATE,
      childName: appState.childName,
      theme: appState.theme,
      buddyId: appState.buddyId,
    })
  }

  const handleCompleteNode = (nodeId, firstTryCorrect, totalQuestions) => {
    const prevStarsTotal = getTotalStars(appState)
    const prevUnlockedIds = new Set(
      getUnlockedStickers(prevStarsTotal).map((s) => s.id),
    )

    const { nextState, earnedStars } = recordNodeCompletion(
      appState,
      nodeId,
      firstTryCorrect,
      totalQuestions,
    )
    setAppState(nextState)

    const newStarsTotal = getTotalStars(nextState)
    const newlyUnlockedStickers = getUnlockedStickers(newStarsTotal).filter(
      (s) => !prevUnlockedIds.has(s.id),
    )

    // Find next sequential node in the same track
    const track = nodeId.startsWith('math-') ? MATH_TRACK : READING_TRACK
    const idx = track.findIndex((n) => n.id === nodeId)
    const nextNode = idx >= 0 && idx < track.length - 1 ? track[idx + 1] : null

    return {
      earnedStars,
      newlyUnlockedStickers,
      nextNode,
    }
  }

  const handleCompleteDaily = () => {
    const prevStarsTotal = getTotalStars(appState)
    const prevUnlockedIds = new Set(
      getUnlockedStickers(prevStarsTotal).map((s) => s.id),
    )

    const nextState = recordBonusSessionCompletion(appState, 3)
    setAppState(nextState)

    const newStarsTotal = getTotalStars(nextState)
    const newlyUnlockedStickers = getUnlockedStickers(newStarsTotal).filter(
      (s) => !prevUnlockedIds.has(s.id),
    )

    return {
      newlyUnlockedStickers,
    }
  }

  const handleEarnBonusStars = (starsCount = 2) => {
    setAppState((prev) => recordBonusSessionCompletion(prev, starsCount))
  }

  const totalStars = getTotalStars(appState)
  const { mathNode, readingNode } = getCurrentFrontierNodes(appState)

  const renderMainContent = () => {
    switch (currentView) {
      case 'skill':
        return (
          <SkillSession
            key={activeNodeId}
            nodeId={activeNodeId}
            buddyId={appState.buddyId}
            soundEnabled={appState.soundEnabled}
            onCompleteNode={handleCompleteNode}
            onSelectNextNode={(nextId) => {
              setActiveNodeId(nextId)
              setCurrentView('skill')
            }}
            onBack={() => setCurrentView('map')}
          />
        )

      case 'daily':
        return (
          <SkillSession
            key="daily-practice"
            isDailyPractice
            mathFrontierId={mathNode.id}
            readingFrontierId={readingNode.id}
            buddyId={appState.buddyId}
            soundEnabled={appState.soundEnabled}
            onCompleteDaily={handleCompleteDaily}
            onBack={() => setCurrentView('map')}
          />
        )

      case 'stickers':
        return (
          <StickerBook
            appState={appState}
            onBack={() => setCurrentView('map')}
          />
        )

      case 'library':
        return (
          <Home
            onSelectSection={(sec) => setCurrentView(sec)}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onGoToAdventure={() => setCurrentView('map')}
          />
        )

      case 'addition':
        return (
          <Addition
            difficulty={difficulty}
            onBack={() => setCurrentView('library')}
          />
        )

      case 'subtraction':
        return (
          <Subtraction
            difficulty={difficulty}
            onBack={() => setCurrentView('library')}
          />
        )

      case 'story':
        return (
          <StoryProblems
            difficulty={difficulty}
            onBack={() => setCurrentView('library')}
          />
        )

      case 'countries':
        return <Countries onBack={() => setCurrentView('library')} />

      case 'spelling':
        return (
          <Spelling
            soundEnabled={appState.soundEnabled}
            onEarnBonusStars={handleEarnBonusStars}
            onBack={() => setCurrentView('library')}
          />
        )

      case 'map':
      default:
        return (
          <AdventureMap
            appState={appState}
            onSelectNode={(id) => {
              setActiveNodeId(id)
              setCurrentView('skill')
            }}
            onStartDailyPractice={() => setCurrentView('daily')}
            onOpenCountries={() => setCurrentView('countries')}
          />
        )
    }
  }

  return (
    <div className={`app theme-${appState.theme}`}>
      <div className="blackboard">
        {/* Top Navigation & Status Bar */}
        <header className="top-hud-bar">
          <div className="hud-nav-tabs">
            <button
              type="button"
              className={`hud-tab-btn ${currentView === 'map' || currentView === 'skill' ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', appState.soundEnabled)
                setCurrentView('map')
              }}
            >
              🗺️ Adventure
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${currentView === 'daily' ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', appState.soundEnabled)
                setCurrentView('daily')
              }}
            >
              ⚡ Daily
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${
                ['library', 'addition', 'subtraction', 'story', 'spelling', 'countries'].includes(
                  currentView,
                )
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                playSfx('tap', appState.soundEnabled)
                setCurrentView('library')
              }}
            >
              📚 Library
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${currentView === 'stickers' ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', appState.soundEnabled)
                setCurrentView('stickers')
              }}
            >
              ⭐ Stickers
            </button>
          </div>

          <div className="hud-status-pills">
            <div className="hud-pill hud-streak" title="Daily Streak">
              🔥 {appState.streak?.count || 0}
            </div>

            <button
              type="button"
              className="hud-pill hud-stars"
              onClick={() => setCurrentView('stickers')}
              title="Open Sticker Book"
            >
              ⭐ {totalStars}
            </button>

            <button
              type="button"
              className="hud-icon-btn"
              onClick={() =>
                updateAppState({
                  theme: appState.theme === 'blackboard' ? 'daylight' : 'blackboard',
                })
              }
              title={
                appState.theme === 'blackboard'
                  ? 'Switch to Storybook Daylight Theme'
                  : 'Switch to Classic Blackboard Theme'
              }
              aria-label="Toggle visual theme"
            >
              {appState.theme === 'blackboard' ? '☀️' : '🖍️'}
            </button>

            <button
              type="button"
              className="hud-icon-btn"
              onClick={() => updateAppState({ soundEnabled: !appState.soundEnabled })}
              title={appState.soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: Muted'}
              aria-label="Toggle sound effects"
            >
              {appState.soundEnabled ? '🔔' : '🔕'}
            </button>

            <button
              type="button"
              className="hud-icon-btn hud-parent-btn"
              onClick={() => setIsParentOpen(true)}
              title="Parent Corner & Mastery Stats"
              aria-label="Open Parent Corner"
            >
              ⚙️
            </button>
          </div>
        </header>

        <div className="blackboard-frame">{renderMainContent()}</div>
      </div>

      <ParentCorner
        isOpen={isParentOpen}
        onClose={() => setIsParentOpen(false)}
        appState={appState}
        onUpdateState={updateAppState}
        onResetProgress={handleResetProgress}
      />
    </div>
  )
}

export default App
