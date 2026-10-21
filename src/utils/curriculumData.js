import { generateStoryProblem } from './questionGenerator'

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

export const STUDY_BUDDIES = [
  {
    id: 'owl',
    name: 'Professor Hoot',
    emoji: '🦉',
    greeting: 'Hoot hoot! Let’s learn something new today!',
    cheers: ['Wise move!', 'Hoot-ray! You got it!', 'Super smart thinking!'],
  },
  {
    id: 'bunny',
    name: 'Barnaby Bunny',
    emoji: '🐰',
    greeting: 'Hop on in! Ready to bounce through some puzzles?',
    cheers: ['Hop-tastic!', 'You jumped right to the answer!', 'Ear-resistible work!'],
  },
  {
    id: 'bear',
    name: 'Bella Bear',
    emoji: '🐻',
    greeting: 'Big bear high-five! Let’s grow your brain today!',
    cheers: ['Bear-y awesome!', 'Paws-itively brilliant!', 'You are unstoppable!'],
  },
  {
    id: 'fox',
    name: 'Finley Fox',
    emoji: '🦊',
    greeting: 'Clever fox time! Which skill shall we master next?',
    cheers: ['Clever as a fox!', 'Sharp thinking!', 'Fantastic job!'],
  },
]

export const STICKER_CATALOG = [
  // Unlocked progressively as total stars grow
  { id: 's1', name: 'Happy Star', emoji: '🌟', category: 'Space', starsRequired: 1, fact: 'Stars are giant glowing balls of gas in space!' },
  { id: 's2', name: 'Cuddly Kitten', emoji: '🐱', category: 'Animals', starsRequired: 3, fact: 'Kittens purr when they are happy and cozy.' },
  { id: 's3', name: 'Rocket Ship', emoji: '🚀', category: 'Space', starsRequired: 5, fact: 'Rockets travel faster than sound to reach outer space!' },
  { id: 's4', name: 'Baby Chick', emoji: '🐣', category: 'Animals', starsRequired: 8, fact: 'Baby chicks peck their way out of cozy eggs.' },
  { id: 's5', name: 'Rainbow', emoji: '🌈', category: 'Nature', starsRequired: 11, fact: 'Rainbows happen when sunlight shines through raindrops!' },
  { id: 's6', name: 'T-Rex', emoji: '🦖', category: 'Dinosaurs', starsRequired: 14, fact: 'T-Rex had giant teeth the size of bananas!' },
  { id: 's7', name: 'Strawberry Cupcake', emoji: '🧁', category: 'Treats', starsRequired: 17, fact: 'Cupcakes were once called 1-2-3-4 cakes because of their recipe!' },
  { id: 's8', name: 'Friendly Dolphin', emoji: '🐬', category: 'Animals', starsRequired: 20, fact: 'Dolphins talk to each other using clicks and whistles.' },
  { id: 's9', name: 'Ringed Planet', emoji: '🪐', category: 'Space', starsRequired: 24, fact: 'Saturn’s rings are made of millions of icy snowballs!' },
  { id: 's10', name: 'Bronto Dino', emoji: '🦕', category: 'Dinosaurs', starsRequired: 28, fact: 'Long-necked dinosaurs ate leaves from the tallest trees.' },
  { id: 's11', name: 'Unicorn Magic', emoji: '🦄', category: 'Magic', starsRequired: 32, fact: 'Unicorns are legendary creatures of kindness and wonder!' },
  { id: 's12', name: 'Ice Cream Cone', emoji: '🍦', category: 'Treats', starsRequired: 36, fact: 'Vanilla is the world’s most popular ice cream flavor!' },
  { id: 's13', name: 'Clever Octopus', emoji: '🐙', category: 'Animals', starsRequired: 40, fact: 'An octopus has eight arms and three hearts!' },
  { id: 's14', name: 'Full Moon', emoji: '🌕', category: 'Space', starsRequired: 45, fact: 'Astronauts walked on the Moon and left footprints there!' },
  { id: 's15', name: 'Colorful Butterfly', emoji: '🦋', category: 'Nature', starsRequired: 50, fact: 'Butterflies taste their food with their feet!' },
  { id: 's16', name: 'Rock Guitar', emoji: '🎸', category: 'Music', starsRequired: 55, fact: 'Guitars have six strings that vibrate to make music.' },
  { id: 's17', name: 'Giant Panda', emoji: '🐼', category: 'Animals', starsRequired: 60, fact: 'Pandas spend up to 12 hours a day munching bamboo!' },
  { id: 's18', name: 'Shooting Star', emoji: '🌠', category: 'Space', starsRequired: 66, fact: 'Shooting stars are tiny space rocks burning up in the sky.' },
  { id: 's19', name: 'Pink Flamingo', emoji: '🦩', category: 'Animals', starsRequired: 72, fact: 'Flamingos turn pink from eating shrimp and algae!' },
  { id: 's20', name: 'Artist Palette', emoji: '🎨', category: 'Music', starsRequired: 78, fact: 'Mixing red, yellow, and blue lets you paint almost any color!' },
  { id: 's21', name: 'Koala Bear', emoji: '🐨', category: 'Animals', starsRequired: 84, fact: 'Koalas sleep up to 20 hours a day in eucalyptus trees.' },
  { id: 's22', name: 'Golden Crown', emoji: '👑', category: 'Magic', starsRequired: 90, fact: 'You are royalty in the Kingdom of Learning!' },
  { id: 's23', name: 'World Globe', emoji: '🌍', category: 'Nature', starsRequired: 98, fact: 'Earth is the only planet we know with oceans and forests!' },
  { id: 's24', name: 'Grand Champion Trophy', emoji: '🏆', category: 'Magic', starsRequired: 108, fact: 'You mastered both Math and Reading adventures!' },
]

export const MATH_TRACK = [
  {
    id: 'math-1',
    stepNumber: 1,
    track: 'math',
    title: 'Ten-Frame Counting',
    subtitle: 'Count 1 to 10',
    badge: '3A',
    icon: '🔟',
    color: '#FFE135',
    description: 'Count objects inside a 10-frame grid.',
  },
  {
    id: 'math-2',
    stepNumber: 2,
    track: 'math',
    title: 'Add +1 & +2',
    subtitle: 'Number Line Hops',
    badge: '3A+',
    icon: '🐸',
    color: '#90EE90',
    description: 'Hop forward 1 or 2 steps on the number line.',
  },
  {
    id: 'math-3',
    stepNumber: 3,
    track: 'math',
    title: 'Adding +3, +4, +5',
    subtitle: 'Sums to 10',
    badge: '2A',
    icon: '➕',
    color: '#87CEEB',
    description: 'Add 3, 4, or 5 using color-coded ten-frames.',
  },
  {
    id: 'math-4',
    stepNumber: 4,
    track: 'math',
    title: 'Doubles Power',
    subtitle: '1+1 up to 5+5',
    badge: '2A+',
    icon: '👯',
    color: '#FFB6C1',
    description: 'Learn twin numbers like 2+2, 3+3, 4+4, and 5+5.',
  },
  {
    id: 'math-5',
    stepNumber: 5,
    track: 'math',
    title: 'Making 10',
    subtitle: 'Number Bonds',
    badge: 'A1',
    icon: '🎯',
    color: '#DDA0DD',
    description: 'Find how many more counters are needed to fill 10!',
  },
  {
    id: 'math-6',
    stepNumber: 6,
    track: 'math',
    title: 'Take Away -1 & -2',
    subtitle: 'Hop Backward',
    badge: 'A2',
    icon: '➖',
    color: '#FFA07A',
    description: 'Count backward 1 or 2 steps to subtract.',
  },
  {
    id: 'math-7',
    stepNumber: 7,
    track: 'math',
    title: 'Subtract within 10',
    subtitle: 'Take Away Practice',
    badge: 'A3',
    icon: '🎈',
    color: '#FF9EB5',
    description: 'Cross out items and find how many are left.',
  },
  {
    id: 'math-8',
    stepNumber: 8,
    track: 'math',
    title: 'More, Less or Equal',
    subtitle: 'Compare Numbers',
    badge: 'B1',
    icon: '⚖️',
    color: '#7FE5D8',
    description: 'Compare two groups using >, <, or =.',
  },
  {
    id: 'math-9',
    stepNumber: 9,
    track: 'math',
    title: 'Math Stories',
    subtitle: 'Word Problems',
    badge: 'B2',
    icon: '📖',
    color: '#87CEEB',
    description: 'Solve real-life stories with addition and subtraction.',
  },
  {
    id: 'math-10',
    stepNumber: 10,
    track: 'math',
    title: 'Teen Numbers to 20',
    subtitle: 'Number Pad Mastery',
    badge: 'C1',
    icon: '🚀',
    color: '#FFE135',
    description: 'Add and subtract up to 20 using the Number Pad!',
  },
]

export const READING_TRACK = [
  {
    id: 'read-1',
    stepNumber: 1,
    track: 'reading',
    title: 'Beginning Sounds',
    subtitle: 'First Letter Phonics',
    badge: '7A',
    icon: '🔤',
    color: '#FFE135',
    description: 'Listen to the word and pick its starting letter!',
  },
  {
    id: 'read-2',
    stepNumber: 2,
    track: 'reading',
    title: 'Ending Sounds',
    subtitle: 'Last Letter Phonics',
    badge: '6A',
    icon: '🎵',
    color: '#90EE90',
    description: 'Find the letter sound at the very end of the word.',
  },
  {
    id: 'read-3',
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
    stepNumber: 4,
    track: 'reading',
    title: '3-Letter CVC Words',
    subtitle: 'Tap Tiles to Spell',
    badge: '4A',
    icon: '🐱',
    color: '#87CEEB',
    description: 'Build 3-letter words using scrambled letter tiles.',
  },
  {
    id: 'read-5',
    stepNumber: 5,
    track: 'reading',
    title: '4-Letter Blends',
    subtitle: 'Word Builders',
    badge: '3A',
    icon: '🐸',
    color: '#DDA0DD',
    description: 'Spell 4-letter words like FROG, STAR, and MILK.',
  },
  {
    id: 'read-6',
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
    stepNumber: 7,
    track: 'reading',
    title: 'Sight Words',
    subtitle: 'Quick Reader',
    badge: 'A1',
    icon: '👀',
    color: '#7FE5D8',
    description: 'Spot everyday reading words in a flash!',
  },
  {
    id: 'read-8',
    stepNumber: 8,
    track: 'reading',
    title: 'Sentence Builder',
    subtitle: 'Read & Complete',
    badge: 'A2',
    icon: '📚',
    color: '#FFE135',
    description: 'Read a short picture sentence and pick the missing word.',
  },
]

export const ALL_NODES = [...MATH_TRACK, ...READING_TRACK]

export const WORD_BANK = [
  // 3-letter CVC words
  { word: 'cat', category: 'Animal', emoji: '🐱', sentence: 'The sleepy ___ naps on the rug.' },
  { word: 'dog', category: 'Animal', emoji: '🐶', sentence: 'The happy ___ wags its tail.' },
  { word: 'hen', category: 'Animal', emoji: '🐔', sentence: 'The red ___ laid an egg.' },
  { word: 'cow', category: 'Animal', emoji: '🐄', sentence: 'The farm ___ eats green grass.' },
  { word: 'ant', category: 'Animal', emoji: '🐜', sentence: 'A tiny ___ carries a crumb.' },
  { word: 'bee', category: 'Animal', emoji: '🐝', sentence: 'The buzzing ___ loves flowers.' },
  { word: 'owl', category: 'Animal', emoji: '🦉', sentence: 'The wise ___ hoots at night.' },
  { word: 'fox', category: 'Animal', emoji: '🦊', sentence: 'The clever orange ___ has a bushy tail.' },
  { word: 'pig', category: 'Animal', emoji: '🐷', sentence: 'The pink ___ plays in the mud.' },
  { word: 'sun', category: 'Nature', emoji: '☀️', sentence: 'The bright yellow ___ shines in the sky.' },
  { word: 'hat', category: 'Thing', emoji: '🎩', sentence: 'Put the warm ___ on your head.' },
  { word: 'cup', category: 'Thing', emoji: '☕', sentence: 'She drinks warm milk from a ___.' },
  { word: 'bus', category: 'Thing', emoji: '🚌', sentence: 'We ride the yellow school ___.' },
  { word: 'bed', category: 'Thing', emoji: '🛏️', sentence: 'It is time to sleep in my cozy ___.' },
  { word: 'box', category: 'Thing', emoji: '📦', sentence: 'The toy is inside the brown ___.' },
  // 4-letter words
  { word: 'frog', category: 'Animal', emoji: '🐸', sentence: 'The green ___ jumps into the pond.' },
  { word: 'duck', category: 'Animal', emoji: '🦆', sentence: 'The yellow ___ swims in the lake.' },
  { word: 'bear', category: 'Animal', emoji: '🐻', sentence: 'The big brown ___ loves honey.' },
  { word: 'fish', category: 'Animal', emoji: '🐟', sentence: 'A shiny ___ swims in the water.' },
  { word: 'lion', category: 'Animal', emoji: '🦁', sentence: 'The brave ___ has a golden mane.' },
  { word: 'bird', category: 'Animal', emoji: '🐦', sentence: 'The little blue ___ sings a song.' },
  { word: 'ball', category: 'Thing', emoji: '⚽', sentence: 'Kick the soccer ___ into the net!' },
  { word: 'book', category: 'Thing', emoji: '📚', sentence: 'Let us read a bedtime ___ together.' },
  { word: 'cake', category: 'Food', emoji: '🎂', sentence: 'Happy birthday! Blow out the candles on the ___.' },
  { word: 'milk', category: 'Food', emoji: '🥛', sentence: 'Pour a cold glass of ___.' },
  { word: 'star', category: 'Nature', emoji: '⭐', sentence: 'Make a wish upon a twinkling ___.' },
  { word: 'drum', category: 'Thing', emoji: '🥁', sentence: 'Beat the loud ___ with two sticks!' },
  { word: 'boat', category: 'Thing', emoji: '⛵', sentence: 'The sail ___ glides across the sea.' },
  { word: 'shoe', category: 'Thing', emoji: '👟', sentence: 'Tie the laces on your running ___.' },
  // 5-letter words
  { word: 'tiger', category: 'Animal', emoji: '🐯', sentence: 'The striped ___ prowls through the jungle.' },
  { word: 'horse', category: 'Animal', emoji: '🐴', sentence: 'The fast ___ gallops across the field.' },
  { word: 'shark', category: 'Animal', emoji: '🦈', sentence: 'A big gray ___ swims in the deep ocean.' },
  { word: 'snake', category: 'Animal', emoji: '🐍', sentence: 'The green ___ slithers in the grass.' },
  { word: 'mouse', category: 'Animal', emoji: '🐭', sentence: 'The tiny ___ nibbles on some cheese.' },
  { word: 'whale', category: 'Animal', emoji: '🐋', sentence: 'The giant blue ___ spouts water!' },
  { word: 'panda', category: 'Animal', emoji: '🐼', sentence: 'The black and white ___ eats bamboo.' },
  { word: 'zebra', category: 'Animal', emoji: '🦓', sentence: 'Every ___ has black and white stripes.' },
  { word: 'apple', category: 'Food', emoji: '🍎', sentence: 'Crunch into a sweet red ___!' },
  { word: 'bread', category: 'Food', emoji: '🍞', sentence: 'Warm baked ___ smells delicious.' },
  { word: 'grape', category: 'Food', emoji: '🍇', sentence: 'A purple ___ grows on a vine.' },
  { word: 'clock', category: 'Thing', emoji: '🕐', sentence: 'Look at the ___ to tell the time.' },
  { word: 'plant', category: 'Nature', emoji: '🌿', sentence: 'Water the green ___ so it grows tall.' },
  { word: 'train', category: 'Thing', emoji: '🚂', sentence: 'Choo choo! The ___ rolls down the tracks.' },
  { word: 'house', category: 'Thing', emoji: '🏠', sentence: 'Welcome home to our cozy ___.' },
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
]

const COUNT_EMOJIS = ['🍎', '🌟', '🦋', '🍓', '🍪', '🎈', '🐢', '🌸', '🧁', '🦆']

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeNumericChoices(correct, min = 0, max = 10) {
  const set = new Set([correct])
  while (set.size < 4) {
    const delta = randomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1)
    const candidate = correct + delta
    if (candidate >= min && candidate <= max) {
      set.add(candidate)
    } else {
      set.add(randomInt(min, max))
    }
  }
  return shuffle([...set])
}

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
 * Generate a single question for a specific skill node
 */
export function generateQuestionForNode(nodeId, index = 0) {
  const emoji = COUNT_EMOJIS[randomInt(0, COUNT_EMOJIS.length - 1)]

  switch (nodeId) {
    case 'math-1': {
      // Ten-Frame Counting (1 to 10)
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
        choices: makeNumericChoices(count, 1, 10),
        hint: `A full top row has 5. Count each ${emoji} one by one up to ${count}!`,
      }
    }

    case 'math-2': {
      // Add +1 & +2 on Number Line
      const a = randomInt(1, 8)
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
        choices: makeNumericChoices(answer, 1, 10),
        hint: `Start at ${a} on the number line and make ${b} hop${b > 1 ? 's' : ''} to the right: ${a} → ${answer}!`,
      }
    }

    case 'math-3': {
      // Adding +3, +4, +5 with Ten-Frame
      const b = randomInt(3, 5)
      const a = randomInt(1, 10 - b)
      const answer = a + b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Add the two groups together!',
        spokenPrompt: `What is ${a} plus ${b}?`,
        expression: `${a} + ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: makeNumericChoices(answer, 2, 10),
        hint: `Start with ${a} yellow dots, then count ${b} more blue dots: ${a} + ${b} = ${answer}.`,
      }
    }

    case 'math-4': {
      // Doubles (1+1 to 5+5)
      const a = randomInt(1, 5)
      const answer = a + a
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Doubles Power! Add the twin numbers:',
        spokenPrompt: `Doubles time! What is ${a} plus ${a}?`,
        expression: `${a} + ${a} = ?`,
        num1: a,
        num2: a,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'emoji-groups',
        inputMode: index >= 3 ? 'numpad' : 'choices',
        choices: makeNumericChoices(answer, 2, 10),
        hint: `Two equal groups of ${a} make ${answer}! (${a} + ${a} = ${answer})`,
      }
    }

    case 'math-5': {
      // Making 10 (Number Bonds: a + ? = 10)
      const a = randomInt(1, 9)
      const answer = 10 - a
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'How many more to make 10?',
        spokenPrompt: `${a} plus what number makes 10? Count the empty boxes in the ten frame!`,
        expression: `${a} + ? = 10`,
        num1: a,
        num2: answer,
        operation: 'making-10',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame-missing',
        inputMode: 'choices',
        choices: makeNumericChoices(answer, 1, 9),
        hint: `There are 10 boxes in all. ${a} are filled, leaving ${answer} empty box${answer > 1 ? 'es' : ''}. So ${a} + ${answer} = 10!`,
      }
    }

    case 'math-6': {
      // Take Away -1 & -2 on Number Line
      const a = randomInt(3, 10)
      const b = randomInt(1, 2)
      const answer = a - b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Hop backward to take away!',
        spokenPrompt: `What is ${a} minus ${b}? Start at ${a} and hop backward ${b}.`,
        expression: `${a} - ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'subtraction',
        answer,
        visualItem: emoji,
        visualType: 'number-line',
        inputMode: 'choices',
        choices: makeNumericChoices(answer, 0, 10),
        hint: `Start at ${a} on the number line and hop left ${b} step${b > 1 ? 's' : ''} to land on ${answer}!`,
      }
    }

    case 'math-7': {
      // Subtract within 10
      const a = randomInt(4, 10)
      const b = randomInt(2, a - 1)
      const answer = a - b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Subtract to see how many are left:',
        spokenPrompt: `What is ${a} minus ${b}?`,
        expression: `${a} - ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'subtraction',
        answer,
        visualItem: emoji,
        visualType: 'emoji-groups',
        inputMode: index >= 4 ? 'numpad' : 'choices',
        choices: makeNumericChoices(answer, 0, 10),
        hint: `We start with ${a} ${emoji} and cross out ${b}. Count the ones not crossed out: ${answer} left!`,
      }
    }

    case 'math-8': {
      // Compare Numbers (>, <, =)
      const a = randomInt(1, 10)
      const b = Math.random() < 0.25 ? a : randomInt(1, 10)
      const answer = a > b ? '>' : a < b ? '<' : '='
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Compare the two sides! Which symbol fits?',
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
            ? `${a} is more than ${b}, and the alligator mouth always opens toward the bigger number: ${a} > ${b}!`
            : a < b
              ? `${a} is smaller than ${b}, so the mouth opens toward ${b}: ${a} < ${b}!`
              : `Both sides have ${a}, so they are equal: ${a} = ${b}!`,
      }
    }

    case 'math-9': {
      // Math Stories
      const storyQ = generateStoryProblem(2)
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Listen or read the story problem:',
        spokenPrompt: storyQ.story,
        story: storyQ.story,
        expression:
          storyQ.operation === 'addition'
            ? `${storyQ.num1} + ${storyQ.num2} = ?`
            : `${storyQ.num1} - ${storyQ.num2} = ?`,
        num1: storyQ.num1,
        num2: storyQ.num2,
        operation: storyQ.operation,
        answer: storyQ.answer,
        visualItem: storyQ.visualItem,
        visualType: 'emoji-groups',
        inputMode: 'choices',
        choices: makeNumericChoices(storyQ.answer, 0, 12),
        hint:
          storyQ.operation === 'addition'
            ? `This story joins groups together: ${storyQ.num1} + ${storyQ.num2} = ${storyQ.answer}!`
            : `This story takes away: start with ${storyQ.num1} and take away ${storyQ.num2} to get ${storyQ.answer}!`,
      }
    }

    case 'math-10': {
      // Teen Numbers & Adding up to 20 (Number Pad Mastery)
      const a = randomInt(6, 12)
      const b = randomInt(2, 8)
      const answer = a + b
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'math',
        prompt: 'Use the Number Pad to solve!',
        spokenPrompt: `What is ${a} plus ${b}? Type your answer on the number pad.`,
        expression: `${a} + ${b} = ?`,
        num1: a,
        num2: b,
        operation: 'addition',
        answer,
        visualItem: emoji,
        visualType: 'ten-frame-double',
        inputMode: 'numpad',
        choices: makeNumericChoices(answer, 8, 20),
        hint: `Make 10 first! Fill the first ten-frame (10), then see how many are in the second frame: 10 + ${answer - 10} = ${answer}.`,
      }
    }

    // ── READING & SPELLING TRACK ──
    case 'read-1': {
      // Beginning Sounds
      const threeLetterPool = WORD_BANK.filter((w) => w.word.length <= 4)
      const entry = threeLetterPool[randomInt(0, threeLetterPool.length - 1)]
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
        hint: `Say "${entry.word}" slowly. The very first sound is "${firstLetter}" — ${firstLetter}${rest}!`,
      }
    }

    case 'read-2': {
      // Ending Sounds
      const threeLetterPool = WORD_BANK.filter((w) => w.word.length === 3)
      const entry = threeLetterPool[randomInt(0, threeLetterPool.length - 1)]
      const lastLetter = entry.word[entry.word.length - 1].toUpperCase()
      const prefix = entry.word.slice(0, -1).toUpperCase()
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: `What is the LAST letter in "${entry.word.toUpperCase()}"?`,
        spokenPrompt: `${entry.word}. Listen to the end of the word ${entry.word}. What is the last letter?`,
        wordData: entry,
        displayPattern: `${prefix}_`,
        answer: lastLetter,
        visualType: 'word-card',
        inputMode: 'choices',
        choices: makeLetterChoices(lastLetter, 'bdgklmnprstx'),
        hint: `Listen to the ending sound of "${entry.word}": ${prefix} + ${lastLetter} = ${entry.word.toUpperCase()}!`,
      }
    }

    case 'read-3': {
      // Short Vowel Builder
      const cvcWords = WORD_BANK.filter(
        (w) => w.word.length === 3 && 'aeiou'.includes(w.word[1]),
      )
      const entry = cvcWords[randomInt(0, cvcWords.length - 1)]
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
      // 3-Letter CVC Words with Tappable Letter Tiles
      const pool = WORD_BANK.filter((w) => w.word.length === 3)
      const entry = pool[randomInt(0, pool.length - 1)]
      return {
        id: `${nodeId}-${index}`,
        nodeId,
        track: 'reading',
        prompt: 'Tap the letter tiles to spell the word!',
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
      // 4-Letter Blends
      const pool = WORD_BANK.filter((w) => w.word.length === 4)
      const entry = pool[randomInt(0, pool.length - 1)]
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
        hint: `Start with "${entry.word[0].toUpperCase()}${entry.word[1].toUpperCase()}": ${entry.word.toUpperCase().split('').join(' - ')}.`,
      }
    }

    case 'read-6': {
      // 5-Letter Challenge
      const pool = WORD_BANK.filter((w) => w.word.length === 5)
      const entry = pool[randomInt(0, pool.length - 1)]
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
      // Sight Words Match
      const target = SIGHT_WORDS[randomInt(0, SIGHT_WORDS.length - 1)]
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
        hint: `Look for the letters ${target.word.toUpperCase().split('').join('-')} to spell "${target.word.toUpperCase()}"!`,
      }
    }

    case 'read-8':
    default: {
      // Sentence Builder (Fill in the blank)
      const entry = WORD_BANK[randomInt(0, WORD_BANK.length - 1)]
      const distractors = shuffle(
        WORD_BANK.filter((w) => w.word !== entry.word && w.word.length === entry.word.length).map(
          (w) => w.word.toUpperCase(),
        ),
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
  }
}

/**
 * Generate a 6-question round for a given node
 */
export function generateNodeQuestions(nodeId, count = 6) {
  const questions = []
  const usedSignatures = new Set()

  for (let i = 0; i < count; i++) {
    let q = generateQuestionForNode(nodeId, i)
    let retries = 0
    while (
      retries < 8 &&
      usedSignatures.has(`${q.expression || ''}-${q.wordData?.word || ''}-${q.answer}`)
    ) {
      q = generateQuestionForNode(nodeId, i)
      retries++
    }
    usedSignatures.add(`${q.expression || ''}-${q.wordData?.word || ''}-${q.answer}`)
    questions.push(q)
  }

  return questions
}

/**
 * Generate a 6-question Daily Practice mix:
 * - 3 questions from her current Math frontier node
 * - 2 questions from her current Reading frontier node
 * - 1 Story / Review question
 */
export function generateDailyPracticeBatch(mathNodeId = 'math-1', readingNodeId = 'read-1') {
  return [
    generateQuestionForNode(mathNodeId, 0),
    generateQuestionForNode(readingNodeId, 1),
    generateQuestionForNode(mathNodeId, 2),
    generateQuestionForNode(readingNodeId, 3),
    generateQuestionForNode(mathNodeId, 4),
    generateQuestionForNode('math-9', 5), // Fun story problem finale
  ]
}
