<template>
  <div class="result-container fade-in">
    <div class="result-card">
      <div class="result-header">
        <div class="result-icon">{{ lives > 0 ? '🎉' : '💔' }}</div>
        <h2 class="result-title">{{ lives > 0 ? '闯关成功！' : '游戏结束' }}</h2>
      </div>

      <div class="score-section">
        <div class="score-item main-score">
          <span class="score-label">最终得分</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="score-details">
          <div class="score-item">
            <span class="score-label">最高连击</span>
            <span class="score-value">{{ maxCombo }}🔥</span>
          </div>
          <div class="score-item">
            <span class="score-label">答对题数</span>
            <span class="score-value">{{ questions.length - wrongAnswers.length }} / {{ questions.length }}</span>
          </div>
        </div>
      </div>

      <div v-if="isNewHighScore" class="new-record">
        🏆 新纪录！
      </div>

      <div v-if="wrongAnswers.length > 0" class="wrong-answers-section">
        <h3>❌ 错题回顾</h3>
        <div class="wrong-answers-list">
          <div
            v-for="(item, index) in wrongAnswers"
            :key="item.questionId"
            class="wrong-item"
          >
            <div class="wrong-question">
              <span class="wrong-number">{{ index + 1 }}.</span>
              <span class="wrong-text">{{ item.question }}</span>
            </div>
            <div class="wrong-options">
              <p class="wrong-answer">
                你的答案：<span class="wrong-label">{{ item.userAnswer >= 0 ? item.options[item.userAnswer] : '超时未答' }}</span>
              </p>
              <p class="correct-answer">
                正确答案：<span class="correct-label">{{ item.options[item.correctAnswer] }}</span>
              </p>
            </div>
            <p class="wrong-explanation">{{ item.explanation }}</p>
          </div>
        </div>
      </div>

      <div v-else class="perfect-score">
        💯 全部答对，太厉害了！
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="playAgain">
          再玩一次
        </button>
        <button class="btn btn-secondary" @click="goHome">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuizStore } from '../stores/quiz'
import { getHighScore, getMaxComboRecord } from '../utils/session'

const store = useQuizStore()
const { score, maxCombo, lives, questions, wrongAnswers } = storeToRefs(store)

const isNewHighScore = computed(() => {
  return score.value > 0 && score.value >= getHighScore()
})

function playAgain() {
  store.startGame()
}

function goHome() {
  store.resetGame()
}

onMounted(() => {
  getMaxComboRecord()
})
</script>

<style scoped>
.result-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

.result-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.result-header {
  text-align: center;
  margin-bottom: 25px;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.result-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.score-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
}

.main-score {
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.main-score .score-value {
  font-size: 42px !important;
}

.score-details {
  display: flex;
  gap: 20px;
}

.score-item {
  flex: 1;
  text-align: center;
}

.score-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.score-value {
  font-size: 20px;
  font-weight: 700;
}

.new-record {
  text-align: center;
  background: linear-gradient(135deg, #feca57 0%, #ff9f43 100%);
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 20px;
  animation: pulse 0.5s ease-out;
}

.wrong-answers-section {
  margin-bottom: 25px;
}

.wrong-answers-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.wrong-answers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrong-item {
  background: #fafafa;
  border-radius: 10px;
  padding: 12px;
  border-left: 4px solid #f44336;
}

.wrong-question {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.wrong-number {
  font-weight: 600;
  color: #f44336;
}

.wrong-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.wrong-options {
  margin-bottom: 8px;
}

.wrong-answer,
.correct-answer {
  font-size: 12px;
  margin: 2px 0;
}

.wrong-label {
  color: #f44336;
  font-weight: 500;
}

.correct-label {
  color: #4caf50;
  font-weight: 500;
}

.wrong-explanation {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}

.perfect-score {
  text-align: center;
  padding: 20px;
  background: #e8f5e9;
  border-radius: 12px;
  color: #2e7d32;
  font-weight: 500;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
