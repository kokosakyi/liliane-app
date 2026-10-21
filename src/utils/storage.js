import { MATH_TRACK, READING_TRACK, STICKER_CATALOG } from './curriculumData'

const STORAGE_KEY_V3 = 'liliane_app_v3_profiles'
const LEGACY_KEY_V2 = 'liliane_app_v2_progress'

export function createProfile({
  id = `learner-${Date.now()}`,
  childName = 'Learner',
  buddyId = 'owl',
  selectedTier = 2,
  freeJump = false,
  bonusStars = 0,
  streak = { count: 0, lastCompletedDate: null },
  nodeProgress = {},
} = {}) {
  return {
    id,
    childName,
    buddyId,
    selectedTier,
    freeJump,
    bonusStars,
    streak,
    nodeProgress,
  }
}

export const DEFAULT_PROFILES = [
  createProfile({
    id: 'liliane',
    childName: 'Liliane',
    buddyId: 'owl',
    selectedTier: 3, // Older child default: Tier 3 (Grades 1–2) & Tier 4 ready
  }),
  createProfile({
    id: 'younger-kid',
    childName: 'Little Explorer',
    buddyId: 'bunny',
    selectedTier: 1, // Younger child default: Tier 1 (Pre-K) & Tier 2
  }),
]

export const DEFAULT_ROOT_STATE = {
  theme: 'blackboard',
  soundEnabled: true,
  activeProfileId: 'liliane',
  profiles: DEFAULT_PROFILES,
}

function getTodayDateString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getYesterdayDateString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function loadRootState() {
  if (typeof window === 'undefined') return DEFAULT_ROOT_STATE
  try {
    const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3)
    if (rawV3) {
      const parsed = JSON.parse(rawV3)
      if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        return {
          ...DEFAULT_ROOT_STATE,
          ...parsed,
        }
      }
    }

    // Migrate V2 data into Liliane's profile if present
    const rawV2 = window.localStorage.getItem(LEGACY_KEY_V2)
    if (rawV2) {
      const legacy = JSON.parse(rawV2)
      const migratedLiliane = createProfile({
        id: 'liliane',
        childName: legacy.childName || 'Liliane',
        buddyId: legacy.buddyId || 'owl',
        selectedTier: 3,
        freeJump: Boolean(legacy.freeJump),
        bonusStars: legacy.bonusStars || 0,
        streak: legacy.streak || { count: 0, lastCompletedDate: null },
        nodeProgress: legacy.nodeProgress || {},
      })
      return {
        theme: legacy.theme || 'blackboard',
        soundEnabled: legacy.soundEnabled ?? true,
        activeProfileId: 'liliane',
        profiles: [migratedLiliane, DEFAULT_PROFILES[1]],
      }
    }

    return DEFAULT_ROOT_STATE
  } catch {
    return DEFAULT_ROOT_STATE
  }
}

export function saveRootState(rootState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(rootState))
  } catch {
    // Ignore storage quota errors
  }
}

export function getActiveProfile(rootState) {
  const found = rootState.profiles?.find((p) => p.id === rootState.activeProfileId)
  return found || rootState.profiles?.[0] || DEFAULT_PROFILES[0]
}

export function getTotalStars(profile) {
  if (!profile) return 0
  const nodeStars = Object.values(profile.nodeProgress || {}).reduce(
    (sum, item) => sum + (item.stars || 0),
    0,
  )
  return nodeStars + (profile.bonusStars || 0)
}

export function getUnlockedStickers(totalStars) {
  return STICKER_CATALOG.filter((s) => totalStars >= s.starsRequired)
}

export function getNextStickerToUnlock(totalStars) {
  return STICKER_CATALOG.find((s) => totalStars < s.starsRequired) || null
}

export function calculateStars(firstTryCorrect, totalQuestions) {
  if (firstTryCorrect >= totalQuestions) return 3
  if (firstTryCorrect >= Math.ceil(totalQuestions * 0.65)) return 2
  return 1
}

/**
 * First node of EACH grade tier is unlocked automatically so a child in Tier 1, 2, 3, or 4
 * can start at the beginning of their grade tier immediately!
 * Subsequent nodes within that tier unlock once the prior node has >= 2 stars (or if freeJump is on).
 */
export function isNodeUnlocked(nodeId, profile) {
  if (!profile) return true
  if (profile.freeJump) return true

  const track = nodeId.startsWith('math-') ? MATH_TRACK : READING_TRACK
  const idx = track.findIndex((n) => n.id === nodeId)
  if (idx <= 0) return true

  const currentNode = track[idx]
  const prevNode = track[idx - 1]

  // The first node of any Grade Tier is always unlocked so each child can start their tier right away
  if (currentNode.tier !== prevNode.tier) {
    return true
  }

  const prevStars = profile.nodeProgress?.[prevNode.id]?.stars || 0
  return prevStars >= 2
}

/**
 * Find the active frontier node for Math and Reading within the child's selected Grade Tier
 */
export function getCurrentFrontierNodes(profile) {
  const activeTier = profile?.selectedTier || 2
  const tierMath = MATH_TRACK.filter((n) => n.tier === activeTier)
  const tierReading = READING_TRACK.filter((n) => n.tier === activeTier)

  const mathFrontier =
    tierMath.find((n) => (profile?.nodeProgress?.[n.id]?.stars || 0) < 2) ||
    tierMath[tierMath.length - 1] ||
    MATH_TRACK[0]

  const readingFrontier =
    tierReading.find((n) => (profile?.nodeProgress?.[n.id]?.stars || 0) < 2) ||
    tierReading[tierReading.length - 1] ||
    READING_TRACK[0]

  return {
    mathNode: mathFrontier,
    readingNode: readingFrontier,
  }
}

export function isDailyPracticeDoneToday(profile) {
  const today = getTodayDateString()
  return profile?.streak?.lastCompletedDate === today
}

function updateStreakOnActivity(streak = { count: 0, lastCompletedDate: null }) {
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()

  if (streak.lastCompletedDate === today) {
    return streak
  }
  if (streak.lastCompletedDate === yesterday) {
    return {
      count: (streak.count || 0) + 1,
      lastCompletedDate: today,
    }
  }
  return {
    count: 1,
    lastCompletedDate: today,
  }
}

export function recordNodeCompletion(profile, nodeId, firstTryCorrect, totalQuestions) {
  const earnedStars = calculateStars(firstTryCorrect, totalQuestions)
  const existing = profile.nodeProgress?.[nodeId] || {
    stars: 0,
    attempts: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  }

  const nextNodeProgress = {
    ...profile.nodeProgress,
    [nodeId]: {
      stars: Math.max(existing.stars, earnedStars),
      attempts: existing.attempts + 1,
      bestScore: Math.max(existing.bestScore, firstTryCorrect),
      totalCorrect: existing.totalCorrect + firstTryCorrect,
      totalQuestions: existing.totalQuestions + totalQuestions,
    },
  }

  const nextProfile = {
    ...profile,
    streak: updateStreakOnActivity(profile.streak),
    nodeProgress: nextNodeProgress,
  }

  return {
    nextProfile,
    earnedStars,
    newStarsAdded: Math.max(0, earnedStars - existing.stars),
  }
}

export function recordBonusSessionCompletion(profile, bonusStarsEarned = 3) {
  return {
    ...profile,
    bonusStars: (profile.bonusStars || 0) + bonusStarsEarned,
    streak: updateStreakOnActivity(profile.streak),
  }
}
