export const calculateSensitivity = (dpi: number, eDPI: number): number => {
  return eDPI / dpi
}

export const calculateEDPI = (dpi: number, sensitivity: number): number => {
  return dpi * sensitivity
}

export const formatSensitivity = (sensitivity: number): string => {
  return sensitivity.toFixed(3)
}

export const formatEDPI = (eDPI: number): string => {
  return Math.round(eDPI).toString()
}

export const clampSensitivity = (sensitivity: number): number => {
  return Math.max(0.1, Math.min(2.0, sensitivity))
}

export const clampDPI = (dpi: number): number => {
  return Math.max(100, Math.min(10000, dpi))
}

export const getRecommendedSensitivity = (dpi: number): number => {
  // Based on 320 eDPI as the recommended baseline
  const targetEDPI = 320
  return targetEDPI / dpi
}

export const getSensitivityCategory = (eDPI: number, gameMode: 'valorant' | 'cs' = 'valorant'): string => {
  if (gameMode === 'cs') {
    // CS2 categories based on 600-1200 eDPI pro range (avg 850)
    if (eDPI < 600) return 'Very Low'
    if (eDPI < 750) return 'Low'
    if (eDPI < 950) return 'Medium'
    if (eDPI < 1200) return 'High'
    return 'Very High'
  } else {
    // Valorant categories based on 200-400 eDPI pro range (avg 320)
    if (eDPI < 200) return 'Very Low'
    if (eDPI < 300) return 'Low'
    if (eDPI < 400) return 'Medium'
    if (eDPI < 600) return 'High'
    return 'Very High'
  }
}