import { useState } from 'react'
import StudyBuddy from './StudyBuddy'
import { GRADE_TIERS, MATH_TRACK, READING_TRACK } from '../utils/curriculumData'
import {
  getCurrentFrontierNodes,
  isDailyPracticeDoneToday,
  isNodeUnlocked,
} from '../utils/storage'
import { playSfx, speakText } from '../utils/soundManager'

function AdventureMap({
  profile,
  soundEnabled = true,
  onSelectTier,
  onSelectNode,
  onStartDailyPractice,
  onOpenCountries,
}) {
  const [selectedTrack, setSelectedTrack] = useState('math') // 'math' | 'reading'
  const [showAllTiers, setShowAllTiers] = useState(false)

  const activeTierId = profile?.selectedTier || 2
  const activeTier =
    GRADE_TIERS.find((t) => t.id === activeTierId) || GRADE_TIERS[1]

  const { mathNode, readingNode } = getCurrentFrontierNodes(profile)
  const dailyDone = isDailyPracticeDoneToday(profile)

  const fullTrackNodes = selectedTrack === 'math' ? MATH_TRACK : READING_TRACK
  const visibleNodes = showAllTiers
    ? fullTrackNodes
    : fullTrackNodes.filter((n) => n.tier === activeTierId)

  const currentFrontierId = selectedTrack === 'math' ? mathNode.id : readingNode.id

  const handleTrackSwitch = (track) => {
    playSfx('tap', soundEnabled)
    setSelectedTrack(track)
  }

  const handleNodeClick = (node, unlocked) => {
    if (!unlocked) return
    playSfx('tap', soundEnabled)
    onSelectNode(node.id)
  }

  return (
    <div className="adventure-map">
      {/* 4 Grade-Tier World Selector Bar */}
      <div className="grade-tier-selector">
        {GRADE_TIERS.map((tier) => {
          const isActive = tier.id === activeTierId
          return (
            <button
              key={tier.id}
              type="button"
              className={`grade-tier-pill ${isActive ? 'active' : ''}`}
              onClick={() => {
                playSfx('tap', soundEnabled)
                onSelectTier?.(tier.id)
              }}
            >
              <span className="gt-name">{tier.shortLabel}</span>
              <span className="gt-world">{tier.name}</span>
            </button>
          )
        })}
      </div>

      {/* Illustrated 3D World Banner + Daily Practice Hero */}
      <div
        className="world-banner-hero"
        style={{ backgroundImage: `url(${activeTier.banner})` }}
      >
        <div className="world-banner-overlay">
          <div className="world-banner-left">
            <span className="world-age-tag">{activeTier.ageLabel}</span>
            <h2 className="world-banner-title">{activeTier.name}</h2>
            <p className="world-banner-desc">{activeTier.description}</p>
          </div>

          <div className="world-daily-box">
            <div className="daily-hero-badge">
              {dailyDone ? '✅ Daily Mission Done!' : '⚡ Daily Mission'}
            </div>
            <div className="world-daily-sub">
              {mathNode.title} + {readingNode.title}
            </div>
            <button
              type="button"
              className="btn btn-yellow daily-start-btn"
              onClick={() => {
                playSfx('tap', soundEnabled)
                onStartDailyPractice()
              }}
            >
              {dailyDone ? '⚡ Bonus Workout' : '▶ Start Daily (+3 ⭐)'}
            </button>
          </div>
        </div>
      </div>

      {/* Study Buddy Greeting */}
      <StudyBuddy
        buddyId={profile.buddyId}
        message={`Hi ${profile.childName}! Welcome to ${activeTier.name} (${activeTier.ageLabel}). Pick a stepping stone below!`}
        compact
      />

      {/* Track Switcher Tabs */}
      <div className="track-tabs">
        <button
          type="button"
          className={`track-tab-btn ${selectedTrack === 'math' ? 'active-math' : ''}`}
          onClick={() => handleTrackSwitch('math')}
        >
          <span>🔢</span>
          <span>Math Mastery</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${selectedTrack === 'reading' ? 'active-reading' : ''}`}
          onClick={() => handleTrackSwitch('reading')}
        >
          <span>📖</span>
          <span>Reading & Language Arts</span>
        </button>

        <button
          type="button"
          className="track-tab-btn track-tab-world"
          onClick={() => {
            playSfx('tap', soundEnabled)
            onOpenCountries()
          }}
        >
          <span>🌍</span>
          <span>World Flags</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn track-tab-all ${showAllTiers ? 'active-all' : ''}`}
          onClick={() => {
            playSfx('tap', soundEnabled)
            setShowAllTiers((prev) => !prev)
          }}
        >
          {showAllTiers ? '🔍 Current Tier Only' : '🗺️ Show All 4 Tiers'}
        </button>
      </div>

      {/* Skill Tree / Stepping Stones */}
      <div className="skill-path-grid">
        {visibleNodes.map((node) => {
          const stars = profile.nodeProgress?.[node.id]?.stars || 0
          const unlocked = isNodeUnlocked(node.id, profile)
          const isCurrent = node.id === currentFrontierId

          return (
            <div
              key={node.id}
              className={`skill-node-card ${
                !unlocked
                  ? 'node-locked'
                  : stars === 3
                    ? 'node-mastered'
                    : stars >= 2
                      ? 'node-passed'
                      : 'node-open'
              } ${isCurrent ? 'node-frontier' : ''}`}
            >
              <div className="node-top-row">
                <span className="kumon-badge">
                  Tier {node.tier} &bull; {node.badge}
                </span>
                <button
                  type="button"
                  className="btn-icon-speaker btn-speaker-mini"
                  onClick={(e) => {
                    e.stopPropagation()
                    speakText(`${node.title}. ${node.description}`)
                  }}
                  title="Listen to skill description"
                  aria-label={`Listen to ${node.title}`}
                >
                  🔊
                </button>
              </div>

              <button
                type="button"
                className="node-main-trigger"
                onClick={() => handleNodeClick(node, unlocked)}
                disabled={!unlocked}
              >
                <div
                  className="node-icon-circle"
                  style={{ backgroundColor: node.color }}
                >
                  <span>{unlocked ? node.icon : '🔒'}</span>
                </div>

                <div className="node-text-wrap">
                  <div className="node-title">{node.title}</div>
                  <div className="node-subtitle">{node.subtitle}</div>
                </div>

                <div
                  className="node-stars-row"
                  aria-label={`${stars} out of 3 stars`}
                >
                  {[1, 2, 3].map((s) => (
                    <span
                      key={s}
                      className={s <= stars ? 'star-lit' : 'star-dim'}
                    >
                      {s <= stars ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>

                <div className="node-cta-pill">
                  {!unlocked
                    ? 'Earn 2⭐ above to unlock'
                    : isCurrent
                      ? '▶ Continue Here'
                      : stars === 3
                        ? '👑 Mastered • Replay'
                        : '▶ Practice'}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdventureMap
