import dinosaursData from '../assets/dinosaurs.json'

// Get all dinosaurs
export const getAllDinosaurs = () => {
  return dinosaursData
}

// Get unique dinosaur categories in display order
export const getDinosaurCategories = () => {
  return ['Plant-Eaters', 'Meat-Eaters', 'Crested, Sky & Sea']
}

// Filter dinosaurs by category
export const getDinosaursByCategory = (category) => {
  if (!category || category === 'All') {
    return dinosaursData
  }
  return dinosaursData.filter((dino) => dino.category === category)
}

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate an image-to-name quiz question (show dinosaur picture, pick name)
export const generateImageToNameQuestion = (dinosaurs, correctDino) => {
  const wrongAnswers = shuffleArray(
    dinosaurs.filter((d) => d.id !== correctDino.id),
  ).slice(0, 3)

  const choices = shuffleArray([
    { text: correctDino.name, isCorrect: true },
    ...wrongAnswers.map((d) => ({ text: d.name, isCorrect: false })),
  ])

  return {
    type: 'imageToName',
    image: correctDino.image,
    correctAnswer: correctDino.name,
    dinosaur: correctDino,
    choices,
  }
}

// Generate a name-to-image quiz question (show dinosaur name, pick picture)
export const generateNameToImageQuestion = (dinosaurs, correctDino) => {
  const wrongAnswers = shuffleArray(
    dinosaurs.filter((d) => d.id !== correctDino.id),
  ).slice(0, 3)

  const choices = shuffleArray([
    {
      image: correctDino.image,
      name: correctDino.name,
      isCorrect: true,
    },
    ...wrongAnswers.map((d) => ({
      image: d.image,
      name: d.name,
      isCorrect: false,
    })),
  ])

  return {
    type: 'nameToImage',
    dinosaurName: correctDino.name,
    pronunciation: correctDino.pronunciation,
    meaning: correctDino.meaning,
    correctAnswer: correctDino.name,
    dinosaur: correctDino,
    choices,
  }
}

// Generate a detective clue / feature quiz question (show clue & meaning, pick dinosaur)
export const generateFeatureToNameQuestion = (dinosaurs, correctDino) => {
  const wrongAnswers = shuffleArray(
    dinosaurs.filter((d) => d.id !== correctDino.id),
  ).slice(0, 3)

  const choices = shuffleArray([
    { text: correctDino.name, isCorrect: true },
    ...wrongAnswers.map((d) => ({ text: d.name, isCorrect: false })),
  ])

  return {
    type: 'featureToName',
    image: correctDino.image,
    meaning: correctDino.meaning,
    feature: correctDino.feature,
    diet: correctDino.diet,
    correctAnswer: correctDino.name,
    dinosaur: correctDino,
    choices,
  }
}

// Generate a batch of dinosaur quiz questions
export const generateDinoQuizBatch = (quizType, category, count = 8) => {
  const pool = getDinosaursByCategory(category)

  if (pool.length < 4) {
    return []
  }

  const questionDinos = shuffleArray(pool).slice(0, Math.min(count, pool.length))

  return questionDinos.map((dino) => {
    switch (quizType) {
      case 'imageToName':
        return generateImageToNameQuestion(pool, dino)
      case 'nameToImage':
        return generateNameToImageQuestion(pool, dino)
      case 'featureToName':
        return generateFeatureToNameQuestion(pool, dino)
      default:
        return generateImageToNameQuestion(pool, dino)
    }
  })
}
