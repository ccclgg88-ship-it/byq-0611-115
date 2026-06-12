export interface Question {
  id: string
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hintArticleUrl: string
}

export type QuizBank = Record<string, Question[]>

export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'

export type LifelineType = 'fiftyFifty' | 'hint'

export interface WrongAnswerRecord {
  questionId: string
  question: string
  userAnswer: number
  correctAnswer: number
  options: string[]
  explanation: string
  category?: string
}

export interface WrongBookEntry {
  questionId: string
  category: string
  question: string
  options: string[]
  correctAnswer: number
  userAnswer: number
  explanation: string
  errorCount: number
  mastered: boolean
  lastWrongAt: number
  createdAt: number
}

export type WrongBookFilter = 'all' | 'unmastered' | 'mastered'

export interface GameState {
  status: GameStatus
  questions: Question[]
  currentIndex: number
  score: number
  combo: number
  maxCombo: number
  lives: number
  timeLeft: number
  lifelines: Record<LifelineType, boolean>
  hiddenOptions: number[]
  hintVisible: boolean
  wrongAnswers: WrongAnswerRecord[]
  reportedQuestionIds: Set<string>
  sessionId: string
  answered: boolean
  lastAnswerCorrect: boolean | null
}

export interface ScoreResult {
  score: number
  combo: number
  correct: boolean
}
