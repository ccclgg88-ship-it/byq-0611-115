export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickRandomQuestions<T>(array: T[], count: number): T[] {
  if (array.length < count) {
    throw new Error(`Not enough questions: need ${count}, have ${array.length}`)
  }
  return fisherYatesShuffle(array).slice(0, count)
}
