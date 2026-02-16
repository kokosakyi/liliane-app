// Import all flag SVGs using Vite's glob import
const flagModules = import.meta.glob('../assets/flags/*.svg', { eager: true, as: 'url' })

// Create a map of flag filename to URL
const flagMap = {}
for (const path in flagModules) {
  // Extract filename from path (e.g., '../assets/flags/us.svg' -> 'us.svg')
  const filename = path.split('/').pop()
  flagMap[`flags/${filename}`] = flagModules[path]
}

// Get flag URL by flag path (e.g., 'flags/us.svg')
export const getFlagUrl = (flagPath) => {
  return flagMap[flagPath] || ''
}

export default flagMap
