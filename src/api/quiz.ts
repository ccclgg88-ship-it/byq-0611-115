import type { QuizBank, Question, WrongAnswerRecord, WrongBookEntry } from '../types'

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
): Promise<{ success: boolean; deduplicated: boolean; accumulated?: boolean; errorCount?: number }> {
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
      correctAnswer: record.correctAnswer,
      category: record.category,
      options: record.options,
      explanation: record.explanation
    })
  })
  if (!res.ok) {
    throw new Error('Failed to submit wrong answer')
  }
  return res.json()
}

export async function fetchWrongBook(params?: {
  category?: string
  mastered?: boolean
}): Promise<{ entries: WrongBookEntry[]; total: number }> {
  const query = new URLSearchParams()
  if (params?.category) {
    query.set('category', params.category)
  }
  if (params?.mastered !== undefined) {
    query.set('mastered', String(params.mastered))
  }
  const qs = query.toString()
  const url = `${API_BASE}/wrong-book${qs ? '?' + qs : ''}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch wrong book')
  }
  return res.json()
}

export async function toggleMastered(
  questionId: string,
  mastered: boolean
): Promise<{ success: boolean; mastered: boolean }> {
  const res = await fetch(`${API_BASE}/wrong-book/${encodeURIComponent(questionId)}/mastered`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mastered })
  })
  if (!res.ok) {
    throw new Error('Failed to toggle mastered')
  }
  return res.json()
}

export async function deleteWrongBookEntry(
  questionId: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/wrong-book/${encodeURIComponent(questionId)}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    throw new Error('Failed to delete wrong book entry')
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
