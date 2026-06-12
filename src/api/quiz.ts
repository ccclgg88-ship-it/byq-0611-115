import type { QuizBank, Question, WrongAnswerRecord } from '../types'

const API_BASE = '/api/quiz'

export async function fetchQuizBank(): Promise<QuizBank> {
  const res = await fetch(`${API_BASE}/bank`)
  if (!res.ok) {
    throw new Error('Failed to load quiz bank')
  }
  return res.json()
}

export async function submitWrongAnswer(
  sessionId: string,
  record: WrongAnswerRecord
): Promise<{ success: boolean; deduplicated: boolean }> {
  const res = await fetch(`${API_BASE}/wrong-book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessionId,
      questionId: record.questionId,
      question: record.question,
      userAnswer: record.userAnswer,
      correctAnswer: record.correctAnswer
    })
  })
  if (!res.ok) {
    throw new Error('Failed to submit wrong answer')
  }
  return res.json()
}

export function flattenQuizBank(bank: QuizBank): Question[] {
  return Object.values(bank).flat()
}

export function getCategoryName(key: string): string {
  const names: Record<string, string> = {
    health: '健康',
    legal: '法律常识',
    firstaid: '急救',
    finance: '理财'
  }
  return names[key] || key
}
