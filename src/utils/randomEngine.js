// Smart Shuffle-Bag, Anti-Repetition History & Pedagogical Distractor Engine

const recentHistoryByProfile = new Map()
const MAX_HISTORY_SIZE = 65

function getHistoryBuffer(profileId = 'default') {
  if (!recentHistoryByProfile.has(profileId)) {
    recentHistoryByProfile.set(profileId, [])
  }
  return recentHistoryByProfile.get(profileId)
}

export function recordSeenSignature(signature, profileId = 'default') {
  if (!signature) return
  const buf = getHistoryBuffer(profileId)
  if (!buf.includes(signature)) {
    buf.push(signature)
    if (buf.length > MAX_HISTORY_SIZE) {
      buf.shift()
    }
  }
}

export function hasSeenRecently(signature, profileId = 'default') {
  const buf = getHistoryBuffer(profileId)
  return buf.includes(signature)
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Pick `count` unique items from `pool`, prioritizing items not in the profile's recent history.
 */
export function pickSmartBatch(pool, count, keyFn = (item) => item.id || item.word, profileId = 'default') {
  const unseen = pool.filter((item) => !hasSeenRecently(keyFn(item), profileId))
  const seen = pool.filter((item) => hasSeenRecently(keyFn(item), profileId))

  const ordered = [...shuffle(unseen), ...shuffle(seen)]
  const selected = ordered.slice(0, count)

  selected.forEach((item) => recordSeenSignature(keyFn(item), profileId))
  return selected
}

/**
 * Generate smart, pedagogically meaningful numeric multiple-choice options
 */
export function generateSmartMathChoices(
  correct,
  { min = 0, max = 100, operation = 'addition', a = 0, b = 0 } = {},
) {
  const choices = new Set([correct])
  const candidates = []

  // Pedagogical near-misses
  if (operation === 'multiplication' && a > 0 && b > 0) {
    candidates.push(a * (b + 1), a * Math.max(1, b - 1), (a + 1) * b, a + b)
  } else if (operation === 'division' && b > 0) {
    candidates.push(correct + 1, Math.max(1, correct - 1), correct + 2, b)
  } else if (max >= 30) {
    // 2-digit math: include place-value (+/- 10) slips and +/- 1, 2
    candidates.push(
      correct + 10,
      correct - 10,
      correct + 1,
      correct - 1,
      correct + 2,
      correct - 2,
      Math.abs(a - b),
    )
  } else {
    candidates.push(correct + 1, correct - 1, correct + 2, correct - 2, correct + 3)
  }

  for (const c of shuffle(candidates)) {
    if (choices.size >= 4) break
    if (typeof c === 'number' && !Number.isNaN(c) && c >= min && c <= max && c !== correct) {
      choices.add(c)
    }
  }

  let safety = 0
  while (choices.size < 4 && safety < 40) {
    safety++
    const offset = randomInt(1, Math.max(4, Math.min(12, Math.ceil((max - min) / 4))))
    const sign = Math.random() > 0.5 ? 1 : -1
    const val = correct + offset * sign
    if (val >= min && val <= max) {
      choices.add(val)
    } else {
      choices.add(randomInt(min, Math.max(min + 3, max)))
    }
  }

  return shuffle([...choices])
}

/**
 * Pick a varied question angle for arithmetic questions so equations don't all look identical
 */
export function pickQuestionAngle(allowedAngles = ['standard', 'word', 'reverse', 'missing']) {
  return allowedAngles[randomInt(0, allowedAngles.length - 1)]
}
