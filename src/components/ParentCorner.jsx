import { useEffect, useRef, useState } from 'react'
import { MATH_TRACK, READING_TRACK, STUDY_BUDDIES } from '../utils/curriculumData'
import { getTotalStars } from '../utils/storage'

function ParentCorner({
  isOpen,
  onClose,
  appState,
  onUpdateState,
  onResetProgress,
}) {
  const dialogRef = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // Fallback for browsers without declarative <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClick = (event) => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        if (event.target !== dialog) return
        const rect = dialog.getBoundingClientRect()
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width

        if (isDialogContent) return
        dialog.close()
      }
    }

    const handleClose = () => {
      setConfirmReset(false)
      onClose?.()
    }

    dialog.addEventListener('click', handleClick)
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('click', handleClick)
      dialog.removeEventListener('close', handleClose)
    }
  }, [onClose])

  const totalStars = getTotalStars(appState)
  const mathMasteredCount = MATH_TRACK.filter(
    (n) => (appState.nodeProgress?.[n.id]?.stars || 0) >= 2,
  ).length
  const readingMasteredCount = READING_TRACK.filter(
    (n) => (appState.nodeProgress?.[n.id]?.stars || 0) >= 2,
  ).length

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="parentDialogTitle"
      className="parent-dialog"
    >
      <div className="parent-dialog-inner">
        <div className="parent-header">
          <h2 id="parentDialogTitle" className="parent-title">
            ⚙️ Parent Corner & Progress Report
          </h2>
          <button
            type="button"
            className="btn btn-back btn-small"
            onClick={() => dialogRef.current?.close()}
          >
            ✕ Close
          </button>
        </div>

        {/* Summary Cards */}
        <div className="parent-stats-row">
          <div className="parent-stat-card">
            <div className="stat-val">⭐ {totalStars}</div>
            <div className="stat-lbl">Total Stars</div>
          </div>
          <div className="parent-stat-card">
            <div className="stat-val">🔥 {appState.streak?.count || 0}</div>
            <div className="stat-lbl">Day Streak</div>
          </div>
          <div className="parent-stat-card">
            <div className="stat-val">
              {mathMasteredCount}/{MATH_TRACK.length}
            </div>
            <div className="stat-lbl">Math Levels</div>
          </div>
          <div className="parent-stat-card">
            <div className="stat-val">
              {readingMasteredCount}/{READING_TRACK.length}
            </div>
            <div className="stat-lbl">Reading Levels</div>
          </div>
        </div>

        {/* Profile & Unlock Settings */}
        <div className="parent-settings-box">
          <div className="parent-setting-item">
            <label htmlFor="childNameInput" className="parent-label">
              Child’s Name:
            </label>
            <input
              id="childNameInput"
              type="text"
              className="parent-text-input"
              value={appState.childName}
              maxLength={20}
              onChange={(e) =>
                onUpdateState({ childName: e.target.value || 'Liliane' })
              }
            />
          </div>

          <div className="parent-setting-item">
            <span className="parent-label">Study Buddy Mascot:</span>
            <div className="buddy-picker-row">
              {STUDY_BUDDIES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`buddy-pick-btn ${appState.buddyId === b.id ? 'active' : ''}`}
                  onClick={() => onUpdateState({ buddyId: b.id })}
                >
                  <span>{b.emoji}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="parent-setting-item parent-toggle-row">
            <div>
              <div className="parent-label">🔓 Unlock All Skill Levels (Free-Jump Mode)</div>
              <div className="parent-sublabel">
                Allow jumping to any Math or Reading skill node without needing 2⭐ on prior steps.
              </div>
            </div>
            <button
              type="button"
              className={`btn btn-small ${appState.freeJump ? 'btn-green' : 'btn-back'}`}
              onClick={() => onUpdateState({ freeJump: !appState.freeJump })}
            >
              {appState.freeJump ? 'ON (All Unlocked)' : 'OFF (Sequential)'}
            </button>
          </div>
        </div>

        {/* Skill Mastery Breakdown */}
        <div className="parent-tracks-columns">
          <div className="parent-track-col">
            <h3 className="parent-col-title">🔢 Math Track Mastery</h3>
            <div className="parent-node-list">
              {MATH_TRACK.map((node) => {
                const prog = appState.nodeProgress?.[node.id]
                const stars = prog?.stars || 0
                const acc =
                  prog?.totalQuestions > 0
                    ? Math.round((prog.totalCorrect / prog.totalQuestions) * 100)
                    : null
                return (
                  <div key={node.id} className="parent-node-row">
                    <span className="p-node-badge">{node.badge}</span>
                    <span className="p-node-name">{node.title}</span>
                    <span className="p-node-stars">
                      {'⭐'.repeat(stars)}
                      {'☆'.repeat(3 - stars)}
                    </span>
                    <span className="p-node-acc">
                      {acc !== null ? `${acc}%` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="parent-track-col">
            <h3 className="parent-col-title">📖 Reading Track Mastery</h3>
            <div className="parent-node-list">
              {READING_TRACK.map((node) => {
                const prog = appState.nodeProgress?.[node.id]
                const stars = prog?.stars || 0
                const acc =
                  prog?.totalQuestions > 0
                    ? Math.round((prog.totalCorrect / prog.totalQuestions) * 100)
                    : null
                return (
                  <div key={node.id} className="parent-node-row">
                    <span className="p-node-badge">{node.badge}</span>
                    <span className="p-node-name">{node.title}</span>
                    <span className="p-node-stars">
                      {'⭐'.repeat(stars)}
                      {'☆'.repeat(3 - stars)}
                    </span>
                    <span className="p-node-acc">
                      {acc !== null ? `${acc}%` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="parent-footer">
          {!confirmReset ? (
            <button
              type="button"
              className="btn btn-pink btn-small"
              onClick={() => setConfirmReset(true)}
            >
              Reset All Progress
            </button>
          ) : (
            <div className="reset-confirm-row">
              <span>Are you sure you want to reset stars and stickers?</span>
              <button
                type="button"
                className="btn btn-pink btn-small"
                onClick={() => {
                  onResetProgress()
                  setConfirmReset(false)
                }}
              >
                Yes, Reset
              </button>
              <button
                type="button"
                className="btn btn-back btn-small"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default ParentCorner
