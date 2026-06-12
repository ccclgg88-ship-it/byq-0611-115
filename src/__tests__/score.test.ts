import { describe, it, expect } from 'vitest'
import { calculateScore, formatComboDisplay, getMaxCombo } from '../utils/score'

describe('calculateScore', () => {
  it('returns base score + combo bonus for correct answer', () => {
    const result = calculateScore(3, true)
    expect(result.score).toBe(130)
    expect(result.newCombo).toBe(4)
  })

  it('returns 0 score and resets combo for wrong answer', () => {
    const result = calculateScore(5, false)
    expect(result.score).toBe(0)
    expect(result.newCombo).toBe(0)
  })

  it('returns base score 100 for first correct answer (combo 0)', () => {
    const result = calculateScore(0, true)
    expect(result.score).toBe(100)
    expect(result.newCombo).toBe(1)
  })

  it('accumulates combo bonus correctly at high combo', () => {
    const result = calculateScore(10, true)
    expect(result.score).toBe(200)
    expect(result.newCombo).toBe(11)
  })

  it('always resets combo to 0 on wrong regardless of current combo', () => {
    const result = calculateScore(99, false)
    expect(result.score).toBe(0)
    expect(result.newCombo).toBe(0)
  })
})

describe('formatComboDisplay', () => {
  it('shows number as string for combos below 99', () => {
    expect(formatComboDisplay(0)).toBe('0')
    expect(formatComboDisplay(5)).toBe('5')
    expect(formatComboDisplay(98)).toBe('98')
  })

  it('shows 99+ for combo at or above 99', () => {
    expect(formatComboDisplay(99)).toBe('99+')
    expect(formatComboDisplay(150)).toBe('99+')
  })
})

describe('getMaxCombo', () => {
  it('returns current combo if larger than stored max', () => {
    expect(getMaxCombo(3, 7)).toBe(7)
  })

  it('returns stored max if larger than current combo', () => {
    expect(getMaxCombo(10, 5)).toBe(10)
  })

  it('returns either when equal', () => {
    expect(getMaxCombo(5, 5)).toBe(5)
  })
})
