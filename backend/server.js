const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

const DATA_DIR = path.join(__dirname, 'data')
const WRONG_BOOK_PATH = path.join(DATA_DIR, 'wrong-book.json')

function readWrongBook() {
  try {
    if (!fs.existsSync(WRONG_BOOK_PATH)) {
      return { entries: [] }
    }
    return JSON.parse(fs.readFileSync(WRONG_BOOK_PATH, 'utf-8'))
  } catch (err) {
    return { entries: [] }
  }
}

function writeWrongBook(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(WRONG_BOOK_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

app.get('/api/quiz/bank', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'quiz-bank.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load quiz bank' })
  }
})

app.post('/api/quiz/wrong-book', (req, res) => {
  const { sessionId, questionId, question, userAnswer, correctAnswer, category, options, explanation } = req.body

  if (!sessionId || !questionId) {
    return res.status(400).json({ error: 'sessionId and questionId are required' })
  }

  const book = readWrongBook()
  const existing = book.entries.find(e => e.questionId === questionId)

  if (existing) {
    existing.errorCount += 1
    existing.userAnswer = userAnswer
    existing.lastWrongAt = Date.now()
    existing.mastered = false
    writeWrongBook(book)
    return res.json({ success: true, deduplicated: false, accumulated: true, errorCount: existing.errorCount })
  }

  book.entries.push({
    questionId,
    category: category || 'unknown',
    question: question || '',
    options: options || [],
    correctAnswer: correctAnswer !== undefined ? correctAnswer : -1,
    userAnswer: userAnswer !== undefined ? userAnswer : -1,
    explanation: explanation || '',
    errorCount: 1,
    mastered: false,
    lastWrongAt: Date.now(),
    createdAt: Date.now()
  })

  writeWrongBook(book)
  res.json({ success: true, deduplicated: false, accumulated: false, errorCount: 1 })
})

app.get('/api/quiz/wrong-book', (req, res) => {
  const book = readWrongBook()
  let entries = book.entries

  if (req.query.category) {
    entries = entries.filter(e => e.category === req.query.category)
  }
  if (req.query.mastered === 'true') {
    entries = entries.filter(e => e.mastered === true)
  } else if (req.query.mastered === 'false') {
    entries = entries.filter(e => e.mastered === false)
  }

  entries.sort((a, b) => (b.lastWrongAt || 0) - (a.lastWrongAt || 0))
  res.json({ entries, total: book.entries.length })
})

app.patch('/api/quiz/wrong-book/:questionId/mastered', (req, res) => {
  const { questionId } = req.params
  const { mastered } = req.body

  const book = readWrongBook()
  const entry = book.entries.find(e => e.questionId === questionId)

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' })
  }

  entry.mastered = mastered !== undefined ? mastered : !entry.mastered
  writeWrongBook(book)
  res.json({ success: true, mastered: entry.mastered })
})

app.delete('/api/quiz/wrong-book/:questionId', (req, res) => {
  const { questionId } = req.params
  const book = readWrongBook()
  const index = book.entries.findIndex(e => e.questionId === questionId)

  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' })
  }

  book.entries.splice(index, 1)
  writeWrongBook(book)
  res.json({ success: true })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
