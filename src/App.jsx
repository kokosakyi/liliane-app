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
import ProfilePicker from './components/ProfilePicker'
import { MATH_TRACK, READING_TRACK, STUDY_BUDDIES } from './utils/curriculumData'
import {
  createProfile,
  getActiveProfile,
  getCurrentFrontierNodes,
  getTotalStars,
  getUnlockedStickers,
  loadRootState,
  recordBonusSessionCompletion,
  recordNodeCompletion,
  saveRootState,
} from './utils/storage'
import { playSfx } from './utils/soundManager'

function App() {
  const [rootState, setRootState] = useState(() => loadRootState())
  // Launch on the "Who's Learning Today?" Profile Picker screen
  const [currentView, setCurrentView] = useState('profiles')
  const [activeNodeId, setActiveNodeId] = useState('math-1')
  const [difficulty, setDifficulty] = useState(2)
  const [isParentOpen, setIsParentOpen] = useState(false)

  useEffect(() => {
    saveRootState(rootState)
  }, [rootState])

  const activeProfile = getActiveProfile(rootState)
  const activeBuddy =
    STUDY_BUDDIES.find((b) => b.id === activeProfile.buddyId) || STUDY_BUDDIES[0]

  const updateActiveProfile = (patch) => {
    setRootState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? { ...p, ...patch } : p,
      ),
    }))
  }

  const handleSelectProfile = (profileId) => {
    const chosen =
      rootState.profiles.find((p) => p.id === profileId) || rootState.profiles[0]
    setRootState((prev) => ({
      ...prev,
      activeProfileId: chosen.id,
    }))
    setDifficulty(chosen.selectedTier || 2)
    setCurrentView('map')
  }

  const handleSaveProfile = (profileDraft) => {
    setRootState((prev) => {
      const exists = prev.profiles.some((p) => p.id === profileDraft.id)
      const nextProfiles = exists
        ? prev.profiles.map((p) =>
            p.id === profileDraft.id
              ? {
                  ...p,
                  childName: profileDraft.childName,
                  buddyId: profileDraft.buddyId,
                  selectedTier: profileDraft.selectedTier,
                }
              : p,
          )
        : [
            ...prev.profiles,
            createProfile({
              id: profileDraft.id,
              childName: profileDraft.childName,
              buddyId: profileDraft.buddyId,
              selectedTier: profileDraft.selectedTier,
            }),
          ]

      return {
        ...prev,
        activeProfileId: profileDraft.id,
        profiles: nextProfiles,
      }
    })
  }

  const handleDeleteProfile = (profileId) => {
    setRootState((prev) => {
      if (prev.profiles.length <= 1) return prev
      const remaining = prev.profiles.filter((p) => p.id !== profileId)
      const nextActiveId =
        prev.activeProfileId === profileId ? remaining[0].id : prev.activeProfileId
      return {
        ...prev,
        activeProfileId: nextActiveId,
        profiles: remaining,
      }
    })
  }

  const handleResetProfileProgress = () => {
    updateActiveProfile({
      bonusStars: 0,
      streak: { count: 0, lastCompletedDate: null },
      nodeProgress: {},
    })
  }

  const handleCompleteNode = (nodeId, firstTryCorrect, totalQuestions) => {
    const prevStarsTotal = getTotalStars(activeProfile)
    const prevUnlockedIds = new Set(
      getUnlockedStickers(prevStarsTotal).map((s) => s.id),
    )

    const { nextProfile, earnedStars } = recordNodeCompletion(
      activeProfile,
      nodeId,
      firstTryCorrect,
      totalQuestions,
    )

    setRootState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? nextProfile : p,
      ),
    }))

    const newStarsTotal = getTotalStars(nextProfile)
    const newlyUnlockedStickers = getUnlockedStickers(newStarsTotal).filter(
      (s) => !prevUnlockedIds.has(s.id),
    )

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
    const prevStarsTotal = getTotalStars(activeProfile)
    const prevUnlockedIds = new Set(
      getUnlockedStickers(prevStarsTotal).map((s) => s.id),
    )

    const nextProfile = recordBonusSessionCompletion(activeProfile, 3)

    setRootState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? nextProfile : p,
      ),
    }))

    const newStarsTotal = getTotalStars(nextProfile)
    const newlyUnlockedStickers = getUnlockedStickers(newStarsTotal).filter(
      (s) => !prevUnlockedIds.has(s.id),
    )

    return {
      newlyUnlockedStickers,
    }
  }

  const handleEarnBonusStars = (starsCount = 2) => {
    const nextProfile = recordBonusSessionCompletion(activeProfile, starsCount)
    setRootState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? nextProfile : p,
      ),
    }))
  }

  const totalStars = getTotalStars(activeProfile)
  const { mathNode, readingNode } = getCurrentFrontierNodes(activeProfile)

  const renderMainContent = () => {
    switch (currentView) {
      case 'profiles':
        return (
          <ProfilePicker
            profiles={rootState.profiles}
            activeProfileId={activeProfile.id}
            soundEnabled={rootState.soundEnabled}
            onSelectProfile={handleSelectProfile}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        )

      case 'skill':
        return (
          <SkillSession
            key={`${activeProfile.id}-${activeNodeId}`}
            nodeId={activeNodeId}
            profileId={activeProfile.id}
            buddyId={activeProfile.buddyId}
            soundEnabled={rootState.soundEnabled}
            onCompleteNode={handleCompleteNode}
            onSelectNextNode={(nextId) => {
              const targetNode = [...MATH_TRACK, ...READING_TRACK].find(
                (n) => n.id === nextId,
              )
              if (targetNode && targetNode.tier !== activeProfile.selectedTier) {
                updateActiveProfile({ selectedTier: targetNode.tier })
              }
              setActiveNodeId(nextId)
              setCurrentView('skill')
            }}
            onBack={() => setCurrentView('map')}
          />
        )

      case 'daily':
        return (
          <SkillSession
            key={`${activeProfile.id}-daily`}
            isDailyPractice
            profileId={activeProfile.id}
            mathFrontierId={mathNode.id}
            readingFrontierId={readingNode.id}
            buddyId={activeProfile.buddyId}
            soundEnabled={rootState.soundEnabled}
            onCompleteDaily={handleCompleteDaily}
            onBack={() => setCurrentView('map')}
          />
        )

      case 'stickers':
        return (
          <StickerBook
            appState={activeProfile}
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
            soundEnabled={rootState.soundEnabled}
            onEarnBonusStars={handleEarnBonusStars}
            onBack={() => setCurrentView('library')}
          />
        )

      case 'map':
      default:
        return (
          <AdventureMap
            profile={activeProfile}
            soundEnabled={rootState.soundEnabled}
            onSelectTier={(tierId) => {
              updateActiveProfile({ selectedTier: tierId })
              setDifficulty(tierId)
            }}
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
    <div className={`app theme-${rootState.theme}`}>
      <div className="blackboard">
        {/* Top Navigation & Status Bar */}
        <header className="top-hud-bar">
          <div className="hud-nav-tabs">
            <button
              type="button"
              className={`hud-learner-switch ${
                currentView === 'profiles' ? 'active' : ''
              }`}
              onClick={() => {
                playSfx('tap', rootState.soundEnabled)
                setCurrentView('profiles')
              }}
              title="Switch Learner Profile"
            >
              <img
                src={activeBuddy.avatar}
                alt={activeBuddy.name}
                className="hud-learner-avatar"
              />
              <span>{activeProfile.childName}</span>
              <span className="hud-caret">▾</span>
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${
                currentView === 'map' || currentView === 'skill' ? 'active' : ''
              }`}
              onClick={() => {
                playSfx('tap', rootState.soundEnabled)
                setCurrentView('map')
              }}
            >
              🗺️ Adventure
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${currentView === 'daily' ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', rootState.soundEnabled)
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
                playSfx('tap', rootState.soundEnabled)
                setCurrentView('library')
              }}
            >
              📚 Library
            </button>

            <button
              type="button"
              className={`hud-tab-btn ${currentView === 'stickers' ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', rootState.soundEnabled)
                setCurrentView('stickers')
              }}
            >
              ⭐ Stickers
            </button>
          </div>

          <div className="hud-status-pills">
            <div className="hud-pill hud-streak" title="Daily Streak">
              🔥 {activeProfile.streak?.count || 0}
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
                setRootState((prev) => ({
                  ...prev,
                  theme: prev.theme === 'blackboard' ? 'daylight' : 'blackboard',
                }))
              }
              title={
                rootState.theme === 'blackboard'
                  ? 'Switch to Storybook Daylight Theme'
                  : 'Switch to Classic Blackboard Theme'
              }
              aria-label="Toggle visual theme"
            >
              {rootState.theme === 'blackboard' ? '☀️' : '🖍️'}
            </button>

            <button
              type="button"
              className="hud-icon-btn"
              onClick={() =>
                setRootState((prev) => ({
                  ...prev,
                  soundEnabled: !prev.soundEnabled,
                }))
              }
              title={
                rootState.soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: Muted'
              }
              aria-label="Toggle sound effects"
            >
              {rootState.soundEnabled ? '🔔' : '🔕'}
            </button>

            <button
              type="button"
              className="hud-icon-btn"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen?.().catch(() => {})
                } else {
                  document.exitFullscreen?.().catch(() => {})
                }
              }}
              title="Toggle Full Screen"
              aria-label="Toggle full screen"
            >
              ⛶
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
        profile={activeProfile}
        onUpdateProfile={updateActiveProfile}
        onResetProfileProgress={handleResetProfileProgress}
        onOpenProfilePicker={() => setCurrentView('profiles')}
      />
    </div>
  )
}

export default App
