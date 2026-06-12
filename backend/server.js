const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

const wrongBook = new Map()

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
  const { sessionId, questionId, question, userAnswer, correctAnswer } = req.body

  if (!sessionId || !questionId) {
    return res.status(400).json({ error: 'sessionId and questionId are required' })
  }

  const key = `${sessionId}:${questionId}`
  if (wrongBook.has(key)) {
    return res.json({ success: true, deduplicated: true })
  }

  wrongBook.set(key, {
    sessionId,
    questionId,
    question,
    userAnswer,
    correctAnswer,
    timestamp: Date.now()
  })

  res.json({ success: true, deduplicated: false })
})

app.get('/api/quiz/wrong-book/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const records = Array.from(wrongBook.values())
    .filter(r => r.sessionId === sessionId)
  res.json(records)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
