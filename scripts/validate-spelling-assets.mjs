// Validate every image URL referenced by Spelling.jsx and confirm it returns
// an actual image. Audio is generated client-side via the Web Speech API
// (SpeechSynthesisUtterance), so we just sanity-check that every word is
// non-empty alphabetic text suitable for pronunciation.

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SPELLING_PATH = resolve(__dirname, '..', 'src', 'components', 'Spelling.jsx')

const TIMEOUT_MS = 15000
const CONCURRENCY = 8

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg'

function emojiToTwemojiUrl(emoji) {
  const codePoints = []
  for (const ch of emoji) {
    const cp = ch.codePointAt(0)
    if (cp === 0xfe0f) continue
    codePoints.push(cp.toString(16))
  }
  return `${TWEMOJI_BASE}/${codePoints.join('-')}.svg`
}

async function loadWordBank() {
  const source = await readFile(SPELLING_PATH, 'utf8')
  const entries = []
  const re = /\{\s*word:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*\}/g
  let match
  while ((match = re.exec(source)) !== null) {
    const [, word, category, emoji] = match
    entries.push({ word, category, emoji, image: emojiToTwemojiUrl(emoji) })
  }
  return entries
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: 'follow' })
  } finally {
    clearTimeout(timer)
  }
}

async function checkImage(entry) {
  const result = { ...entry, ok: false, status: 0, contentType: '', bytes: 0, error: '' }
  try {
    // Pexels blocks plain HEAD sometimes; do a ranged GET for the first bytes.
    const res = await fetchWithTimeout(entry.image, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (asset validator)',
        'Accept': 'image/*,*/*;q=0.8',
        'Range': 'bytes=0-2047',
      },
    })
    result.status = res.status
    result.contentType = res.headers.get('content-type') || ''
    if (!res.ok && res.status !== 206) {
      result.error = `HTTP ${res.status}`
      return result
    }
    const buf = Buffer.from(await res.arrayBuffer())
    result.bytes = buf.length
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
    const isWebp = buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP'
    const isGif = buf.slice(0, 3).toString('ascii') === 'GIF'
    const head = buf.slice(0, 512).toString('utf8')
    const isSvg = head.includes('<svg') || head.includes('<?xml')
    const looksLikeImage =
      isJpeg || isPng || isWebp || isGif || isSvg ||
      result.contentType.startsWith('image/') ||
      result.contentType.includes('svg')
    if (!looksLikeImage) {
      result.error = `not an image (content-type ${result.contentType || 'unknown'})`
      return result
    }
    if (result.bytes < 200) {
      result.error = `suspiciously small payload (${result.bytes} bytes)`
      return result
    }
    result.ok = true
    return result
  } catch (err) {
    result.error = err.name === 'AbortError' ? 'timeout' : err.message
    return result
  }
}

async function runWithConcurrency(items, worker, limit) {
  const results = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const idx = cursor++
      results[idx] = await worker(items[idx], idx)
    }
  })
  await Promise.all(workers)
  return results
}

function validateAudio(entry) {
  const issues = []
  if (!/^[a-z]+$/i.test(entry.word)) issues.push('word contains non-letters; SpeechSynthesis may mispronounce it')
  if (entry.word.length < 2) issues.push('word too short to spell')
  return issues
}

function findDuplicates(entries) {
  const wordCount = new Map()
  const imageCount = new Map()
  for (const e of entries) {
    wordCount.set(e.word, (wordCount.get(e.word) || 0) + 1)
    imageCount.set(e.image, (imageCount.get(e.image) || 0) + 1)
  }
  return {
    duplicateWords: [...wordCount.entries()].filter(([, n]) => n > 1).map(([w]) => w),
    duplicateImages: [...imageCount.entries()].filter(([, n]) => n > 1).map(([img, n]) => {
      const words = entries.filter((e) => e.image === img).map((e) => e.word)
      return { image: img, words, count: n }
    }),
  }
}

async function main() {
  const entries = await loadWordBank()
  console.log(`Loaded ${entries.length} entries from ${SPELLING_PATH}\n`)

  console.log('Validating images...')
  const imgResults = await runWithConcurrency(entries, checkImage, CONCURRENCY)

  const broken = imgResults.filter((r) => !r.ok)
  const okCount = imgResults.length - broken.length
  console.log(`\nImage results: ${okCount}/${imgResults.length} OK`)
  if (broken.length > 0) {
    console.log('\nBROKEN IMAGES:')
    for (const r of broken) {
      console.log(` - ${r.word.padEnd(8)} ${r.error.padEnd(38)} ${r.image}`)
    }
  }

  console.log('\nChecking for duplicate words / images...')
  const dupes = findDuplicates(entries)
  if (dupes.duplicateWords.length === 0 && dupes.duplicateImages.length === 0) {
    console.log('No duplicate words or images.')
  } else {
    if (dupes.duplicateWords.length > 0) console.log('Duplicate words:', dupes.duplicateWords.join(', '))
    for (const d of dupes.duplicateImages) {
      console.log(` - shared image used by [${d.words.join(', ')}]: ${d.image}`)
    }
  }

  console.log('\nValidating words for audio (SpeechSynthesis)...')
  const audioIssues = entries
    .map((e) => ({ word: e.word, issues: validateAudio(e) }))
    .filter((r) => r.issues.length > 0)
  if (audioIssues.length === 0) {
    console.log(`Audio: all ${entries.length} words are pronounceable plain alphabetic strings.`)
  } else {
    for (const r of audioIssues) console.log(` - ${r.word}: ${r.issues.join(', ')}`)
  }

  console.log('\nSummary:')
  console.log(`  Words:           ${entries.length}`)
  console.log(`  Images OK:       ${okCount}`)
  console.log(`  Images broken:   ${broken.length}`)
  console.log(`  Audio OK:        ${entries.length - audioIssues.length}`)
  console.log(`  Audio issues:    ${audioIssues.length}`)

  if (broken.length > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
