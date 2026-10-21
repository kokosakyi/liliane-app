import {
  generateSmartMathChoices,
  hasSeenRecently,
  randomInt,
  recordSeenSignature,
  shuffle,
} from './randomEngine'

// Item definitions with matching emoji icons & scene categories
export const itemDefinitions = [
  { name: 'apples', emoji: '🍎', scene: '/assets/nano/scene-nature.png' },
  { name: 'cookies', emoji: '🍪', scene: '/assets/nano/world-tier2-treehouse.png' },
  { name: 'stars', emoji: '⭐', scene: '/assets/nano/scene-space.png' },
  { name: 'flowers', emoji: '🌸', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'butterflies', emoji: '🦋', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'balloons', emoji: '🎈', scene: '/assets/nano/world-tier2-treehouse.png' },
  { name: 'birds', emoji: '🐦', scene: '/assets/nano/scene-nature.png' },
  { name: 'fish', emoji: '🐟', scene: '/assets/nano/scene-ocean.png' },
  { name: 'candies', emoji: '🍬', scene: '/assets/nano/world-tier2-treehouse.png' },
  { name: 'toys', emoji: '🧸', scene: '/assets/nano/world-tier2-treehouse.png' },
  { name: 'puppies', emoji: '🐶', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'kittens', emoji: '🐱', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'strawberries', emoji: '🍓', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'cupcakes', emoji: '🧁', scene: '/assets/nano/world-tier2-treehouse.png' },
  { name: 'sea shells', emoji: '🐚', scene: '/assets/nano/scene-ocean.png' },
  { name: 'bunnies', emoji: '🐰', scene: '/assets/nano/world-tier1-meadow.png' },
  { name: 'ducks', emoji: '🦆', scene: '/assets/nano/world-tier3-island.png' },
  { name: 'frogs', emoji: '🐸', scene: '/assets/nano/scene-nature.png' },
  { name: 'dinosaur eggs', emoji: '🦕', scene: '/assets/nano/scene-dino.png' },
  { name: 'rockets', emoji: '🚀', scene: '/assets/nano/scene-space.png' },
  { name: 'crystals', emoji: '💎', scene: '/assets/nano/world-tier3-island.png' },
  { name: 'sea turtles', emoji: '🐢', scene: '/assets/nano/scene-ocean.png' },
]

const storyTemplates = {
  addition: [
    { template: '{name} has {a} {items}. {giver} gives {name} {b} more. How many {items} does {name} have now?', giver: 'Mom' },
    { template: 'There are {a} {items} on the table. {name} puts {b} more. How many {items} are there in all?', giver: null },
    { template: '{name} spots {a} {items} in the morning and {b} more in the afternoon. How many {items} did {name} see altogether?', giver: null },
    { template: '{name} has {a} {items} in one basket and {b} {items} in another basket. What is the total number of {items}?', giver: null },
    { template: 'There are {a} {items} in the garden. {b} more {items} join them. How many {items} are in the garden now?', giver: null },
    { template: 'During an expedition, {name} collected {a} {items} on Monday and {b} {items} on Tuesday. How many {items} did {name} collect?', giver: null },
    { template: '{giver} baked {a} {items} first, and then baked {b} more for the party. How many {items} were baked in total?', giver: 'Grandma' },
  ],
  subtraction: [
    { template: '{name} has {a} {items}. {name} shares {b} with a friend. How many {items} does {name} have left?', giver: null },
    { template: 'There are {a} {items}. {b} {items} go away. How many {items} remain?', giver: null },
    { template: '{name} started with {a} {items} and used {b} of them. How many {items} are left over?', giver: null },
    { template: 'There are {a} {items} on the branch. {b} hop down. How many {items} are still on the branch?', giver: null },
    { template: '{name} counted {a} {items}, but {b} {items} hid behind a rock. How many can {name} still see?', giver: null },
    { template: 'A treasure chest had {a} {items}. {name} took out {b} {items}. How many {items} are still inside the chest?', giver: null },
  ],
  multiStep: [
    {
      template: '{name} had {a} {items}, found {b} more, and then gave {c} to a friend. How many {items} does {name} have now?',
      compute: (a, b, c) => a + b - c,
    },
    {
      template: 'There are {a} boxes with {b} {items} in each box, plus {c} extra {items} on the shelf. How many {items} are there in all?',
      compute: (a, b, c) => a * b + c,
    },
  ],
}

const names = ['Liliane', 'Emma', 'Sam', 'Max', 'Mia', 'Leo', 'Zoe', 'Noah', 'Maya', 'Lucas']

export function getMaxNumber(difficulty) {
  switch (difficulty) {
    case 1:
      return 5 // Tier 1: Pre-K (0-5)
    case 2:
      return 10 // Tier 2: Kindergarten (0-10)
    case 3:
      return 50 // Tier 3: Grades 1-2 (0-50)
    case 4:
      return 100 // Tier 4: Grades 3-4 (0-100)
    default:
      return 10
  }
}

export function generateAdditionQuestion(difficulty) {
  const max = getMaxNumber(difficulty)
  const minFirst = difficulty >= 3 ? 8 : 1
  const a = randomInt(minFirst, Math.floor(max * 0.65))
  const b = randomInt(difficulty >= 3 ? 5 : 1, max - a)
  const answer = a + b
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]

  // Vary the question angle on higher difficulties
  const useMissingAngle = difficulty >= 3 && Math.random() < 0.3
  const expression = useMissingAngle ? `${a} + ? = ${answer}` : `${a} + ${b} = ?`
  const expectedAnswer = useMissingAngle ? b : answer

  return {
    type: 'addition',
    num1: a,
    num2: b,
    answer: expectedAnswer,
    expression,
    visualItem: item.emoji,
    sceneImage: item.scene,
    itemName: item.name,
    inputType: 'multiple',
  }
}

export function generateSubtractionQuestion(difficulty) {
  const max = getMaxNumber(difficulty)
  const a = randomInt(difficulty >= 3 ? 15 : 2, max)
  const b = randomInt(difficulty >= 3 ? 4 : 1, a - 1)
  const answer = a - b
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]

  const useMissingAngle = difficulty >= 3 && Math.random() < 0.25
  const expression = useMissingAngle ? `${a} - ? = ${answer}` : `${a} - ${b} = ?`
  const expectedAnswer = useMissingAngle ? b : answer

  return {
    type: 'subtraction',
    num1: a,
    num2: b,
    answer: expectedAnswer,
    expression,
    visualItem: item.emoji,
    sceneImage: item.scene,
    itemName: item.name,
    inputType: 'multiple',
  }
}

export function generateStoryProblem(difficulty) {
  const max = getMaxNumber(difficulty)
  const name = names[randomInt(0, names.length - 1)]
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]

  // Tier 4 multi-step story option
  if (difficulty >= 4 && Math.random() < 0.45) {
    const isMult = Math.random() < 0.5
    const tpl = storyTemplates.multiStep[isMult ? 1 : 0]
    const a = isMult ? randomInt(2, 6) : randomInt(12, 30)
    const b = isMult ? randomInt(3, 8) : randomInt(8, 20)
    const c = isMult ? randomInt(2, 9) : randomInt(5, a + b - 5)
    const answer = tpl.compute(a, b, c)
    const story = tpl.template
      .replace(/{name}/g, name)
      .replace(/{a}/g, a)
      .replace(/{b}/g, b)
      .replace(/{c}/g, c)
      .replace(/{items}/g, item.name)

    return {
      type: 'story',
      operation: 'addition',
      num1: a,
      num2: b,
      answer,
      story,
      items: item.name,
      visualItem: item.emoji,
      sceneImage: item.scene,
      itemName: item.name,
      inputType: 'multiple',
    }
  }

  const isAddition = Math.random() > 0.5
  let a, b, answer

  if (isAddition) {
    const halfMax = Math.max(2, Math.floor(max / 2))
    a = randomInt(difficulty >= 3 ? 6 : 1, halfMax)
    b = randomInt(difficulty >= 3 ? 5 : 1, halfMax)
    answer = a + b
  } else {
    a = randomInt(difficulty >= 3 ? 14 : 3, max)
    b = randomInt(difficulty >= 3 ? 4 : 1, a - 1)
    answer = a - b
  }

  const templates = isAddition ? storyTemplates.addition : storyTemplates.subtraction
  const template = templates[randomInt(0, templates.length - 1)]

  const story = template.template
    .replace(/{name}/g, name)
    .replace(/{a}/g, a)
    .replace(/{b}/g, b)
    .replace(/{items}/g, item.name)
    .replace(/{giver}/g, template.giver || 'Mom')

  return {
    type: 'story',
    operation: isAddition ? 'addition' : 'subtraction',
    num1: a,
    num2: b,
    answer,
    story,
    items: item.name,
    visualItem: item.emoji,
    sceneImage: item.scene,
    itemName: item.name,
    inputType: 'multiple',
  }
}

export function generateChoices(correctAnswer, difficulty) {
  const max = Math.max(getMaxNumber(difficulty), correctAnswer + 10)
  return generateSmartMathChoices(correctAnswer, { min: 0, max })
}

export function generateQuestionBatch(type, difficulty, count = 10) {
  const questions = []
  const roundSignatures = new Set()

  for (let i = 0; i < count; i++) {
    let question
    let attempts = 0
    let sig = ''

    do {
      attempts++
      switch (type) {
        case 'addition':
          question = generateAdditionQuestion(difficulty)
          break
        case 'subtraction':
          question = generateSubtractionQuestion(difficulty)
          break
        case 'story':
          question = generateStoryProblem(difficulty)
          break
        default:
          question = generateAdditionQuestion(difficulty)
      }
      sig = `${question.type}-${question.expression || question.story}-${question.answer}`
    } while (
      attempts < 15 &&
      (roundSignatures.has(sig) || hasSeenRecently(sig, 'freeplay'))
    )

    roundSignatures.add(sig)
    recordSeenSignature(sig, 'freeplay')

    questions.push({
      ...question,
      id: i + 1,
      choices: generateChoices(question.answer, difficulty),
    })
  }

  return questions
}
