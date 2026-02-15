// Item definitions with matching emoji icons
const itemDefinitions = [
  { name: 'apples', emoji: '🍎' },
  { name: 'cookies', emoji: '🍪' },
  { name: 'stars', emoji: '⭐' },
  { name: 'flowers', emoji: '🌸' },
  { name: 'butterflies', emoji: '🦋' },
  { name: 'balloons', emoji: '🎈' },
  { name: 'birds', emoji: '🐦' },
  { name: 'fish', emoji: '🐟' },
  { name: 'candies', emoji: '🍬' },
  { name: 'toys', emoji: '🧸' },
  { name: 'dogs', emoji: '🐶' },
  { name: 'cats', emoji: '🐱' },
  { name: 'strawberries', emoji: '🍓' },
  { name: 'cupcakes', emoji: '🧁' },
  { name: 'hearts', emoji: '❤️' },
  { name: 'bunnies', emoji: '🐰' },
  { name: 'ducks', emoji: '🦆' },
  { name: 'frogs', emoji: '🐸' },
]

// Visual items for counting (standalone addition/subtraction)
const visualItems = itemDefinitions.map(item => item.emoji)

// Story problem templates
const storyTemplates = {
  addition: [
    { template: '{name} has {a} {items}. {giver} gives {name} {b} more. How many {items} does {name} have now?', giver: 'Mom' },
    { template: 'There are {a} {items} on the table. {name} puts {b} more. How many {items} are there now?', giver: null },
    { template: '{name} sees {a} {items}. Then {name} finds {b} more. How many {items} did {name} find in total?', giver: null },
    { template: '{name} has {a} {items} in one hand and {b} {items} in the other hand. How many {items} does {name} have?', giver: null },
    { template: 'There are {a} {items} in the garden. {b} more {items} come. How many {items} are in the garden now?', giver: null },
  ],
  subtraction: [
    { template: '{name} has {a} {items}. {name} gives {b} to a friend. How many {items} does {name} have left?', giver: null },
    { template: 'There are {a} {items}. {b} {items} go away. How many {items} are left?', giver: null },
    { template: '{name} has {a} {items}. {name} eats {b} of them. How many {items} are left?', giver: null },
    { template: 'There are {a} {items} on the tree. {b} fall down. How many {items} are still on the tree?', giver: null },
    { template: '{name} sees {a} {items}. {b} {items} hide. How many {items} can {name} still see?', giver: null },
  ]
}

// Kid-friendly names
const names = ['Lily', 'Emma', 'Sam', 'Max', 'Mia', 'Leo', 'Zoe', 'Ben']

// Get max number based on difficulty
function getMaxNumber(difficulty) {
  switch (difficulty) {
    case 1: return 5   // Age 4: 0-5
    case 2: return 10  // Kindergarten: 0-10
    case 3: return 20  // Grade 1-2: 0-20
    default: return 5
  }
}

// Generate random number within range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Shuffle array
function shuffle(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Generate addition question
export function generateAdditionQuestion(difficulty) {
  const max = getMaxNumber(difficulty)
  // Ensure at least one number is >= 1 to avoid 0+0
  const minFirst = 1
  const a = randomInt(minFirst, max)
  // Allow b to be 0 sometimes, but ensure we have meaningful problems
  const maxB = Math.min(max - a, max)
  const b = randomInt(0, maxB)
  const answer = a + b
  
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]
  
  return {
    type: 'addition',
    num1: a,
    num2: b,
    answer,
    expression: `${a} + ${b} = ?`,
    visualItem: item.emoji,
    itemName: item.name,
    inputType: Math.random() > 0.5 ? 'multiple' : 'typing'
  }
}

// Generate subtraction question
export function generateSubtractionQuestion(difficulty) {
  const max = getMaxNumber(difficulty)
  const a = randomInt(2, max) // Start from 2 to have meaningful subtraction
  const b = randomInt(1, a - 1) // Ensure we subtract at least 1 and result > 0
  const answer = a - b
  
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]
  
  return {
    type: 'subtraction',
    num1: a,
    num2: b,
    answer,
    expression: `${a} - ${b} = ?`,
    visualItem: item.emoji,
    itemName: item.name,
    inputType: Math.random() > 0.5 ? 'multiple' : 'typing'
  }
}

// Generate story problem
export function generateStoryProblem(difficulty) {
  const isAddition = Math.random() > 0.5
  const max = getMaxNumber(difficulty)
  
  let a, b, answer
  
  if (isAddition) {
    // Ensure meaningful numbers (at least 1 each)
    const halfMax = Math.max(2, Math.floor(max / 2))
    a = randomInt(1, halfMax)
    b = randomInt(1, halfMax)
    answer = a + b
  } else {
    a = randomInt(3, max) // Start higher for subtraction
    b = randomInt(1, a - 1)
    answer = a - b
  }
  
  const templates = isAddition ? storyTemplates.addition : storyTemplates.subtraction
  const template = templates[randomInt(0, templates.length - 1)]
  const name = names[randomInt(0, names.length - 1)]
  
  // Pick an item and use its matching emoji
  const item = itemDefinitions[randomInt(0, itemDefinitions.length - 1)]
  
  const story = template.template
    .replace(/{name}/g, name)
    .replace(/{a}/g, a)
    .replace(/{b}/g, b)
    .replace(/{items}/g, item.name)
    .replace(/{giver}/g, template.giver || '')
  
  return {
    type: 'story',
    operation: isAddition ? 'addition' : 'subtraction',
    num1: a,
    num2: b,
    answer,
    story,
    items: item.name,
    visualItem: item.emoji, // Now matches the story item!
    itemName: item.name,
    inputType: Math.random() > 0.5 ? 'multiple' : 'typing'
  }
}

// Generate multiple choice options
export function generateChoices(correctAnswer, difficulty) {
  const max = getMaxNumber(difficulty)
  const choices = new Set([correctAnswer])
  
  // Generate wrong answers close to the correct one
  while (choices.size < 4) {
    let wrongAnswer
    const offset = randomInt(1, 3)
    
    if (Math.random() > 0.5 && correctAnswer + offset <= max) {
      wrongAnswer = correctAnswer + offset
    } else if (correctAnswer - offset >= 0) {
      wrongAnswer = correctAnswer - offset
    } else {
      wrongAnswer = correctAnswer + offset
    }
    
    if (wrongAnswer >= 0 && wrongAnswer <= max) {
      choices.add(wrongAnswer)
    }
  }
  
  return shuffle([...choices])
}

// Generate a batch of questions
export function generateQuestionBatch(type, difficulty, count = 10) {
  const questions = []
  
  for (let i = 0; i < count; i++) {
    let question
    
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
    
    questions.push({
      ...question,
      id: i + 1,
      choices: generateChoices(question.answer, difficulty)
    })
  }
  
  return questions
}
