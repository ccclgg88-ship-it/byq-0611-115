import type { Question } from '../types'

export function applyFiftyFifty(question: Question): number[] {
  const correctIndex = question.correctAnswer
  const wrongIndices = question.options
    .map((_, i) => i)
    .filter(i => i !== correctIndex)

  const randomWrongIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
  const keptIndices = [correctIndex, randomWrongIndex].sort((a, b) => a - b)

  return question.options
    .map((_, i) => i)
    .filter(i => !keptIndices.includes(i))
}
