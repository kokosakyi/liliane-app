import countriesData from '../assets/countries.json'

// Get all countries with valid capitals (for quizzes)
export const getQuizCountries = () => {
  return countriesData.filter(country => country.capital && country.capital.trim() !== '')
}

// Get all countries
export const getAllCountries = () => {
  return countriesData
}

// Get unique continents
export const getContinents = () => {
  const continents = [...new Set(countriesData.map(c => c.continent))]
  return continents.sort()
}

// Filter countries by continent
export const getCountriesByContinent = (continent) => {
  if (!continent || continent === 'All') {
    return countriesData
  }
  return countriesData.filter(country => country.continent === continent)
}

// Get quiz-eligible countries by continent (must have capital)
export const getQuizCountriesByContinent = (continent) => {
  const countries = getCountriesByContinent(continent)
  return countries.filter(country => country.capital && country.capital.trim() !== '')
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

// Generate a flag quiz question (show flag, pick country name)
export const generateFlagToNameQuestion = (countries, correctCountry) => {
  // Get 3 random wrong answers from the same pool
  const wrongAnswers = shuffleArray(
    countries.filter(c => c.name !== correctCountry.name)
  ).slice(0, 3)

  // Create choices array with correct answer and wrong answers
  const choices = shuffleArray([
    { text: correctCountry.name, isCorrect: true },
    ...wrongAnswers.map(c => ({ text: c.name, isCorrect: false }))
  ])

  return {
    type: 'flagToName',
    flag: correctCountry.flag,
    correctAnswer: correctCountry.name,
    country: correctCountry,
    choices
  }
}

// Generate a name to flag quiz question (show country name, pick flag)
export const generateNameToFlagQuestion = (countries, correctCountry) => {
  // Get 3 random wrong answers from the same pool
  const wrongAnswers = shuffleArray(
    countries.filter(c => c.name !== correctCountry.name)
  ).slice(0, 3)

  // Create choices array with correct answer and wrong answers
  const choices = shuffleArray([
    { flag: correctCountry.flag, name: correctCountry.name, isCorrect: true },
    ...wrongAnswers.map(c => ({ flag: c.flag, name: c.name, isCorrect: false }))
  ])

  return {
    type: 'nameToFlag',
    countryName: correctCountry.name,
    correctAnswer: correctCountry.flag,
    country: correctCountry,
    choices
  }
}

// Generate a capital quiz question (show country, pick capital)
export const generateCapitalQuestion = (countries, correctCountry) => {
  // Get 3 random wrong answers from the same pool
  const wrongAnswers = shuffleArray(
    countries.filter(c => c.name !== correctCountry.name && c.capital)
  ).slice(0, 3)

  // Create choices array with correct answer and wrong answers
  const choices = shuffleArray([
    { text: correctCountry.capital, isCorrect: true },
    ...wrongAnswers.map(c => ({ text: c.capital, isCorrect: false }))
  ])

  return {
    type: 'capital',
    countryName: correctCountry.name,
    flag: correctCountry.flag,
    correctAnswer: correctCountry.capital,
    country: correctCountry,
    choices
  }
}

// Generate a batch of quiz questions
export const generateQuizBatch = (quizType, continent, count = 10) => {
  const countries = getQuizCountriesByContinent(continent)
  
  if (countries.length < 4) {
    // Not enough countries for a quiz
    return []
  }

  // Select random countries for questions (up to count, or all available)
  const questionCountries = shuffleArray(countries).slice(0, Math.min(count, countries.length))

  return questionCountries.map(country => {
    switch (quizType) {
      case 'flagToName':
        return generateFlagToNameQuestion(countries, country)
      case 'nameToFlag':
        return generateNameToFlagQuestion(countries, country)
      case 'capital':
        return generateCapitalQuestion(countries, country)
      default:
        return generateFlagToNameQuestion(countries, country)
    }
  })
}

// Get count of countries by continent
export const getCountryCountByContinent = () => {
  const counts = {}
  countriesData.forEach(country => {
    counts[country.continent] = (counts[country.continent] || 0) + 1
  })
  return counts
}
