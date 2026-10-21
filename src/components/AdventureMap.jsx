import { useState } from 'react'
import StudyBuddy from './StudyBuddy'
import { MATH_TRACK, READING_TRACK } from '../utils/curriculumData'
import {
  getCurrentFrontierNodes,
  isDailyPracticeDoneToday,
  isNodeUnlocked,
} from '../utils/storage'
import { playSfx, speakText } from '../utils/soundManager'

function AdventureMap({
  appState,
  onSelectNode,
  onStartDailyPractice,
  onOpenCountries,
}) {
  const [selectedTrack, setSelectedTrack] = useState('math') // 'math' | 'reading'

  const { mathNode, readingNode } = getCurrentFrontierNodes(appState)
  const dailyDone = isDailyPracticeDoneToday(appState)
  const nodes = selectedTrack === 'math' ? MATH_TRACK : READING_TRACK
  const currentFrontierId = selectedTrack === 'math' ? mathNode.id : readingNode.id

  const handleTrackSwitch = (track) => {
    playSfx('tap', appState.soundEnabled)
    setSelectedTrack(track)
  }

  const handleNodeClick = (node, unlocked) => {
    if (!unlocked) return
    playSfx('tap', appState.soundEnabled)
    onSelectNode(node.id)
  }

  return (
    <div className="adventure-map">
      {/* Study Buddy Greeting */}
      <StudyBuddy
        buddyId={appState.buddyId}
        message={`Hi ${appState.childName}! Pick a skill on your Adventure Map or jump into Today's Daily Practice!`}
      />

      {/* Quick Daily Practice Hero Banner */}
      <div className={`daily-hero-card ${dailyDone ? 'daily-done' : ''}`}>
        <div className="daily-hero-info">
          <div className="daily-hero-badge">
            {dailyDone ? '✅ Completed Today!' : '⚡ Recommended Next'}
          </div>
          <h3 className="daily-hero-title">Daily Practice Workout</h3>
          <p className="daily-hero-desc">
            Mixes <strong>{mathNode.title}</strong> + <strong>{readingNode.title}</strong> + a Story Problem!
          </p>
        </div>
        <button
          type="button"
          className="btn btn-yellow daily-start-btn"
          onClick={() => {
            playSfx('tap', appState.soundEnabled)
            onStartDailyPractice()
          }}
        >
          {dailyDone ? '⚡ Play Bonus Round' : '▶ Start (+3 ⭐)'}
        </button>
      </div>

      {/* Track Switcher Tabs */}
      <div className="track-tabs">
        <button
          type="button"
          className={`track-tab-btn ${selectedTrack === 'math' ? 'active-math' : ''}`}
          onClick={() => handleTrackSwitch('math')}
        >
          <span>🔢</span>
          <span>Math Path (10 Steps)</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${selectedTrack === 'reading' ? 'active-reading' : ''}`}
          onClick={() => handleTrackSwitch('reading')}
        >
          <span>📖</span>
          <span>Reading & Spelling (8 Steps)</span>
        </button>

        <button
          type="button"
          className="track-tab-btn track-tab-world"
          onClick={() => {
            playSfx('tap', appState.soundEnabled)
            onOpenCountries()
          }}
        >
          <span>🌍</span>
          <span>World Flags</span>
        </button>
      </div>

      {/* Skill Tree / Stepping Stones */}
      <div className="skill-path-grid">
        {nodes.map((node, idx) => {
          const stars = appState.nodeProgress?.[node.id]?.stars || 0
          const unlocked = isNodeUnlocked(node.id, appState)
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
                <span className="kumon-badge">Step {idx + 1} &bull; {node.badge}</span>
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
                <div className="node-icon-circle" style={{ backgroundColor: node.color }}>
                  <span>{unlocked ? node.icon : '🔒'}</span>
                </div>

                <div className="node-text-wrap">
                  <div className="node-title">{node.title}</div>
                  <div className="node-subtitle">{node.subtitle}</div>
                </div>

                <div className="node-stars-row" aria-label={`${stars} out of 3 stars`}>
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={s <= stars ? 'star-lit' : 'star-dim'}>
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
