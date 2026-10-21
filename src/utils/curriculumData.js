import { generateStoryProblem } from './questionGenerator'
import {
  generateSmartMathChoices,
  hasSeenRecently,
  pickSmartBatch,
  randomInt,
  recordSeenSignature,
  shuffle,
} from './randomEngine'

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg'

export function emojiToTwemojiUrl(emoji) {
  const codePoints = []
  for (const ch of emoji) {
    const cp = ch.codePointAt(0)
    if (cp === 0xfe0f) continue
    codePoints.push(cp.toString(16))
  }
  return `${TWEMOJI_BASE}/${codePoints.join('-')}.svg`
}

export const GRADE_TIERS = [
  {
    id: 1,
    name: 'Sunny Meadow',
    ageLabel: 'Ages 3–4 • Pre-K',
    shortLabel: 'Tier 1: Pre-K',
    badge: 'Pre-K',
    banner: '/assets/nano/world-tier1-meadow.png',
    color: '#98d8aa',
    description: 'Counting, ten-frames, gentle +1/-1 hops, letter sounds & 3-letter words.',
  },
  {
    id: 2,
    name: 'Treehouse Village',
    ageLabel: 'Ages 5–6 • Kindergarten',
    shortLabel: 'Tier 2: Kinder',
    badge: 'Kinder',
    banner: '/assets/nano/world-tier2-treehouse.png',
    color: '#ffd93d',
    description: 'Making 10, doubles, teen numbers, blends, 4–5 letter words & sight words.',
  },
  {
    id: 3,
    name: 'Explorer Island',
    ageLabel: 'Ages 6–7 • Grades 1–2',
    shortLabel: 'Tier 3: Gr 1–2',
    badge: 'Gr 1–2',
    banner: '/assets/nano/world-tier3-island.png',
    color: '#a8d8ea',
    description: '2-digit math, place value, intro multiplication, coins/time, 6–7 letter words & grammar.',
  },
  {
    id: 4,
    name: 'Cosmic Academy',
    ageLabel: 'Ages 8–10 • Grades 3–4',
    shortLabel: 'Tier 4: Gr 3–4',
    badge: 'Gr 3–4',
    banner: '/assets/nano/world-tier4-cosmic.png',
    color: '#c9b1ff',
    description: 'Times tables 2x–12x, division, fractions, multi-step stories, 8–9 letter words & reading passages.',
  },
]

export const STUDY_BUDDIES = [
  {
    id: 'owl',
    name: 'Professor Hoot',
    emoji: '🦉',
    avatar: '/assets/nano/buddy-owl.png',
    greeting: 'Hoot hoot! Let’s explore new skills together!',
    cheers: ['Wise move!', 'Hoot-ray! Spot on!', 'Super sharp thinking!'],
  },
  {
    id: 'bunny',
    name: 'Barnaby Bunny',
    emoji: '🐰',
    avatar: '/assets/nano/buddy-bunny.png',
    greeting: 'Hop on in! Ready to bounce through today’s puzzles?',
    cheers: ['Hop-tastic!', 'You leaped right to the answer!', 'Brilliant work!'],
  },
  {
    id: 'bear',
    name: 'Bella Bear',
    emoji: '🐻',
    avatar: '/assets/nano/buddy-bear.png',
    greeting: 'Big bear high-five! Let’s power up your brain today!',
    cheers: ['Bear-y awesome!', 'Paws-itively brilliant!', 'You are unstoppable!'],
  },
  {
    id: 'fox',
    name: 'Finley Fox',
    emoji: '🦊',
    avatar: '/assets/nano/buddy-fox.png',
    greeting: 'Clever fox time! Which challenge shall we master next?',
    cheers: ['Clever as a fox!', 'Brilliant deduction!', 'Fantastic job!'],
  },
]

export const STICKER_CATALOG = [
  { id: 's1', name: 'Happy Star', emoji: '🌟', category: 'Space', starsRequired: 1, fact: 'Stars are giant glowing balls of gas in space!' },
  { id: 's2', name: 'Cuddly Kitten', emoji: '🐱', category: 'Animals', starsRequired: 3, fact: 'Kittens purr when they are happy and cozy.' },
  { id: 's3', name: 'Rocket Ship', emoji: '🚀', category: 'Space', starsRequired: 6, fact: 'Rockets travel faster than sound to reach outer space!' },
  { id: 's4', name: 'Baby Chick', emoji: '🐣', category: 'Animals', starsRequired: 9, fact: 'Baby chicks peck their way out of cozy eggs.' },
  { id: 's5', name: 'Rainbow', emoji: '🌈', category: 'Nature', starsRequired: 12, fact: 'Rainbows happen when sunlight shines through raindrops!' },
  { id: 's6', name: 'T-Rex', emoji: '🦖', category: 'Dinosaurs', starsRequired: 16, fact: 'T-Rex had giant teeth the size of bananas!' },
  { id: 's7', name: 'Strawberry Cupcake', emoji: '🧁', category: 'Treats', starsRequired: 20, fact: 'Cupcakes were once called 1-2-3-4 cakes because of their recipe!' },
  { id: 's8', name: 'Friendly Dolphin', emoji: '🐬', category: 'Animals', starsRequired: 25, fact: 'Dolphins talk to each other using clicks and whistles.' },
  { id: 's9', name: 'Ringed Planet', emoji: '🪐', category: 'Space', starsRequired: 30, fact: 'Saturn’s rings are made of millions of icy snowballs!' },
  { id: 's10', name: 'Bronto Dino', emoji: '🦕', category: 'Dinosaurs', starsRequired: 35, fact: 'Long-necked dinosaurs ate leaves from the tallest trees.' },
  { id: 's11', name: 'Unicorn Magic', emoji: '🦄', category: 'Magic', starsRequired: 40, fact: 'Unicorns are legendary creatures of kindness and wonder!' },
  { id: 's12', name: 'Ice Cream Cone', emoji: '🍦', category: 'Treats', starsRequired: 45, fact: 'Vanilla is the world’s most popular ice cream flavor!' },
  { id: 's13', name: 'Clever Octopus', emoji: '🐙', category: 'Animals', starsRequired: 50, fact: 'An octopus has eight arms and three hearts!' },
  { id: 's14', name: 'Full Moon', emoji: '🌕', category: 'Space', starsRequired: 56, fact: 'Astronauts walked on the Moon and left footprints there!' },
  { id: 's15', name: 'Colorful Butterfly', emoji: '🦋', category: 'Nature', starsRequired: 62, fact: 'Butterflies taste their food with their feet!' },
  { id: 's16', name: 'Rock Guitar', emoji: '🎸', category: 'Music', starsRequired: 68, fact: 'Guitars have six strings that vibrate to make music.' },
  { id: 's17', name: 'Giant Panda', emoji: '🐼', category: 'Animals', starsRequired: 75, fact: 'Pandas spend up to 12 hours a day munching bamboo!' },
  { id: 's18', name: 'Shooting Star', emoji: '🌠', category: 'Space', starsRequired: 82, fact: 'Shooting stars are tiny space rocks burning up in the sky.' },
  { id: 's19', name: 'Pink Flamingo', emoji: '🦩', category: 'Animals', starsRequired: 90, fact: 'Flamingos turn pink from eating shrimp and algae!' },
  { id: 's20', name: 'Artist Palette', emoji: '🎨', category: 'Music', starsRequired: 98, fact: 'Mixing red, yellow, and blue lets you paint almost any color!' },
  { id: 's21', name: 'Koala Bear', emoji: '🐨', category: 'Animals', starsRequired: 106, fact: 'Koalas sleep up to 20 hours a day in eucalyptus trees.' },
  { id: 's22', name: 'Golden Crown', emoji: '👑', category: 'Magic', starsRequired: 115, fact: 'You are royalty in the Kingdom of Learning!' },
  { id: 's23', name: 'World Globe', emoji: '🌍', category: 'Nature', starsRequired: 125, fact: 'Earth is the only planet we know with oceans and forests!' },
  { id: 's24', name: 'Grand Champion Trophy', emoji: '🏆', category: 'Magic', starsRequired: 135, fact: 'You are an all-star across Math and Reading adventures!' },
]

// ==================== 22 MATH MASTERY NODES (TIERS 1 TO 4) ====================
export const MATH_TRACK = [
  // ── Tier 1: Ages 3–4 (Pre-K) ──
  {
    id: 'math-1',
    tier: 1,
    stepNumber: 1,
    track: 'math',
    title: 'Count to 5',
    subtitle: 'Touch & Count',
    badge: '4A',
    icon: '🍎',
    color: '#98d8aa',
    description: 'Count 1 to 5 colorful items.',
  },
  {
    id: 'math-2',
    tier: 1,
    stepNumber: 2,
    track: 'math',
    title: 'Ten-Frame (1–10)',
    subtitle: 'See Quantities',
    badge: '3A',
    icon: '🔟',
    color: '#FFE135',
    description: 'Count objects inside a 10-frame grid.',
  },
  {
    id: 'math-3',
    tier: 1,
    stepNumber: 3,
    track: 'math',
    title: 'Add +1 & +2',
    subtitle: 'Number Line Hops',
    badge: '3A+',
    icon: '🐸',
    color: '#90EE90',
    description: 'Hop forward 1 or 2 steps on the number line.',
  },
  {
    id: 'math-4',
    tier: 1,
    stepNumber: 4,
    track: 'math',
    title: 'Take Away -1',
    subtitle: 'Gentle Subtraction',
    badge: '2A-',
    icon: '🎈',
    color: '#FFB6C1',
    description: 'Take 1 away and count how many are left.',
  },
  {
    id: 'math-5',
    tier: 1,
    stepNumber: 5,
    track: 'math',
    title: 'More or Fewer',
    subtitle: 'Visual Compare',
    badge: '2A',
    icon: '⚖️',
    color: '#87CEEB',
    description: 'See which group has more, fewer, or the same!',
  },

  // ── Tier 2: Ages 5–6 (Kindergarten) ──
  {
    id: 'math-6',
    tier: 2,
    stepNumber: 6,
    track: 'math',
    title: 'Adding +3, +4, +5',
    subtitle: 'Sums to 10',
    badge: 'A1',
    icon: '➕',
    color: '#87CEEB',
    description: 'Add 3, 4, or 5 using color-coded ten-frames.',
  },
  {
    id: 'math-7',
    tier: 2,
    stepNumber: 7,
    track: 'math',
    title: 'Doubles Power',
    subtitle: '1+1 up to 6+6',
    badge: 'A2',
    icon: '👯',
    color: '#FFB6C1',
    description: 'Master twin numbers like 3+3, 4+4, 5+5, and 6+6.',
  },
  {
    id: 'math-8',
    tier: 2,
    stepNumber: 8,
    track: 'math',
    title: 'Making 10 Bonds',
    subtitle: 'Fill the 10-Frame',
    badge: 'A3',
    icon: '🎯',
    color: '#DDA0DD',
    description: 'Find the missing partner that adds up to 10!',
  },
  {
    id: 'math-9',
    tier: 2,
    stepNumber: 9,
    track: 'math',
    title: 'Subtract within 10',
    subtitle: 'Hop & Cross Out',
    badge: 'A4',
    icon: '➖',
    color: '#FFA07A',
    description: 'Subtract numbers up to 10 with visual clues.',
  },
  {
    id: 'math-10',
    tier: 2,
    stepNumber: 10,
    track: 'math',
    title: 'Compare Symbols',
    subtitle: '>, <, or =',
    badge: 'B1',
    icon: '🐊',
    color: '#7FE5D8',
    description: 'Compare numbers up to 20 using >, <, or =.',
  },
  {
    id: 'math-11',
    tier: 2,
    stepNumber: 11,
    track: 'math',
    title: 'Teen Numbers to 20',
    subtitle: 'Double Ten-Frames',
    badge: 'B2',
    icon: '🚀',
    color: '#FFE135',
    description: 'Add and subtract teen numbers up to 20!',
  },

  // ── Tier 3: Ages 6–7 (Grades 1–2) ──
  {
    id: 'math-12',
    tier: 3,
    stepNumber: 12,
    track: 'math',
    title: 'Place Value Tens & Ones',
    subtitle: 'Base-10 Blocks',
    badge: 'C1',
    icon: '🧱',
    color: '#FFE135',
    description: 'Combine tens rods and ones cubes to build 2-digit numbers.',
  },
  {
    id: 'math-13',
    tier: 3,
    stepNumber: 13,
    track: 'math',
    title: '2-Digit Addition',
    subtitle: 'Sums to 100',
    badge: 'C2',
    icon: '🧮',
    color: '#90EE90',
    description: 'Add two-digit numbers using place value strategies.',
  },
  {
    id: 'math-14',
    tier: 3,
    stepNumber: 14,
    track: 'math',
    title: '2-Digit Subtraction',
    subtitle: 'Differences to 100',
    badge: 'C3',
    icon: '📉',
    color: '#FFB6C1',
    description: 'Subtract two-digit numbers accurately.',
  },
  {
    id: 'math-15',
    tier: 3,
    stepNumber: 15,
    track: 'math',
    title: 'Mystery Number Algebra',
    subtitle: 'Find the ? in Equations',
    badge: 'C4',
    icon: '🕵️',
    color: '#DDA0DD',
    description: 'Solve missing-number puzzles like 8 + ? = 21 and ? - 7 = 15.',
  },
  {
    id: 'math-16',
    tier: 3,
    stepNumber: 16,
    track: 'math',
    title: 'Intro Multiplication',
    subtitle: '2x, 5x, 10x Arrays',
    badge: 'D1',
    icon: '✖️',
    color: '#87CEEB',
    description: 'Count equal rows and columns to multiply by 2, 5, and 10!',
  },
  {
    id: 'math-17',
    tier: 3,
    stepNumber: 17,
    track: 'math',
    title: 'Coins & Telling Time',
    subtitle: 'Money & Clocks',
    badge: 'D2',
    icon: '⏰',
    color: '#FFA07A',
    description: 'Count quarters, dimes, nickels & read analog clock faces!',
  },

  // ── Tier 4: Ages 8–10 (Grades 3–4) ──
  {
    id: 'math-18',
    tier: 4,
    stepNumber: 18,
    track: 'math',
    title: 'Times Tables (2x–12x)',
    subtitle: 'Multiplication Mastery',
    badge: 'E1',
    icon: '⚡',
    color: '#FFE135',
    description: 'Master multiplication facts from 2×2 up to 12×12!',
  },
  {
    id: 'math-19',
    tier: 4,
    stepNumber: 19,
    track: 'math',
    title: 'Division Facts',
    subtitle: 'Equal Sharing ÷',
    badge: 'E2',
    icon: '➗',
    color: '#90EE90',
    description: 'Divide numbers into equal groups using multiplication inverses.',
  },
  {
    id: 'math-20',
    tier: 4,
    stepNumber: 20,
    track: 'math',
    title: 'Visual Fractions',
    subtitle: 'Parts of a Whole',
    badge: 'F1',
    icon: '🍕',
    color: '#FFB6C1',
    description: 'Identify and compare fractions using interactive pies and bars.',
  },
  {
    id: 'math-21',
    tier: 4,
    stepNumber: 21,
    track: 'math',
    title: 'Order of Operations',
    subtitle: '2-Step Equations',
    badge: 'F2',
    icon: '🧠',
    color: '#c9b1ff',
    description: 'Solve two-step expressions with parentheses like (5 × 4) + 8.',
  },
  {
    id: 'math-22',
    tier: 4,
    stepNumber: 22,
    track: 'math',
    title: 'Multi-Step Word Stories',
    subtitle: 'Real-World Challenges',
    badge: 'G1',
    icon: '🏆',
    color: '#7FE5D8',
    description: 'Solve multi-step adventure word problems with illustrated scenes!',
  },
]

// ==================== 16 READING & LANGUAGE ARTS NODES (TIERS 1 TO 4) ====================
export const READING_TRACK = [
  // ── Tier 1: Ages 3–4 (Pre-K) ──
  {
    id: 'read-1',
    tier: 1,
    stepNumber: 1,
    track: 'reading',
    title: 'Beginning Sounds',
    subtitle: 'First Letter Phonics',
    badge: '7A',
    icon: '🔤',
    color: '#FFE135',
    description: 'Look at the picture and pick its starting letter sound!',
  },
  {
    id: 'read-2',
    tier: 1,
    stepNumber: 2,
    track: 'reading',
    title: 'Ending Sounds',
    subtitle: 'Last Letter Phonics',
    badge: '6A',
    icon: '🎵',
    color: '#90EE90',
    description: 'Find the consonant sound at the end of the word.',
  },
  {
    id: 'read-3',
    tier: 1,
    stepNumber: 3,
    track: 'reading',
    title: 'Short Vowel Power',
    subtitle: 'A, E, I, O, U',
    badge: '5A',
    icon: '🌟',
    color: '#FFB6C1',
    description: 'Fill in the missing middle vowel in 3-letter words.',
  },
  {
    id: 'read-4',
    tier: 1,
    stepNumber: 4,
    track: 'reading',
    title: '3-Letter CVC Words',
    subtitle: 'Tap Tiles to Spell',
    badge: '4A',
    icon: '🐱',
    color: '#87CEEB',
    description: 'Build 3-letter words using scrambled letter tiles.',
  },

  // ── Tier 2: Ages 5–6 (Kindergarten) ──
  {
    id: 'read-5',
    tier: 2,
    stepNumber: 5,
    track: 'reading',
    title: '4-Letter Blends',
    subtitle: 'Word Builders',
    badge: '3A',
    icon: '🐸',
    color: '#DDA0DD',
    description: 'Spell 4-letter words like FROG, STAR, SHIP, and MILK.',
  },
  {
    id: 'read-6',
    tier: 2,
    stepNumber: 6,
    track: 'reading',
    title: '5-Letter Challenge',
    subtitle: 'Super Speller',
    badge: '2A',
    icon: '🐯',
    color: '#FFA07A',
    description: 'Build 5-letter words with extra challenge tiles!',
  },
  {
    id: 'read-7',
    tier: 2,
    stepNumber: 7,
    track: 'reading',
    title: 'Sight Words Flash',
    subtitle: 'Everyday Words',
    badge: 'A1',
    icon: '👀',
    color: '#7FE5D8',
    description: 'Spot high-frequency kindergarten sight words in context!',
  },
  {
    id: 'read-8',
    tier: 2,
    stepNumber: 8,
    track: 'reading',
    title: 'Sentence Builder',
    subtitle: 'Read & Complete',
    badge: 'A2',
    icon: '📚',
    color: '#FFE135',
    description: 'Read a picture sentence and pick the word that fits.',
  },

  // ── Tier 3: Ages 6–7 (Grades 1–2) ──
  {
    id: 'read-9',
    tier: 3,
    stepNumber: 9,
    track: 'reading',
    title: '6 & 7-Letter Speller',
    subtitle: 'Spelling Bee Stage 1',
    badge: 'B1',
    icon: '🐝',
    color: '#FFE135',
    description: 'Spell 6 and 7-letter words like RAINBOW, DOLPHIN, and VOLCANO.',
  },
  {
    id: 'read-10',
    tier: 3,
    stepNumber: 10,
    track: 'reading',
    title: 'Synonyms & Antonyms',
    subtitle: 'Same & Opposite',
    badge: 'B2',
    icon: '🔄',
    color: '#90EE90',
    description: 'Match words with similar meanings (synonyms) or opposites (antonyms).',
  },
  {
    id: 'read-11',
    tier: 3,
    stepNumber: 11,
    track: 'reading',
    title: 'Grammar Detective',
    subtitle: 'Nouns, Verbs & Adjectives',
    badge: 'C1',
    icon: '🔍',
    color: '#87CEEB',
    description: 'Spot action verbs, naming nouns, and describing adjectives!',
  },
  {
    id: 'read-12',
    tier: 3,
    stepNumber: 12,
    track: 'reading',
    title: 'Compounds & Plurals',
    subtitle: 'Word Transformations',
    badge: 'C2',
    icon: '🧩',
    color: '#FFB6C1',
    description: 'Combine compound words and master tricky plurals like MICE & LEAVES.',
  },

  // ── Tier 4: Ages 8–10 (Grades 3–4) ──
  {
    id: 'read-13',
    tier: 4,
    stepNumber: 13,
    track: 'reading',
    title: '8 & 9-Letter Champions',
    subtitle: 'Grand Spelling Bee',
    badge: 'D1',
    icon: '🏆',
    color: '#FFE135',
    description: 'Spell big championship words like ASTRONAUT, BUTTERFLY & TELESCOPE.',
  },
  {
    id: 'read-14',
    tier: 4,
    stepNumber: 14,
    track: 'reading',
    title: 'Homophones & Usage',
    subtitle: 'Their / There / They’re',
    badge: 'D2',
    icon: '🎯',
    color: '#DDA0DD',
    description: 'Pick the right sound-alike word for each sentence!',
  },
  {
    id: 'read-15',
    tier: 4,
    stepNumber: 15,
    track: 'reading',
    title: 'Vocabulary in Context',
    subtitle: 'Word Detective',
    badge: 'E1',
    icon: '💡',
    color: '#7FE5D8',
    description: 'Use sentence context clues to unlock advanced vocabulary words.',
  },
  {
    id: 'read-16',
    tier: 4,
    stepNumber: 16,
    track: 'reading',
    title: 'Reading Comprehension',
    subtitle: 'Story & Science Passages',
    badge: 'E2',
    icon: '📖',
    color: '#90EE90',
    description: 'Read illustrated adventure & science stories and answer questions!',
  },
]

export const ALL_NODES = [...MATH_TRACK, ...READING_TRACK]

// ==================== EXPANDED WORD BANK (3 TO 9 LETTERS) ====================
export const WORD_BANK = [
  // 3-letter CVC words
  { word: 'cat', category: 'Animal', emoji: '🐱', sentence: 'The sleepy ___ naps on the warm rug.' },
  { word: 'dog', category: 'Animal', emoji: '🐶', sentence: 'The friendly ___ wags its tail.' },
  { word: 'hen', category: 'Animal', emoji: '🐔', sentence: 'The red ___ laid a speckled egg.' },
  { word: 'cow', category: 'Animal', emoji: '🐄', sentence: 'The farm ___ munches green grass.' },
  { word: 'ant', category: 'Animal', emoji: '🐜', sentence: 'A tiny ___ carries a big leaf.' },
  { word: 'bee', category: 'Animal', emoji: '🐝', sentence: 'The buzzing ___ collects sweet nectar.' },
  { word: 'owl', category: 'Animal', emoji: '🦉', sentence: 'The wise ___ hoots in the oak tree.' },
  { word: 'fox', category: 'Animal', emoji: '🦊', sentence: 'The clever orange ___ has a bushy tail.' },
  { word: 'pig', category: 'Animal', emoji: '🐷', sentence: 'The pink ___ rolls in the mud.' },
  { word: 'sun', category: 'Nature', emoji: '☀️', sentence: 'The bright yellow ___ warms the meadow.' },
  { word: 'hat', category: 'Thing', emoji: '🎩', sentence: 'Put the cozy ___ on your head.' },
  { word: 'cup', category: 'Thing', emoji: '☕', sentence: 'Pour warm cocoa into the ___.' },
  { word: 'bus', category: 'Thing', emoji: '🚌', sentence: 'We ride the yellow school ___.' },
  { word: 'bed', category: 'Thing', emoji: '🛏️', sentence: 'Tuck the blanket onto the cozy ___.' },
  { word: 'box', category: 'Thing', emoji: '📦', sentence: 'The puzzle is inside the cardboard ___.' },
  { word: 'map', category: 'Thing', emoji: '🗺️', sentence: 'Follow the treasure ___ across the island.' },
  { word: 'net', category: 'Thing', emoji: '🥅', sentence: 'Kick the ball right into the ___!' },
  { word: 'log', category: 'Nature', emoji: '🪵', sentence: 'Three frogs sat on a mossy ___.' },

  // 4-letter words
  { word: 'frog', category: 'Animal', emoji: '🐸', sentence: 'The green ___ leaps onto a lily pad.' },
  { word: 'duck', category: 'Animal', emoji: '🦆', sentence: 'The yellow ___ paddles across the pond.' },
  { word: 'bear', category: 'Animal', emoji: '🐻', sentence: 'The brown ___ fishes in the river.' },
  { word: 'fish', category: 'Animal', emoji: '🐟', sentence: 'A silver ___ darts through the coral reef.' },
  { word: 'lion', category: 'Animal', emoji: '🦁', sentence: 'The golden ___ roars across the savanna.' },
  { word: 'bird', category: 'Animal', emoji: '🐦', sentence: 'A little blue ___ builds a twig nest.' },
  { word: 'crab', category: 'Animal', emoji: '🦀', sentence: 'The red ___ walks sideways on the beach.' },
  { word: 'swan', category: 'Animal', emoji: '🦢', sentence: 'A graceful white ___ glides on the lake.' },
  { word: 'ball', category: 'Thing', emoji: '⚽', sentence: 'Pass the soccer ___ to your teammate!' },
  { word: 'book', category: 'Thing', emoji: '📚', sentence: 'Open your favorite adventure ___.' },
  { word: 'cake', category: 'Food', emoji: '🎂', sentence: 'We decorated the birthday ___ with berries.' },
  { word: 'milk', category: 'Food', emoji: '🥛', sentence: 'Pour a tall glass of cold ___.' },
  { word: 'star', category: 'Nature', emoji: '⭐', sentence: 'Spot the brightest ___ in the night sky.' },
  { word: 'drum', category: 'Thing', emoji: '🥁', sentence: 'Tap a steady rhythm on the ___.' },
  { word: 'boat', category: 'Thing', emoji: '⛵', sentence: 'The wooden ___ sails across the bay.' },
  { word: 'shoe', category: 'Thing', emoji: '👟', sentence: 'Tie the laces on your running ___.' },
  { word: 'tree', category: 'Nature', emoji: '🌳', sentence: 'Climb up to the wooden ___ house.' },
  { word: 'moon', category: 'Space', emoji: '🌕', sentence: 'The full ___ glows silver at night.' },

  // 5-letter words
  { word: 'tiger', category: 'Animal', emoji: '🐯', sentence: 'The striped ___ pads quietly through the jungle.' },
  { word: 'horse', category: 'Animal', emoji: '🐴', sentence: 'The brown ___ gallops across the pasture.' },
  { word: 'shark', category: 'Animal', emoji: '🦈', sentence: 'A sleek ___ swims through the deep blue sea.' },
  { word: 'snake', category: 'Animal', emoji: '🐍', sentence: 'The patterned ___ sunbathes on a warm rock.' },
  { word: 'mouse', category: 'Animal', emoji: '🐭', sentence: 'A tiny field ___ scurries under the fence.' },
  { word: 'whale', category: 'Animal', emoji: '🐋', sentence: 'The humpback ___ leaps out of the ocean!' },
  { word: 'panda', category: 'Animal', emoji: '🐼', sentence: 'The giant ___ crunches fresh green bamboo.' },
  { word: 'zebra', category: 'Animal', emoji: '🦓', sentence: 'Every ___ has its own unique stripe pattern.' },
  { word: 'koala', category: 'Animal', emoji: '🐨', sentence: 'The sleepy ___ hugs a eucalyptus branch.' },
  { word: 'eagle', category: 'Animal', emoji: '🦅', sentence: 'A bald ___ soars high above the mountain peaks.' },
  { word: 'apple', category: 'Food', emoji: '🍎', sentence: 'Pick a crisp red ___ from the orchard.' },
  { word: 'bread', category: 'Food', emoji: '🍞', sentence: 'Freshly baked ___ smells wonderful.' },
  { word: 'grape', category: 'Food', emoji: '🍇', sentence: 'Purple ___ clusters grow on sunny vines.' },
  { word: 'lemon', category: 'Food', emoji: '🍋', sentence: 'Squeeze a sour yellow ___ to make lemonade.' },
  { word: 'clock', category: 'Thing', emoji: '🕐', sentence: 'The wall ___ chimes at twelve o’clock.' },
  { word: 'plant', category: 'Nature', emoji: '🌿', sentence: 'Water the sprouting ___ on the windowsill.' },
  { word: 'train', category: 'Thing', emoji: '🚂', sentence: 'The express ___ crosses the mountain bridge.' },
  { word: 'house', category: 'Thing', emoji: '🏠', sentence: 'Paint the front door of the ___ bright blue.' },
  { word: 'earth', category: 'Space', emoji: '🌍', sentence: 'Planet ___ orbits around the Sun.' },

  // 6 & 7-letter words (Tier 3)
  { word: 'planet', category: 'Space', emoji: '🪐', sentence: 'Saturn is a giant ringed ___.' },
  { word: 'rocket', category: 'Space', emoji: '🚀', sentence: 'The silver ___ blasted into orbit!' },
  { word: 'monkey', category: 'Animal', emoji: '🐒', sentence: 'A playful ___ swings from vine to vine.' },
  { word: 'turtle', category: 'Animal', emoji: '🐢', sentence: 'The sea ___ glides over the coral reef.' },
  { word: 'rabbit', category: 'Animal', emoji: '🐰', sentence: 'A fluffy ___ hops through the clover.' },
  { word: 'dragon', category: 'Magic', emoji: '🐉', sentence: 'The friendly ___ guards the mountain crystal.' },
  { word: 'castle', category: 'Thing', emoji: '🏰', sentence: 'The stone ___ has four tall towers.' },
  { word: 'island', category: 'Nature', emoji: '🏝️', sentence: 'Palm trees sway on the tropical ___.' },
  { word: 'flower', category: 'Nature', emoji: '🌻', sentence: 'The yellow ___ turns toward the sun.' },
  { word: 'banana', category: 'Food', emoji: '🍌', sentence: 'Peel a ripe yellow ___ for a snack.' },
  { word: 'guitar', category: 'Music', emoji: '🎸', sentence: 'Strum a cheerful melody on the ___.' },
  { word: 'rainbow', category: 'Nature', emoji: '🌈', sentence: 'A seven-color ___ arched across the sky.' },
  { word: 'dolphin', category: 'Animal', emoji: '🐬', sentence: 'A bottle-nose ___ leaps beside our boat.' },
  { word: 'penguin', category: 'Animal', emoji: '🐧', sentence: 'The tuxedo ___ toboggans across the ice.' },
  { word: 'giraffe', category: 'Animal', emoji: '🦒', sentence: 'A tall ___ reaches the highest acacia leaves.' },
  { word: 'octopus', category: 'Animal', emoji: '🐙', sentence: 'The clever ___ has eight flexible arms.' },
  { word: 'volcano', category: 'Nature', emoji: '🌋', sentence: 'Steam rises from the ancient island ___.' },
  { word: 'cupcake', category: 'Food', emoji: '🧁', sentence: 'Top the vanilla ___ with rainbow sprinkles.' },
  { word: 'compass', category: 'Thing', emoji: '🧭', sentence: 'The magnetic ___ needle always points north.' },
  { word: 'lantern', category: 'Thing', emoji: '🏮', sentence: 'Hang a glowing ___ along the treehouse bridge.' },

  // 8 & 9-letter words (Tier 4)
  { word: 'elephant', category: 'Animal', emoji: '🐘', sentence: 'The African ___ sprays cool water with its trunk.' },
  { word: 'kangaroo', category: 'Animal', emoji: '🦘', sentence: 'A mother ___ carries her joey in a pouch.' },
  { word: 'dinosaur', category: 'Science', emoji: '🦕', sentence: 'Paleontologists discovered a giant ___ fossil!' },
  { word: 'squirrel', category: 'Animal', emoji: '🐿️', sentence: 'A bushy-tailed ___ gathers acorns for winter.' },
  { word: 'flamingo', category: 'Animal', emoji: '🦩', sentence: 'The pink ___ balances on one long leg.' },
  { word: 'hedgehog', category: 'Animal', emoji: '🦔', sentence: 'The little spiky ___ curls into a ball.' },
  { word: 'mushroom', category: 'Nature', emoji: '🍄', sentence: 'A spotted red ___ grew beside the mossy tree.' },
  { word: 'airplane', category: 'Thing', emoji: '✈️', sentence: 'The silver ___ soared above the fluffy clouds.' },
  { word: 'umbrella', category: 'Thing', emoji: '☂️', sentence: 'Open your colorful ___ when the rain starts.' },
  { word: 'mountain', category: 'Nature', emoji: '🏔️', sentence: 'Snow covers the peak of the tallest ___.' },
  { word: 'astronaut', category: 'Space', emoji: '🧑‍🚀', sentence: 'The brave ___ floated inside the space station.' },
  { word: 'butterfly', category: 'Nature', emoji: '🦋', sentence: 'A monarch ___ emerged from its chrysalis.' },
  { word: 'telescope', category: 'Science', emoji: '🔭', sentence: 'Focus the ___ to see Jupiter’s four big moons!' },
  { word: 'crocodile', category: 'Animal', emoji: '🐊', sentence: 'A scaly ___ rests along the riverbank.' },
  { word: 'pineapple', category: 'Food', emoji: '🍍', sentence: 'Slice the sweet tropical ___ for fruit salad.' },
  { word: 'sunflower', category: 'Nature', emoji: '🌻', sentence: 'The golden ___ grew taller than the garden fence.' },
  { word: 'jellyfish', category: 'Animal', emoji: '🪼', sentence: 'A glowing ___ drifts gently through the ocean.' },
  { word: 'snowflake', category: 'Nature', emoji: '❄️', sentence: 'Every icy ___ has six delicate branches.' },
].map((entry) => ({ ...entry, image: emojiToTwemojiUrl(entry.emoji) }))

const SIGHT_WORDS = [
  { word: 'the', example: 'Look at THE bright sun!', emoji: '☀️' },
  { word: 'and', example: 'Apples AND bananas are yummy.', emoji: '🍎' },
  { word: 'see', example: 'I can SEE a butterfly!', emoji: '🦋' },
  { word: 'can', example: 'You CAN jump super high!', emoji: '🦘' },
  { word: 'you', example: 'I am so proud of YOU!', emoji: '🌟' },
  { word: 'play', example: 'Let us PLAY outside together.', emoji: '🎈' },
  { word: 'look', example: 'LOOK at that rainbow in the sky!', emoji: '🌈' },
  { word: 'big', example: 'An elephant is very BIG.', emoji: '🐘' },
  { word: 'jump', example: 'Watch the green frog JUMP!', emoji: '🐸' },
  { word: 'help', example: 'Friends always HELP each other.', emoji: '🤝' },
  { word: 'where', example: 'WHERE did the little puppy hide?', emoji: '🐶' },
  { word: 'together', example: 'We love reading stories TOGETHER!', emoji: '📚' },
]

// Tier 3: Synonyms & Antonyms Bank
const SYNONYM_ANTONYM_BANK = [
  { mode: 'SYNONYM (same meaning)', target: 'HUGE', emoji: '🐘', answer: 'GIGANTIC', choices: ['GIGANTIC', 'TINY', 'QUIET', 'SLOW'], hint: 'HUGE and GIGANTIC both mean very, very big!' },
  { mode: 'SYNONYM (same meaning)', target: 'HAPPY', emoji: '😄', answer: 'JOYFUL', choices: ['JOYFUL', 'SLEEPY', 'ANGRY', 'COLD'], hint: 'HAPPY and JOYFUL both mean feeling glad and cheerful!' },
  { mode: 'SYNONYM (same meaning)', target: 'FAST', emoji: '🐆', answer: 'QUICK', choices: ['QUICK', 'HEAVY', 'LATE', 'DARK'], hint: 'A cheetah is FAST and QUICK!' },
  { mode: 'SYNONYM (same meaning)', target: 'CLEVER', emoji: '🦊', answer: 'SMART', choices: ['SMART', 'LOUD', 'HUNGRY', 'SOFT'], hint: 'CLEVER and SMART both mean bright and quick-thinking.' },
  { mode: 'SYNONYM (same meaning)', target: 'CHILLY', emoji: '⛄', answer: 'COLD', choices: ['COLD', 'WARM', 'BRIGHT', 'SWEET'], hint: 'A snowy day feels CHILLY and COLD!' },
  { mode: 'ANTONYM (opposite meaning)', target: 'ANCIENT', emoji: '🏛️', answer: 'MODERN', choices: ['MODERN', 'OLD', 'HEAVY', 'ROUND'], hint: 'ANCIENT means very old, so its opposite is MODERN (new)!' },
  { mode: 'ANTONYM (opposite meaning)', target: 'BRAVE', emoji: '🦁', answer: 'FEARFUL', choices: ['FEARFUL', 'STRONG', 'KIND', 'TALL'], hint: 'BRAVE means fearless, so the opposite is FEARFUL.' },
  { mode: 'ANTONYM (opposite meaning)', target: 'EMPTY', emoji: '🪣', answer: 'FULL', choices: ['FULL', 'CLEAN', 'LIGHT', 'OPEN'], hint: 'The opposite of an EMPTY bucket is a FULL bucket!' },
  { mode: 'ANTONYM (opposite meaning)', target: 'FLOATING', emoji: '🎈', answer: 'SINKING', choices: ['SINKING', 'FLYING', 'GLOWING', 'BOUNCING'], hint: 'Floating goes up; SINKING goes down!' },
  { mode: 'ANTONYM (opposite meaning)', target: 'WHISPER', emoji: '🤫', answer: 'SHOUT', choices: ['SHOUT', 'LISTEN', 'SLEEP', 'SMILE'], hint: 'A whisper is very quiet; a SHOUT is very loud!' },
]

// Tier 3: Grammar Detective Bank
const GRAMMAR_BANK = [
  { sentence: 'The green frog LEAPS across the pond.', targetWord: 'LEAPS', emoji: '🐸', answer: 'VERB (Action)', choices: ['VERB (Action)', 'NOUN (Person/Place/Thing)', 'ADJECTIVE (Describing)'], hint: '"Leaps" is an action something does, so it is a VERB!' },
  { sentence: 'Astronauts fly inside a shiny ROCKET.', targetWord: 'ROCKET', emoji: '🚀', answer: 'NOUN (Person/Place/Thing)', choices: ['NOUN (Person/Place/Thing)', 'VERB (Action)', 'ADJECTIVE (Describing)'], hint: 'A "rocket" is a thing you can touch and see, so it is a NOUN!' },
  { sentence: 'Bella wore a FLUFFY scarf in the snow.', targetWord: 'FLUFFY', emoji: '🧣', answer: 'ADJECTIVE (Describing)', choices: ['ADJECTIVE (Describing)', 'NOUN (Person/Place/Thing)', 'VERB (Action)'], hint: '"Fluffy" describes what the scarf is like, so it is an ADJECTIVE!' },
  { sentence: 'The dolphin SWIMS beside the sailboat.', targetWord: 'SWIMS', emoji: '🐬', answer: 'VERB (Action)', choices: ['VERB (Action)', 'NOUN (Person/Place/Thing)', 'ADJECTIVE (Describing)'], hint: '"Swims" tells the action the dolphin is doing — a VERB!' },
  { sentence: 'We ate sweet strawberries at the PICNIC.', targetWord: 'PICNIC', emoji: '🧺', answer: 'NOUN (Person/Place/Thing)', choices: ['NOUN (Person/Place/Thing)', 'VERB (Action)', 'ADJECTIVE (Describing)'], hint: 'A "picnic" is an event/thing, making it a NOUN!' },
  { sentence: 'A GIGANTIC whale breached the ocean waves.', targetWord: 'GIGANTIC', emoji: '🐋', answer: 'ADJECTIVE (Describing)', choices: ['ADJECTIVE (Describing)', 'VERB (Action)', 'NOUN (Person/Place/Thing)'], hint: '"Gigantic" describes the size of the whale — an ADJECTIVE!' },
  { sentence: 'Professor Hoot READS a book every night.', targetWord: 'READS', emoji: '🦉', answer: 'VERB (Action)', choices: ['VERB (Action)', 'NOUN (Person/Place/Thing)', 'ADJECTIVE (Describing)'], hint: '"Reads" is an action word — a VERB!' },
]

// Tier 3: Compound Words & Plurals
const COMPOUND_PLURAL_BANK = [
  { prompt: 'Combine SUN + FLOWER to make a compound word:', emoji: '🌻', answer: 'SUNFLOWER', choices: ['SUNFLOWER', 'SUNSHINE', 'FLOWERPOT', 'STARLIGHT'], hint: 'SUN + FLOWER joins together into SUNFLOWER!' },
  { prompt: 'Combine RAIN + COAT to make a compound word:', emoji: '🧥', answer: 'RAINCOAT', choices: ['RAINCOAT', 'RAINBOW', 'RAINDROP', 'SNOWCOAT'], hint: 'A coat for the rain is a RAINCOAT!' },
  { prompt: 'What is the plural (more than one) of MOUSE?', emoji: '🐭', answer: 'MICE', choices: ['MICE', 'MOUSES', 'MEECE', 'MOUSIES'], hint: 'One mouse, two or three MICE!' },
  { prompt: 'What is the plural (more than one) of CHILD?', emoji: '🧒', answer: 'CHILDREN', choices: ['CHILDREN', 'CHILDS', 'CHILDES', 'CHILDRENS'], hint: 'One child, many CHILDREN!' },
  { prompt: 'What is the plural (more than one) of LEAF?', emoji: '🍃', answer: 'LEAVES', choices: ['LEAVES', 'LEAFS', 'LEAFES', 'LEAVS'], hint: 'Words ending in -F often change to -VES: one leaf, many LEAVES!' },
  { prompt: 'What is the plural (more than one) of TOOTH?', emoji: '🦷', answer: 'TEETH', choices: ['TEETH', 'TOOTHS', 'TEETHS', 'TOOTHES'], hint: 'One tooth, thirty-two TEETH!' },
  { prompt: 'Combine STAR + FISH to make a compound word:', emoji: '⭐', answer: 'STARFISH', choices: ['STARFISH', 'GOLDFISH', 'STARLIGHT', 'JELLYFISH'], hint: 'STAR + FISH = STARFISH!' },
]

// Tier 4: Homophones Bank
const HOMOPHONE_BANK = [
  { sentence: 'The explorers parked ___ rover near the crater.', emoji: '🚀', answer: 'THEIR', choices: ['THEIR', 'THERE', 'THEY’RE'], hint: 'Use THEIR to show ownership (belonging to them).' },
  { sentence: 'Look over ___ at that shooting star!', emoji: '🌠', answer: 'THERE', choices: ['THERE', 'THEIR', 'THEY’RE'], hint: 'Use THERE to point to a place or location (here/there).' },
  { sentence: '___ building a treehouse in the oak tree!', emoji: '🌳', answer: 'THEY’RE', choices: ['THEY’RE', 'THEIR', 'THERE'], hint: 'THEY’RE is short for "They are" — They are building a treehouse!' },
  { sentence: 'Barnaby ate ___ crunchy carrots for lunch.', emoji: '🥕', answer: 'TWO', choices: ['TWO', 'TOO', 'TO'], hint: 'TWO is the number 2!' },
  { sentence: 'Can I come along on the safari ___?', emoji: '🦁', answer: 'TOO', choices: ['TOO', 'TWO', 'TO'], hint: 'TOO with two O’s means "also" or "as well"!' },
  { sentence: 'We sailed across the blue ___ in a wooden boat.', emoji: '⛵', answer: 'SEA', choices: ['SEA', 'SEE', 'SEW'], hint: 'SEA spelled S-E-A is the ocean water!' },
  { sentence: 'Don’t forget ___ pack your compass!', emoji: '🧭', answer: 'TO', choices: ['TO', 'TOO', 'TWO'], hint: 'Use TO before a verb ("to pack")!' },
  { sentence: '___ going to love this science experiment!', emoji: '🔬', answer: 'YOU’RE', choices: ['YOU’RE', 'YOUR', 'YORE'], hint: 'YOU’RE is short for "You are"!' },
]

// Tier 4: Vocabulary in Context Bank
const VOCAB_BANK = [
  {
    sentence: 'The glass ornament is FRAGILE, so carry it gently with both hands.',
    target: 'FRAGILE',
    emoji: '🔮',
    answer: 'Easily broken or delicate',
    choices: ['Easily broken or delicate', 'Heavy and metallic', 'Loud and musical', 'Completely invisible'],
    hint: 'Since you must carry it gently with both hands, FRAGILE means easily broken or delicate!',
  },
  {
    sentence: 'Fireflies ILLUMINATE the dark forest with their glowing tails.',
    target: 'ILLUMINATE',
    emoji: '✨',
    answer: 'Light up or make bright',
    choices: ['Light up or make bright', 'Hide in the shadows', 'Freeze into ice', 'Measure the height'],
    hint: 'Glowing tails in a dark forest ILLUMINATE — they light it up!',
  },
  {
    sentence: 'The coral reef is a colorful HABITAT for clownfish, turtles, and eels.',
    target: 'HABITAT',
    emoji: '🪸',
    answer: 'Natural home of an animal or plant',
    choices: ['Natural home of an animal or plant', 'A type of submarine', 'A deep ocean storm', 'A pirate treasure chest'],
    hint: 'A HABITAT is the natural environment where creatures live and grow!',
  },
  {
    sentence: 'Bears HIBERNATE in cozy dens through the freezing winter months.',
    target: 'HIBERNATE',
    emoji: '🐻',
    answer: 'Spend the winter in a deep sleep',
    choices: ['Spend the winter in a deep sleep', 'Migrate across the ocean', 'Build nests in tall trees', 'Gather summer berries'],
    hint: 'During winter in a den, animals HIBERNATE by sleeping deeply until spring.',
  },
  {
    sentence: 'Finley was CURIOUS about the footprints, so he followed them with his magnifying glass.',
    target: 'CURIOUS',
    emoji: '🔍',
    answer: 'Eager to learn or know something',
    choices: ['Eager to learn or know something', 'Too tired to walk', 'Afraid of the dark', 'Ready to eat dinner'],
    hint: 'Investigating with a magnifying glass shows he is eager to find out — CURIOUS!',
  },
  {
    sentence: 'Water is SCARCE in the dry desert, so cacti store every drop inside their stems.',
    target: 'SCARCE',
    emoji: '🌵',
    answer: 'Hard to find or in short supply',
    choices: ['Hard to find or in short supply', 'Flooding everywhere', 'Frozen into snow', 'Salty like the ocean'],
    hint: 'In a dry desert, water is in very short supply — SCARCE!',
  },
]

// Tier 4: Illustrated Reading Comprehension Passages
const READING_PASSAGES = [
  {
    id: 'p-space',
    title: 'Mission to the Red Planet',
    scene: '/assets/nano/scene-space.png',
    passage:
      'Mars is called the Red Planet because rusty iron dust covers its rocks and valleys. Robot rovers with six wheels roll across Mars taking photos of ancient dry riverbeds. Scientists study these rocks to learn if liquid water once flowed on Mars long ago.',
    question: 'Why does Mars look red from space?',
    answer: 'Rusty iron dust covers its surface',
    choices: [
      'Rusty iron dust covers its surface',
      'It is covered in red flowers',
      'Hot lava covers the whole planet',
      'Red clouds block the sunlight',
    ],
    hint: 'Look at the first sentence: "Mars is called the Red Planet because rusty iron dust covers its rocks and valleys."',
  },
  {
    id: 'p-ocean',
    title: 'Secrets of the Coral Reef',
    scene: '/assets/nano/scene-ocean.png',
    passage:
      'Although coral looks like colorful underwater rock, it is actually built by thousands of tiny living animals called polyps! Clownfish hide safely among stinging sea anemones, while green sea turtles visit "cleaning stations" where small wrasse fish nibble algae off their shells.',
    question: 'Why do sea turtles visit "cleaning stations" on the reef?',
    answer: 'Small fish nibble algae off their shells',
    choices: [
      'Small fish nibble algae off their shells',
      'To hide from giant sharks',
      'To lay their eggs on the coral',
      'To sleep during the winter',
    ],
    hint: 'Check the last sentence: green sea turtles visit cleaning stations where small fish nibble algae off their shells!',
  },
  {
    id: 'p-dino',
    title: 'Gentle Giants of the Jurassic',
    scene: '/assets/nano/scene-dino.png',
    passage:
      'Brachiosaurus was one of the tallest dinosaurs ever to walk the Earth. Unlike most dinosaurs, its front legs were longer than its back legs, giving it a posture like a giant giraffe! This helped it reach tender leaves at the very top of tall conifer trees.',
    question: 'How was Brachiosaurus shaped like a giraffe?',
    answer: 'Its front legs were longer than its back legs',
    choices: [
      'Its front legs were longer than its back legs',
      'It had purple spots on its fur',
      'It could run faster than a cheetah',
      'It lived only in icy mountains',
    ],
    hint: 'Read the second sentence: "its front legs were longer than its back legs, giving it a posture like a giant giraffe!"',
  },
  {
    id: 'p-nature',
    title: 'Layers of the Rainforest',
    scene: '/assets/nano/scene-nature.png',
    passage:
      'A tropical rainforest has four main layers. At the very top is the sunny emergent layer where eagles soar. Below that is the thick leafy canopy, home to toucans, tree frogs, and sloths. Only a little sunlight reaches the quiet, shady forest floor at the bottom.',
    question: 'Where do toucans, tree frogs, and sloths mostly live?',
    answer: 'In the leafy canopy layer',
    choices: [
      'In the leafy canopy layer',
      'Underground in deep tunnels',
      'In the icy mountain peaks',
      'At the bottom of the ocean',
    ],
    hint: 'Look at the third sentence: "Below that is the thick leafy canopy, home to toucans, tree frogs, and sloths."',
  },
]

const COUNT_EMOJIS = ['🍎', '🌟', '🦋', '🍓', '🍪', '🎈', '🐢', '🌸', '🧁', '🦆']

function makeLetterChoices(correctLetter, pool = 'abcdefghijklmnopqrstuvwxyz') {
  const lower = correctLetter.toLowerCase()
  const set = new Set([lower])
  while (set.size < 4) {
    const ch = pool[randomInt(0, pool.length - 1)]
    set.add(ch)
  }
  return shuffle([...set]).map((c) => c.toUpperCase())
}

function makeScrambledTiles(word, extraCount = 0) {
  const letters = word.toUpperCase().split('')
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < extraCount; i++) {
    letters.push(alphabet[randomInt(0, alphabet.length - 1)])
  }
  return shuffle(letters).map((char, idx) => ({ id: `${char}-${idx}`, char }))
}

/**
 * Generate a single question for any of the 38 skill nodes across Tiers 1–4
 */
export function generateQuestionForNode(nodeId, index = 0, profileId = 'default') {
  const emoji = COUNT_EMOJIS[randomInt(0, COUNT_EMOJIS.length - 1)]

  switch (nodeId) {
    // ── TIER 1 MATH (Pre-K) ──
    case 'math-1': {
      // Count to 5
      const count = randomInt(1, 5)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Touch and count! How many are there?',
        spokenPrompt: `Count the items. How many are there?`,
        expression: `Count = ?`,
        num1: count,
        num2: 0,
        operation: 'addition',
        answer: count,
        visualItem: emoji,
        visualType: 'emoji-groups',
        inputMode: 'choices',
        choices: generateSmartMathChoices(count, { min: 1, max: 5 }),
        hint: `Point to each ${emoji} and count out loud: ${Array.from({ length: count }, (_, i) => i + 1).join(', ')}!`,
      }
    }

    case 'math-2': {
      // Ten-Frame (1–10)
      const count = randomInt(1, 10)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'How many are in the ten-frame?',
        spokenPrompt: `Count the items in the ten frame. How many are there?`,
        expression: `Count = ?`,
        num1: count,
        num2: 0,
        answer: count,
        visualItem: emoji,
        visualType: 'ten-frame',
        inputMode: 'choices',
        choices: generateSmartMathChoices(count, { min: 1, max: 10 }),
        hint: `A full top row has 5. Count each ${emoji} up to ${count}!`,
      }
    }

    case 'math-3': {
      // Hop +1 & +2
      const a = randomInt(1, 7)
      const b = randomInt(1, 2)
      const answer = a + b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Hop forward on the number line!',
        spokenPrompt: `What is ${a} plus ${b}? Start at ${a} and hop forward ${b}.`,
        expression: `${a} + ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'number-line',
        inputMode: 'choices',
        choices: generateSmartMathChoices(answer, { min: 1, max: 10 }),
        hint: `Start at ${a} and hop ${b} step${b > 1 ? 's' : ''} forward to land on ${answer}!`,
      }
    }

    case 'math-4': {
      // Gentle Take-Away (-1)
      const a = randomInt(2, 6)
      const b = 1
      const answer = a - b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Take 1 away! How many are left?',
        spokenPrompt: `Start with ${a} and take away 1. How many are left?`,
        expression: `${a} - 1 = ?`,
        num1: a,
        num2: 1,
        operation: 'subtraction',
        answer,
        visualItem: emoji,
        visualType: 'emoji-groups',
        inputMode: 'choices',
        choices: generateSmartMathChoices(answer, { min: 1, max: 6 }),
        hint: `When we take 1 away from ${a}, we count backward one step to ${answer}!`,
      }
    }

    case 'math-5': {
      // More or Fewer (Visual Comparison)
      const a = randomInt(1, 6)
      let b = randomInt(1, 6)
      if (a === b) b = a < 6 ? a + 1 : a - 1
      const askMore = index % 2 === 0
      const answer = askMore
        ? a > b
          ? `Left (${a})`
          : `Right (${b})`
        : a < b
          ? `Left (${a})`
          : `Right (${b})`
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: askMore ? 'Which side has MORE?' : 'Which side has FEWER?',
        spokenPrompt: askMore
          ? `Left has ${a}, Right has ${b}. Which side has more?`
          : `Left has ${a}, Right has ${b}. Which side has fewer?`,
        expression: `${a}  vs  ${b}`,
        num1: a,
        num2: b,
        answer,
        visualItem: emoji,
        visualType: 'comparison',
        inputMode: 'choices',
        choices: [`Left (${a})`, `Right (${b})`],
        hint: `${a} compared to ${b}: ${Math.max(a, b)} is more and ${Math.min(a, b)} is fewer!`,
      }
    }

    // ── TIER 2 MATH (Kindergarten) ──
    case 'math-6': {
      // Adding +3, +4, +5
      const b = randomInt(3, 5)
      const a = randomInt(1, 10 - b)
      const answer = a + b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Add the two groups in the ten-frame!',
        spokenPrompt: `What is ${a} plus ${b}?`,
        expression: `${a} + ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 2, max: 10 }),
        hint: `Start with ${a} and count ${b} more blue dots: ${a} + ${b} = ${answer}.`,
      }
    }

    case 'math-7': {
      // Doubles Power (1+1 to 6+6)
      const a = randomInt(1, 6)
      const answer = a + a
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Doubles Power! Add the twin numbers:',
        spokenPrompt: `What is ${a} plus ${a}?`,
        expression: `${a} + ${a} = ?`,
        num1: a,
        num2: a,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'emoji-groups',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 2, max: 12 }),
        hint: `Two equal groups of ${a} make ${answer}! (${a} + ${a} = ${answer})`,
      }
    }

    case 'math-8': {
      // Making 10 Bonds
      const a = randomInt(1, 9)
      const answer = 10 - a
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'How many more to make 10?',
        spokenPrompt: `${a} plus what number makes 10? Count the empty boxes!`,
        expression: `${a} + ? = 10`,
        num1: a,
        num2: answer,
        operation: 'making-10',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame-missing',
        inputMode: 'choices',
        choices: generateSmartMathChoices(answer, { min: 1, max: 9 }),
        hint: `10 boxes in all: ${a} are filled, leaving ${answer} empty boxes. ${a} + ${answer} = 10!`,
      }
    }

    case 'math-9': {
      // Subtract within 10
      const a = randomInt(4, 10)
      const b = randomInt(1, a - 1)
      const answer = a - b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Subtract to see how many remain:',
        spokenPrompt: `What is ${a} minus ${b}?`,
        expression: `${a} - ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'subtraction',
        answer,
        visualItem: emoji,
        visualType: b <= 2 ? 'number-line' : 'emoji-groups',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 0, max: 10 }),
        hint: `Start with ${a} and take away ${b}: ${a} - ${b} = ${answer}!`,
      }
    }

    case 'math-10': {
      // Compare Symbols (>, <, =)
      const a = randomInt(2, 18)
      const b = Math.random() < 0.25 ? a : randomInt(2, 18)
      const answer = a > b ? '>' : a < b ? '<' : '='
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Compare the numbers! Which symbol fits?',
        spokenPrompt: `Compare ${a} and ${b}. Is ${a} greater than, less than, or equal to ${b}?`,
        expression: `${a}  [ ? ]  ${b}`,
        num1: a,
        num2: b,
        answer,
        visualItem: emoji,
        visualType: 'comparison',
        inputMode: 'choices',
        choices: ['>', '<', '='],
        hint:
          a > b
            ? `${a} is greater than ${b}, so the alligator mouth opens toward ${a}: ${a} > ${b}!`
            : a < b
              ? `${a} is less than ${b}, so the mouth opens toward ${b}: ${a} < ${b}!`
              : `Both sides are ${a}, so ${a} = ${b}!`,
      }
    }

    case 'math-11': {
      // Teen Numbers to 20
      const a = randomInt(6, 12)
      const b = randomInt(3, 8)
      const answer = a + b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Solve using the double ten-frame & Number Pad!',
        spokenPrompt: `What is ${a} plus ${b}?`,
        expression: `${a} + ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame-double',
        inputMode: index >= 2 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 9, max: 20 }),
        hint: `Fill the first 10-frame to make 10, then add the remaining ${answer - 10}: 10 + ${answer - 10} = ${answer}!`,
      }
    }

    // ── TIER 3 MATH (Grades 1–2) ──
    case 'math-12': {
      // Place Value (Tens & Ones)
      const tens = randomInt(1, 9)
      const ones = randomInt(0, 9)
      const total = tens * 10 + ones
      const askDecompose = index % 2 === 1
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: askDecompose
          ? `How many TENS are in the number ${total}?`
          : `Build the number from ${tens} tens and ${ones} ones:`,
        spokenPrompt: askDecompose
          ? `How many tens are in the number ${total}?`
          : `What number is made of ${tens} tens and ${ones} ones?`,
        expression: askDecompose
          ? `${total} = [ ? ] tens + ${ones} ones`
          : `${tens} tens + ${ones} ones = ?`,
        tens,
        ones,
        answer: askDecompose ? tens : total,
        visualType: 'place-value',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: askDecompose
          ? generateSmartMathChoices(tens, { min: 1, max: 9 })
          : generateSmartMathChoices(total, { min: 10, max: 99, a: tens * 10, b: ones }),
        hint: `${tens} ten-rods equal ${tens * 10}, plus ${ones} one-cubes makes ${total}!`,
      }
    }

    case 'math-13': {
      // 2-Digit Addition
      const a = randomInt(12, 58)
      const b = randomInt(11, 39)
      const answer = a + b
      const tensSum = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10
      const onesSum = (a % 10) + (b % 10)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Add the 2-digit numbers!',
        spokenPrompt: `What is ${a} plus ${b}?`,
        expression: `${a} + ${b} = ?`,
        tens: Math.floor(answer / 10),
        ones: answer % 10,
        answer,
        visualType: 'place-value',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 20, max: 99, a, b }),
        hint: `Add tens first (${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${tensSum}), then add ones (${a % 10} + ${b % 10} = ${onesSum}): ${tensSum} + ${onesSum} = ${answer}!`,
      }
    }

    case 'math-14': {
      // 2-Digit Subtraction
      const a = randomInt(28, 89)
      const b = randomInt(11, a - 10)
      const answer = a - b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Subtract the 2-digit numbers!',
        spokenPrompt: `What is ${a} minus ${b}?`,
        expression: `${a} - ${b} = ?`,
        tens: Math.floor(answer / 10),
        ones: answer % 10,
        answer,
        visualType: 'place-value',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 5, max: 85, a, b }),
        hint: `Start at ${a}, subtract ${Math.floor(b / 10) * 10} to get ${a - Math.floor(b / 10) * 10}, then subtract ${b % 10} more to get ${answer}!`,
      }
    }

    case 'math-15': {
      // Mystery Number Algebra (Missing Operand)
      const isAdd = index % 2 === 0
      if (isAdd) {
        const a = randomInt(6, 16)
        const missing = randomInt(4, 15)
        const sum = a + missing
        return {
          id: `${nodeId}-${index}`,
          nodeId,
          track: 'math',
          prompt: 'Find the mystery number (?) that balances the equation!',
          spokenPrompt: `${a} plus what mystery number equals ${sum}?`,
          expression: `${a} + [ ? ] = ${sum}`,
          num1: sum,
          num2: a,
          operation: 'subtraction',
          answer: missing,
          visualItem: '🌟',
          visualType: 'ten-frame-double',
          inputMode: index >= 3 ? 'numpad' : 'choices',
          choices: generateSmartMathChoices(missing, { min: 1, max: 25 }),
          hint: `To find the missing partner, subtract ${sum} - ${a} = ${missing}!`,
        }
      } else {
        const result = randomInt(5, 14)
        const sub = randomInt(4, 11)
        const start = result + sub
        return {
          id: `${nodeId}-${index}`,
          nodeId,
          track: 'math',
          prompt: 'What starting number (?) makes this true?',
          spokenPrompt: `What number minus ${sub} equals ${result}?`,
          expression: `[ ? ] - ${sub} = ${result}`,
          num1: result,
          num2: sub,
          operation: 'addition',
          answer: start,
          visualItem: '🌟',
          visualType: 'ten-frame-double',
          inputMode: 'choices',
          choices: generateSmartMathChoices(start, { min: 8, max: 30 }),
          hint: `Work backward by adding ${result} + ${sub} = ${start}!`,
        }
      }
    }

    case 'math-16': {
      // Intro Multiplication (2x, 5x, 10x Arrays)
      const factorA = [2, 3, 4, 5][randomInt(0, 3)]
      const factorB = [2, 5, 10][randomInt(0, 2)]
      const answer = factorA * factorB
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: `Multiply ${factorA} rows of ${factorB}!`,
        spokenPrompt: `What is ${factorA} times ${factorB}? Count ${factorA} groups of ${factorB}.`,
        expression: `${factorA} × ${factorB} = ?`,
        rows: factorA,
        cols: factorB,
        answer,
        visualItem: emoji,
        visualType: 'mult-array',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, {
          min: 4,
          max: 50,
          operation: 'multiplication',
          a: factorA,
          b: factorB,
        }),
        hint: `Skip-count by ${factorB}s ${factorA} times: ${Array.from({ length: factorA }, (_, i) => (i + 1) * factorB).join(' → ')}!`,
      }
    }

    case 'math-17': {
      // Coins & Telling Time
      const isClock = index % 2 === 0
      if (isClock) {
        const hour = randomInt(1, 12)
        const minute = [0, 15, 30, 45][randomInt(0, 3)]
        const formatted = `${hour}:${String(minute).padStart(2, '0')}`
        const wrongSet = new Set([formatted])
        while (wrongSet.size < 4) {
          const h = randomInt(1, 12)
          const m = [0, 15, 30, 45][randomInt(0, 3)]
          wrongSet.add(`${h}:${String(m).padStart(2, '0')}`)
        }
        return {
          id: `${nodeId}-${index}`,
          nodeId,
          track: 'math',
          prompt: 'Look at the clock! What time does it show?',
          spokenPrompt: `Read the clock hands. What time is shown?`,
          expression: `Time = ?`,
          clockHour: hour,
          clockMinute: minute,
          answer: formatted,
          visualType: 'clock',
          inputMode: 'choices',
          choices: shuffle([...wrongSet]),
          hint: `The short hour hand points to ${hour}, and the long minute hand points to ${minute === 0 ? '12 (:00)' : minute === 15 ? '3 (:15)' : minute === 30 ? '6 (:30)' : '9 (:45)'} → ${formatted}!`,
        }
      } else {
        const quarters = randomInt(0, 2)
        const dimes = randomInt(0, 3)
        const nickels = randomInt(0, 2)
        const pennies = randomInt(1, 4)
        const totalCents = quarters * 25 + dimes * 10 + nickels * 5 + pennies
        return {
          id: `${nodeId}-${index}`,
          nodeId,
          track: 'math',
          prompt: 'Count the coins! How many cents (¢) in all?',
          spokenPrompt: `Count the coins to find the total number of cents.`,
          expression: `Total ¢ = ?`,
          coins: { quarters, dimes, nickels, pennies },
          answer: totalCents,
          visualType: 'coins',
          inputMode: 'choices',
          choices: generateSmartMathChoices(totalCents, { min: 5, max: 99 }),
          hint: `Quarters = 25¢, Dimes = 10¢, Nickels = 5¢, Pennies = 1¢. Total = ${totalCents}¢!`,
        }
      }
    }

    // ── TIER 4 MATH (Grades 3–4) ──
    case 'math-18': {
      // Multiplication Mastery (2x–12x)
      const a = randomInt(3, 12)
      const b = randomInt(3, 12)
      const answer = a * b
      const useMissing = index === 4
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: useMissing ? 'Find the missing factor!' : 'Times Tables Challenge!',
        spokenPrompt: useMissing
          ? `${a} times what number equals ${answer}?`
          : `What is ${a} times ${b}?`,
        expression: useMissing ? `${a} × [ ? ] = ${answer}` : `${a} × ${b} = ?`,
        rows: Math.min(a, 6),
        cols: Math.min(b, 8),
        answer: useMissing ? b : answer,
        visualItem: '⭐',
        visualType: a <= 6 && b <= 8 ? 'mult-array' : 'none',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(useMissing ? b : answer, {
          min: 2,
          max: 144,
          operation: 'multiplication',
          a,
          b,
        }),
        hint: `${a} groups of ${b} equals ${answer} (${a} × ${b} = ${answer})!`,
      }
    }

    case 'math-19': {
      // Division Facts
      const divisor = randomInt(2, 10)
      const quotient = randomInt(2, 10)
      const dividend = divisor * quotient
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: `Divide ${dividend} into ${divisor} equal groups!`,
        spokenPrompt: `What is ${dividend} divided by ${divisor}?`,
        expression: `${dividend} ÷ ${divisor} = ?`,
        rows: divisor,
        cols: quotient,
        answer: quotient,
        visualItem: '💎',
        visualType: divisor <= 5 && quotient <= 6 ? 'mult-array' : 'none',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(quotient, {
          min: 1,
          max: 12,
          operation: 'division',
          a: dividend,
          b: divisor,
        }),
        hint: `Think of multiplication in reverse: ${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = ${quotient}!`,
      }
    }

    case 'math-20': {
      // Visual Fractions
      const den = randomInt(2, 8)
      const num = randomInt(1, den - 1)
      const correct = `${num}/${den}`
      const wrongSet = new Set([correct])
      const candidates = [
        `${den - num}/${den}`,
        `${num}/${den + 1}`,
        `${Math.max(1, num - 1)}/${den}`,
        `${Math.min(den, num + 1)}/${den}`,
        `1/${den}`,
      ]
      for (const c of shuffle(candidates)) {
        if (wrongSet.size < 4) wrongSet.add(c)
      }
      while (wrongSet.size < 4) {
        const d = randomInt(2, 8)
        const n = randomInt(1, d - 1)
        wrongSet.add(`${n}/${d}`)
      }
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'What fraction of the shape is colored?',
        spokenPrompt: `${num} out of ${den} equal parts are shaded. Which fraction is this?`,
        expression: `Shaded Fraction = ?`,
        fractionNum: num,
        fractionDen: den,
        answer: correct,
        visualType: 'fraction',
        inputMode: 'choices',
        choices: shuffle([...wrongSet]),
        hint: `Count the shaded slices (${num}) on top as the numerator, and total equal slices (${den}) on the bottom as the denominator: ${num}/${den}!`,
      }
    }

    case 'math-21': {
      // Order of Operations (2-Step Math)
      const a = randomInt(2, 7)
      const b = randomInt(2, 6)
      const c = randomInt(3, 15)
      const isAddSecond = index % 2 === 0
      const product = a * b
      const answer = isAddSecond ? product + c : Math.max(0, product - Math.min(product - 1, c))
      const actualC = isAddSecond ? c : Math.min(product - 1, c)
      const expr = isAddSecond
        ? `(${a} × ${b}) + ${actualC} = ?`
        : `(${a} × ${b}) - ${actualC} = ?`
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Solve inside the parentheses ( ) first!',
        spokenPrompt: `Solve ${a} times ${b} first, then ${isAddSecond ? 'add' : 'subtract'} ${actualC}.`,
        expression: expr,
        answer,
        visualType: 'none',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: generateSmartMathChoices(answer, { min: 1, max: 70 }),
        hint: `Step 1: (${a} × ${b}) = ${product}. Step 2: ${product} ${isAddSecond ? '+' : '-'} ${actualC} = ${answer}!`,
      }
    }

    case 'math-22': {
      // Multi-Step Story Problems (Tier 4)
      const storyQ = generateStoryProblem(4)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Read the adventure story problem carefully:',
        spokenPrompt: storyQ.story,
        story: storyQ.story,
        sceneImage: storyQ.sceneImage,
        expression: 'Solve the Story!',
        num1: storyQ.num1,
        num2: storyQ.num2,
        operation: storyQ.operation,
        answer: storyQ.answer,
        visualItem: storyQ.visualItem,
        visualType: 'story-scene',
        inputMode: 'choices',
        choices: generateSmartMathChoices(storyQ.answer, { min: 2, max: Math.max(60, storyQ.answer + 15) }),
        hint: `Break the story into steps and combine the numbers carefully to reach ${storyQ.answer}!`,
      }
    }

    // ── TIER 1 & 2 READING / SPELLING ──
    case 'read-1': {
      const pool = WORD_BANK.filter((w) => w.word.length <= 4)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r1-${w.word}`, profileId)
      const firstLetter = entry.word[0].toUpperCase()
      const rest = entry.word.slice(1).toUpperCase()
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `What letter does "${entry.word.toUpperCase()}" start with?`,
        spokenPrompt: `${entry.word}. What letter sound does ${entry.word} start with?`,
        wordData: entry,
        displayPattern: `_${rest}`,
        answer: firstLetter,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: makeLetterChoices(firstLetter, 'bcdfghklmnprstvwz'),
        hint: `Say "${entry.word}" slowly. The first sound is "${firstLetter}" — ${firstLetter}${rest}!`,
      }
    }

    case 'read-2': {
      const pool = WORD_BANK.filter((w) => w.word.length === 3)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r2-${w.word}`, profileId)
      const lastLetter = entry.word[entry.word.length - 1].toUpperCase()
      const prefix = entry.word.slice(0, -1).toUpperCase()
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `What is the LAST letter in "${entry.word.toUpperCase()}"?`,
        spokenPrompt: `${entry.word}. What is the ending letter of ${entry.word}?`,
        wordData: entry,
        displayPattern: `${prefix}_`,
        answer: lastLetter,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: makeLetterChoices(lastLetter, 'bdgklmnprstx'),
        hint: `Listen to the end of "${entry.word}": ${prefix} + ${lastLetter} = ${entry.word.toUpperCase()}!`,
      }
    }

    case 'read-3': {
      const pool = WORD_BANK.filter((w) => w.word.length === 3 && 'aeiou'.includes(w.word[1]))
      const [entry] = pickSmartBatch(pool, 1, (w) => `r3-${w.word}`, profileId)
      const vowel = entry.word[1].toUpperCase()
      const first = entry.word[0].toUpperCase()
      const last = entry.word[2].toUpperCase()
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Pick the missing middle vowel!',
        spokenPrompt: `${entry.word}. Which vowel goes in the middle of ${entry.word}?`,
        wordData: entry,
        displayPattern: `${first}_${last}`,
        answer: vowel,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: ['A', 'E', 'I', 'O', 'U'],
        hint: `The middle vowel in ${entry.word.toUpperCase()} is "${vowel}": ${first}-${vowel}-${last}!`,
      }
    }

    case 'read-4': {
      const pool = WORD_BANK.filter((w) => w.word.length === 3)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r4-${w.word}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Tap the letter tiles to spell the 3-letter word!',
        spokenPrompt: `Spell the word ${entry.word}.`,
        wordData: entry,
        answer: entry.word.toUpperCase(),
        visualType: 'word-card',
        inputMode: 'letter-tiles',
        tiles: makeScrambledTiles(entry.word, 1),
        hint: `"${entry.word.toUpperCase()}" is spelled ${entry.word.toUpperCase().split('').join(' - ')}.`,
      }
    }

    case 'read-5': {
      const pool = WORD_BANK.filter((w) => w.word.length === 4)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r5-${w.word}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Build this 4-letter word!',
        spokenPrompt: `Spell the four letter word: ${entry.word}.`,
        wordData: entry,
        answer: entry.word.toUpperCase(),
        visualType: 'word-card',
        inputMode: 'letter-tiles',
        tiles: makeScrambledTiles(entry.word, 1),
        hint: `Start with "${entry.word.slice(0, 2).toUpperCase()}": ${entry.word.toUpperCase().split('').join(' - ')}.`,
      }
    }

    case 'read-6': {
      const pool = WORD_BANK.filter((w) => w.word.length === 5)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r6-${w.word}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Super Speller! Build the 5-letter word:',
        spokenPrompt: `Spell the five letter word: ${entry.word}.`,
        wordData: entry,
        answer: entry.word.toUpperCase(),
        visualType: 'word-card',
        inputMode: 'letter-tiles',
        tiles: makeScrambledTiles(entry.word, 2),
        hint: `Step by step: ${entry.word.toUpperCase().split('').join(' - ')}!`,
      }
    }

    case 'read-7': {
      const [target] = pickSmartBatch(SIGHT_WORDS, 1, (s) => `r7-${s.word}`, profileId)
      const distractors = shuffle(
        SIGHT_WORDS.filter((s) => s.word !== target.word).map((s) => s.word.toUpperCase()),
      ).slice(0, 3)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `Find the sight word: "${target.word.toUpperCase()}"`,
        spokenPrompt: `Find the sight word: ${target.word}. ${target.example}`,
        wordData: {
          word: target.word,
          emoji: target.emoji,
          image: emojiToTwemojiUrl(target.emoji),
          category: 'Sight Word',
        },
        sentence: target.example,
        answer: target.word.toUpperCase(),
        visualType: 'sentence-card',
        inputMode: 'choices',
        choices: shuffle([target.word.toUpperCase(), ...distractors]),
        hint: `Look for the letters ${target.word.toUpperCase().split('').join('-')}!`,
      }
    }

    case 'read-8': {
      const pool = WORD_BANK.filter((w) => w.word.length <= 5)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r8-${w.word}`, profileId)
      const distractors = shuffle(
        pool
          .filter((w) => w.word !== entry.word && w.word.length === entry.word.length)
          .map((w) => w.word.toUpperCase()),
      ).slice(0, 3)
      const fullSentence = entry.sentence.replace('___', entry.word)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Pick the word that completes the sentence!',
        spokenPrompt: `${fullSentence}. Which word goes in the blank?`,
        wordData: entry,
        sentence: entry.sentence,
        answer: entry.word.toUpperCase(),
        visualType: 'sentence-card',
        inputMode: 'choices',
        choices: shuffle([entry.word.toUpperCase(), ...distractors]),
        hint: `Look at the picture ${entry.emoji}! The missing word is "${entry.word.toUpperCase()}".`,
      }
    }

    // ── TIER 3 READING & LANGUAGE ARTS (Grades 1–2) ──
    case 'read-9': {
      // 6 & 7-Letter Spelling Bee
      const pool = WORD_BANK.filter((w) => w.word.length >= 6 && w.word.length <= 7)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r9-${w.word}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `Spelling Bee! Build this ${entry.word.length}-letter word:`,
        spokenPrompt: `Spell the word: ${entry.word}. ${entry.sentence.replace('___', entry.word)}`,
        wordData: entry,
        sentence: entry.sentence,
        answer: entry.word.toUpperCase(),
        visualType: 'word-card',
        inputMode: 'letter-tiles',
        tiles: makeScrambledTiles(entry.word, 2),
        hint: `Break it into syllables: ${entry.word.toUpperCase().split('').join(' - ')}!`,
      }
    }

    case 'read-10': {
      // Synonyms & Antonyms
      const [item] = pickSmartBatch(
        SYNONYM_ANTONYM_BANK,
        1,
        (x) => `r10-${x.target}`,
        profileId,
      )
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `Find the ${item.mode} for "${item.target}":`,
        spokenPrompt: `Find the ${item.mode} for the word ${item.target}.`,
        wordData: {
          word: item.target,
          emoji: item.emoji,
          image: emojiToTwemojiUrl(item.emoji),
          category: item.mode,
        },
        displayPattern: item.target,
        answer: item.answer,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }

    case 'read-11': {
      // Grammar Detective
      const [item] = pickSmartBatch(
        GRAMMAR_BANK,
        1,
        (x) => `r11-${x.targetWord}`,
        profileId,
      )
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `What part of speech is "${item.targetWord}"?`,
        spokenPrompt: `${item.sentence} Is the word ${item.targetWord} a noun, a verb, or an adjective?`,
        wordData: {
          word: item.targetWord,
          emoji: item.emoji,
          image: emojiToTwemojiUrl(item.emoji),
          category: 'Grammar Detective',
        },
        sentence: item.sentence,
        answer: item.answer,
        visualType: 'sentence-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }

    case 'read-12': {
      // Compound Words & Irregular Plurals
      const [item] = pickSmartBatch(
        COMPOUND_PLURAL_BANK,
        1,
        (x) => `r12-${x.answer}`,
        profileId,
      )
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: item.prompt,
        spokenPrompt: item.prompt,
        wordData: {
          word: item.answer,
          emoji: item.emoji,
          image: emojiToTwemojiUrl(item.emoji),
          category: 'Word Builder',
        },
        answer: item.answer,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }

    // ── TIER 4 READING & LANGUAGE ARTS (Grades 3–4) ──
    case 'read-13': {
      // 8 & 9-Letter Championship Speller
      const pool = WORD_BANK.filter((w) => w.word.length >= 8)
      const [entry] = pickSmartBatch(pool, 1, (w) => `r13-${w.word}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `Championship Speller! Build this ${entry.word.length}-letter word:`,
        spokenPrompt: `Spell the word: ${entry.word}. ${entry.sentence.replace('___', entry.word)}`,
        wordData: entry,
        sentence: entry.sentence,
        answer: entry.word.toUpperCase(),
        visualType: 'word-card',
        inputMode: 'letter-tiles',
        tiles: makeScrambledTiles(entry.word, 2),
        hint: `Championship hint: ${entry.word.toUpperCase().split('').join(' - ')}!`,
      }
    }

    case 'read-14': {
      // Homophones & Tricky Words
      const [item] = pickSmartBatch(
        HOMOPHONE_BANK,
        1,
        (x) => `r14-${x.sentence}`,
        profileId,
      )
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Choose the right sound-alike word (homophone):',
        spokenPrompt: `${item.sentence.replace('___', item.answer)}. Which spelling fits in the blank?`,
        wordData: {
          word: item.answer,
          emoji: item.emoji,
          image: emojiToTwemojiUrl(item.emoji),
          category: 'Homophones',
        },
        sentence: item.sentence,
        answer: item.answer,
        visualType: 'sentence-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }

    case 'read-15': {
      // Vocabulary in Context
      const [item] = pickSmartBatch(VOCAB_BANK, 1, (x) => `r15-${x.target}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `What does "${item.target}" mean in this sentence?`,
        spokenPrompt: `${item.sentence} What does ${item.target} mean?`,
        wordData: {
          word: item.target,
          emoji: item.emoji,
          image: emojiToTwemojiUrl(item.emoji),
          category: 'Vocabulary',
        },
        sentence: item.sentence,
        answer: item.answer,
        visualType: 'sentence-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }

    case 'read-16':
    default: {
      // Illustrated Reading Comprehension Passages
      const [item] = pickSmartBatch(READING_PASSAGES, 1, (x) => `r16-${x.id}`, profileId)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: item.question,
        spokenPrompt: `${item.title}. ${item.passage} Question: ${item.question}`,
        passageTitle: item.title,
        passageText: item.passage,
        sceneImage: item.scene,
        answer: item.answer,
        visualType: 'passage-card',
        inputMode: 'choices',
        choices: shuffle(item.choices),
        hint: item.hint,
      }
    }
  }
}

/**
 * Generate a non-repeating 6-question round for a given node
 */
export function generateNodeQuestions(nodeId, count = 6, profileId = 'default') {
  const questions = []
  const roundSignatures = new Set()

  for (let i = 0; i < count; i++) {
    let q
    let retries = 0
    let sig = ''

    do {
      retries++
      q = generateQuestionForNode(nodeId, i, profileId)
      sig = `${q.nodeId}-${q.expression || ''}-${q.sentence || ''}-${q.passageTitle || ''}-${q.wordData?.word || ''}-${q.answer}`
    } while (
      retries < 12 &&
      (roundSignatures.has(sig) || (retries < 6 && hasSeenRecently(sig, profileId)))
    )

    roundSignatures.add(sig)
    recordSeenSignature(sig, profileId)
    questions.push(q)
  }

  return questions
}

/**
 * Generate a 6-question Daily Practice mix tailored to the child's current Math & Reading frontier
 */
export function generateDailyPracticeBatch(
  mathNodeId = 'math-1',
  readingNodeId = 'read-1',
  profileId = 'default',
) {
  const mathNode = MATH_TRACK.find((n) => n.id === mathNodeId) || MATH_TRACK[0]
  const storyNodeId = mathNode.tier >= 3 ? 'math-22' : 'math-11'

  return [
    generateQuestionForNode(mathNodeId, 0, profileId),
    generateQuestionForNode(readingNodeId, 1, profileId),
    generateQuestionForNode(mathNodeId, 2, profileId),
    generateQuestionForNode(readingNodeId, 3, profileId),
    generateQuestionForNode(mathNodeId, 4, profileId),
    generateQuestionForNode(storyNodeId, 5, profileId),
  ]
}
