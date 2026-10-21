import { useState } from 'react'
import { GRADE_TIERS, STUDY_BUDDIES } from '../utils/curriculumData'
import { getTotalStars } from '../utils/storage'
import { playSfx } from '../utils/soundManager'

function ProfilePicker({
  profiles,
  activeProfileId,
  soundEnabled = true,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
}) {
  const [editingProfile, setEditingProfile] = useState(null) // null or profile draft object

  const startNewProfile = () => {
    playSfx('tap', soundEnabled)
    setEditingProfile({
      id: `learner-${Date.now()}`,
      childName: '',
      buddyId: 'fox',
      selectedTier: 2,
      isNew: true,
    })
  }

  const startEditProfile = (e, profile) => {
    e.stopPropagation()
    playSfx('tap', soundEnabled)
    setEditingProfile({
      ...profile,
      isNew: false,
    })
  }

  const handleSaveDraft = (e) => {
    e.preventDefault()
    if (!editingProfile) return
    const trimmedName = editingProfile.childName.trim() || 'Explorer'
    playSfx('correct', soundEnabled)
    onSaveProfile({
      ...editingProfile,
      childName: trimmedName,
    })
    setEditingProfile(null)
  }

  if (editingProfile) {
    return (
      <div className="profile-picker-screen">
        <h2 className="title">
          {editingProfile.isNew ? '➕ Add New Learner' : `✏️ Edit ${editingProfile.childName}`}
        </h2>

        <form className="profile-editor-card" onSubmit={handleSaveDraft}>
          <div className="editor-field">
            <label htmlFor="learnerNameInput" className="editor-label">
              Learner’s Name:
            </label>
            <input
              id="learnerNameInput"
              type="text"
              className="parent-text-input editor-input"
              placeholder="Enter name (e.g. Liliane)"
              value={editingProfile.childName}
              maxLength={20}
              autoFocus
              onChange={(e) =>
                setEditingProfile((prev) => ({ ...prev, childName: e.target.value }))
              }
            />
          </div>

          <div className="editor-field">
            <span className="editor-label">Choose a 3D Study Buddy:</span>
            <div className="editor-buddy-grid">
              {STUDY_BUDDIES.map((buddy) => (
                <button
                  key={buddy.id}
                  type="button"
                  className={`editor-buddy-card ${
                    editingProfile.buddyId === buddy.id ? 'active' : ''
                  }`}
                  onClick={() =>
                    setEditingProfile((prev) => ({ ...prev, buddyId: buddy.id }))
                  }
                >
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    className="editor-buddy-img"
                  />
                  <span className="editor-buddy-name">{buddy.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="editor-field">
            <span className="editor-label">Default Grade Tier & Adventure World:</span>
            <div className="editor-tier-grid">
              {GRADE_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  className={`editor-tier-card ${
                    editingProfile.selectedTier === tier.id ? 'active' : ''
                  }`}
                  onClick={() =>
                    setEditingProfile((prev) => ({ ...prev, selectedTier: tier.id }))
                  }
                >
                  <img
                    src={tier.banner}
                    alt={tier.name}
                    className="editor-tier-banner"
                  />
                  <div className="editor-tier-info">
                    <div className="editor-tier-title">{tier.name}</div>
                    <div className="editor-tier-age">{tier.ageLabel}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="editor-actions">
            {!editingProfile.isNew && profiles.length > 1 && (
              <button
                type="button"
                className="btn btn-pink btn-small"
                onClick={() => {
                  onDeleteProfile?.(editingProfile.id)
                  setEditingProfile(null)
                }}
              >
                Delete Profile
              </button>
            )}
            <button
              type="button"
              className="btn btn-back btn-small"
              onClick={() => setEditingProfile(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-green btn-small">
              Save Learner ✓
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="profile-picker-screen">
      <div className="picker-header">
        <h1 className="title">🌟 Who’s Learning Today?</h1>
        <p className="subtitle chalk-text">
          Pick your profile to jump into your own Adventure World!
        </p>
      </div>

      <div className="profile-cards-grid">
        {profiles.map((profile) => {
          const buddy =
            STUDY_BUDDIES.find((b) => b.id === profile.buddyId) || STUDY_BUDDIES[0]
          const tier =
            GRADE_TIERS.find((t) => t.id === profile.selectedTier) || GRADE_TIERS[1]
          const stars = getTotalStars(profile)
          const isCurrent = profile.id === activeProfileId

          return (
            <div
              key={profile.id}
              className={`learner-profile-card ${isCurrent ? 'current-learner' : ''}`}
            >
              <div
                className="learner-card-banner"
                style={{ backgroundImage: `url(${tier.banner})` }}
              >
                <span className="learner-tier-pill">{tier.ageLabel}</span>
                <button
                  type="button"
                  className="learner-edit-btn"
                  onClick={(e) => startEditProfile(e, profile)}
                  title={`Edit ${profile.childName}'s profile`}
                  aria-label={`Edit ${profile.childName}'s profile`}
                >
                  ✏️
                </button>
              </div>

              <button
                type="button"
                className="learner-card-body"
                onClick={() => {
                  playSfx('tap', soundEnabled)
                  onSelectProfile(profile.id)
                }}
              >
                <div className="learner-avatar-wrap">
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    className="learner-avatar-img"
                  />
                </div>

                <h3 className="learner-name">{profile.childName}</h3>
                <p className="learner-world-name">🗺️ {tier.name}</p>

                <div className="learner-stats-pills">
                  <span className="l-stat">⭐ {stars} Stars</span>
                  <span className="l-stat">🔥 {profile.streak?.count || 0} Streak</span>
                </div>

                <div className="btn btn-yellow learner-play-cta">
                  ▶ Play as {profile.childName}
                </div>
              </button>
            </div>
          )
        })}

        {/* Add New Learner Card */}
        <button
          type="button"
          className="learner-profile-card add-learner-card"
          onClick={startNewProfile}
        >
          <div className="add-learner-icon">➕</div>
          <h3 className="learner-name">Add Learner</h3>
          <p className="learner-world-name">
            Create a profile for another sibling or grade level!
          </p>
        </button>
      </div>
    </div>
  )
}

export default ProfilePicker
