import { MATH_TRACK, READING_TRACK, STICKER_CATALOG } from './curriculumData'

const STORAGE_KEY = 'liliane_app_v2_progress'

export const DEFAULT_STATE = {
  childName: 'Liliane',
  buddyId: 'owl',
  theme: 'blackboard', // 'blackboard' | 'daylight'
  soundEnabled: true,
  freeJump: false, // Parent toggle to unlock all levels
  bonusStars: 0,
  streak: {
    count: 0,
    lastCompletedDate: null,
  },
  nodeProgress: {
    // e.g. 'math-1': { stars: 3, attempts: 2, bestScore: 6, totalCorrect: 11, totalQuestions: 12 }
  },
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

export function loadAppState() {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_STATE,
      ...parsed,
      streak: {
        ...DEFAULT_STATE.streak,
        ...(parsed.streak || {}),
      },
      nodeProgress: {
        ...(parsed.nodeProgress || {}),
      },
    }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveAppState(state) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage quota errors
  }
}

export function getTotalStars(state) {
  const nodeStars = Object.values(state.nodeProgress || {}).reduce(
    (sum, item) => sum + (item.stars || 0),
    0,
  )
  return nodeStars + (state.bonusStars || 0)
}

export function getUnlockedStickers(totalStars) {
  return STICKER_CATALOG.filter((s) => totalStars >= s.starsRequired)
}

export function getNextStickerToUnlock(totalStars) {
  return STICKER_CATALOG.find((s) => totalStars < s.starsRequired) || null
}

/**
 * Calculate 1 to 3 stars based on first-try accuracy in a 6-question round:
 * - 6/6 (100%) -> 3 stars (Mastered!)
 * - 4/6 or 5/6 (>= 66%) -> 2 stars (Unlocked next!)
 * - < 4/6 -> 1 star (Completed round!)
 */
export function calculateStars(firstTryCorrect, totalQuestions) {
  if (firstTryCorrect >= totalQuestions) return 3
  if (firstTryCorrect >= Math.ceil(totalQuestions * 0.65)) return 2
  return 1
}

/**
 * Determine if a skill node is unlocked.
 * First node of each track is always unlocked.
 * Subsequent nodes unlock when the previous node in the same track has >= 2 stars,
 * OR when freeJump mode is enabled.
 */
export function isNodeUnlocked(nodeId, state) {
  if (state.freeJump) return true

  const track = nodeId.startsWith('math-') ? MATH_TRACK : READING_TRACK
  const idx = track.findIndex((n) => n.id === nodeId)
  if (idx <= 0) return true

  const prevNode = track[idx - 1]
  const prevStars = state.nodeProgress?.[prevNode.id]?.stars || 0
  return prevStars >= 2
}

/**
 * Find the active "frontier" node for Math and Reading (first node with < 2 stars)
 */
export function getCurrentFrontierNodes(state) {
  const mathFrontier =
    MATH_TRACK.find((n) => (state.nodeProgress?.[n.id]?.stars || 0) < 2) ||
    MATH_TRACK[MATH_TRACK.length - 1]

  const readingFrontier =
    READING_TRACK.find((n) => (state.nodeProgress?.[n.id]?.stars || 0) < 2) ||
    READING_TRACK[READING_TRACK.length - 1]

  return {
    mathNode: mathFrontier,
    readingNode: readingFrontier,
  }
}

export function isDailyPracticeDoneToday(state) {
  const today = getTodayDateString()
  return state.streak?.lastCompletedDate === today
}

function updateStreakOnActivity(streak) {
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

/**
 * Update state after completing a Skill Node round
 */
export function recordNodeCompletion(state, nodeId, firstTryCorrect, totalQuestions) {
  const earnedStars = calculateStars(firstTryCorrect, totalQuestions)
  const existing = state.nodeProgress?.[nodeId] || {
    stars: 0,
    attempts: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  }

  const nextNodeProgress = {
    ...state.nodeProgress,
    [nodeId]: {
      stars: Math.max(existing.stars, earnedStars),
      attempts: existing.attempts + 1,
      bestScore: Math.max(existing.bestScore, firstTryCorrect),
      totalCorrect: existing.totalCorrect + firstTryCorrect,
      totalQuestions: existing.totalQuestions + totalQuestions,
    },
  }

  const nextState = {
    ...state,
    streak: updateStreakOnActivity(state.streak),
    nodeProgress: nextNodeProgress,
  }

  return {
    nextState,
    earnedStars,
    newStarsAdded: Math.max(0, earnedStars - existing.stars),
  }
}

/**
 * Update state after completing Daily Practice or Free Play
 */
export function recordBonusSessionCompletion(state, bonusStarsEarned = 3) {
  const nextState = {
    ...state,
    bonusStars: (state.bonusStars || 0) + bonusStarsEarned,
    streak: updateStreakOnActivity(state.streak),
  }
  return nextState
}
