const BASE_SCORE = 100
const COMBO_BONUS = 10

export function calculateScore(combo: number, correct: boolean): {
  score: number
  newCombo: number
} {
  if (!correct) {
    return { score: 0, newCombo: 0 }
  }
  const scoreGained = BASE_SCORE + combo * COMBO_BONUS
  const newCombo = combo + 1
  return { score: scoreGained, newCombo }
}

export function formatComboDisplay(combo: number): string {
  if (combo >= 99) {
    return '99+'
  }
  return String(combo)
}

export function getMaxCombo(currentMax: number, currentCombo: number): number {
  return Math.max(currentMax, currentCombo)
}
