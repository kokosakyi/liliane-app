// Sound Effects (Web Audio API) & Tap-to-Read Speech Synthesis

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Play subtle synthesized sound effects using Web Audio API
 * @param {'tap' | 'correct' | 'wrong' | 'star' | 'fanfare'} type
 * @param {boolean} enabled
 */
export function playSfx(type, enabled = true) {
  if (!enabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    if (type === 'tap') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.06)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.08)
        gain.gain.setValueAtTime(0.12, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.24)
      })
    } else if (type === 'wrong') {
      const notes = [330, 277.18] // E4 -> C#4 gentle nudge
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.12)
        gain.gain.setValueAtTime(0.09, now + i * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.18)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.12)
        osc.stop(now + i * 0.12 + 0.2)
      })
    } else if (type === 'star' || type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)
        gain.gain.setValueAtTime(0.14, now + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.36)
      })
    }
  } catch {
    // Ignore audio context errors on restricted devices
  }
}

function pickEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  if (voices.length === 0) return null
  const friendlyNames = ['samantha', 'karen', 'google us english', 'microsoft zira', 'microsoft aria']
  const lower = (v) => (v.name || '').toLowerCase()
  return (
    voices.find((v) => friendlyNames.some((n) => lower(v).includes(n))) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
    voices[0]
  )
}

/**
 * Tap-to-Read speech synthesis helper.
 * Only invoked on explicit user clicks of a speaker button.
 */
export function speakText(text, { rate = 0.85, pitch = 1.08 } = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
  } catch {}
  try {
    window.speechSynthesis.resume()
  } catch {}

  // Convert math symbols into natural spoken words for a 5-year-old
  const cleanText = String(text)
    .replace(/\+/g, ' plus ')
    .replace(/\s-\s/g, ' minus ')
    .replace(/=/g, ' equals ')
    .replace(/\?/g, ' what number ')
    .replace(/>/g, ' is greater than ')
    .replace(/</g, ' is less than ')
    .replace(/_+/g, ' blank ')

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1
  utterance.lang = 'en-US'
  const voice = pickEnglishVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function spellOutWord(word) {
  if (!word) return
  speakText(word.toUpperCase().split('').join(', '), { rate: 0.72 })
}
