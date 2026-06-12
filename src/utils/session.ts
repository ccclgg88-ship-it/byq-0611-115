export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

const HIGH_SCORE_KEY = 'life_quiz_high_score'
const MAX_COMBO_KEY = 'life_quiz_max_combo'

export function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

export function setHighScore(score: number): void {
  const current = getHighScore()
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  }
}

export function getMaxComboRecord(): number {
  const stored = localStorage.getItem(MAX_COMBO_KEY)
  return stored ? parseInt(stored, 10) : 0
}

export function setMaxComboRecord(combo: number): void {
  const current = getMaxComboRecord()
  if (combo > current) {
    localStorage.setItem(MAX_COMBO_KEY, String(combo))
  }
}
