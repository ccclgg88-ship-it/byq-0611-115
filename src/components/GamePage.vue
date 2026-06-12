<template>
  <div class="game-container">
    <div class="game-header">
      <div class="header-left">
        <div class="score-display">
          <span class="score-label">分数</span>
          <span class="score-value">{{ score }}</span>
        </div>
      </div>
      <div class="header-center">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="question-count">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>
      <div class="header-right">
        <div class="lives-display">
          <span
            v-for="i in 3"
            :key="i"
            class="heart"
            :class="{ 'heart-lost': i > lives }"
          >
            {{ i <= lives ? '❤️' : '🖤' }}
          </span>
        </div>
      </div>
    </div>

    <div class="combo-display" v-if="combo > 0">
      <span class="combo-badge pulse">🔥 {{ comboDisplay }} 连击!</span>
    </div>

    <div
      class="timer-bar"
      :class="{ 'timer-warning': timeLeft <= 5 }"
    >
      <div
        class="timer-fill"
        :style="{ width: (timeLeft / 15) * 100 + '%' }"
      ></div>
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div
      class="question-card"
      :class="{
        'correct-flash': answered && lastAnswerCorrect,
        'wrong-shake': answered && lastAnswerCorrect === false
      }"
    >
      <div class="category-tag">{{ categoryName }}</div>
      <h2 class="question-text">{{ currentQuestion?.question }}</h2>
    </div>

    <div class="options-list">
      <button
        v-for="(option, index) in currentQuestion?.options"
        :key="index"
        class="option-btn"
        :class="getOptionClass(index)"
        :disabled="answered || isHiddenOption(index)"
        @click="selectAnswer(index)"
      >
        <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
        <span class="option-text" v-if="!isHiddenOption(index)">{{ option }}</span>
        <span class="option-text hidden-option" v-else>???</span>
      </button>
    </div>

    <div class="explanation" v-if="answered">
      <p class="explanation-title">{{ lastAnswerCorrect ? '✓ 回答正确！' : '✗ 回答错误' }}</p>
      <p class="explanation-text">{{ currentQuestion?.explanation }}</p>
    </div>

    <LifelineButtons />

    <div v-if="store.hintVisible" class="hint-sidebar">
      <HintSidebar :url="currentQuestion?.hintArticleUrl || ''" />
    </div>

    <div v-if="status === 'paused'" class="pause-overlay">
      <div class="pause-card fade-in">
        <h2>⏸ 游戏暂停</h2>
        <p>按 P 键继续游戏</p>
        <button class="resume-btn" @click="resumeGame">继续游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'
import { formatComboDisplay } from '../utils/score'
import { getCategoryName } from '../api/quiz'
import LifelineButtons from './LifelineButtons.vue'
import HintSidebar from './HintSidebar.vue'

const store = useQuizStore()
const {
  status,
  score,
  combo,
  lives,
  timeLeft,
  currentIndex,
  questions,
  currentQuestion,
  progress,
  answered,
  lastAnswerCorrect,
  selectedAnswer,
  hiddenOptions
} = storeToRefs(store)

const comboDisplay = computed(() => formatComboDisplay(combo.value))

const categoryName = computed(() => {
  if (!currentQuestion.value) return ''
  return getCategoryName(currentQuestion.value.category)
})

function isHiddenOption(index: number): boolean {
  return hiddenOptions.value.includes(index)
}

function getOptionClass(index: number): string[] {
  const classes: string[] = []
  if (answered.value) {
    if (index === currentQuestion.value?.correctAnswer) {
      classes.push('correct')
    }
    if (lastAnswerCorrect.value === false && index === selectedAnswer.value) {
      classes.push('wrong')
    }
  }
  if (isHiddenOption(index)) {
    classes.push('hidden')
  }
  return classes
}

function selectAnswer(index: number) {
  if (answered.value || isHiddenOption(index)) return
  store.handleAnswer(index)
}

function resumeGame() {
  store.togglePause()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'p') {
    if (status.value === 'playing' || status.value === 'paused') {
      store.togglePause()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  store.cleanup()
})
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  position: relative;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.score-display {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.score-label {
  font-size: 11px;
  color: #888;
  margin-right: 6px;
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-bar {
  width: 120px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.question-count {
  font-size: 12px;
  color: white;
}

.lives-display {
  display: flex;
  gap: 4px;
}

.heart {
  font-size: 20px;
  transition: all 0.3s;
}

.heart-lost {
  filter: grayscale(1);
  opacity: 0.5;
}

.combo-display {
  text-align: center;
  margin-bottom: 10px;
}

.combo-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.timer-bar {
  position: relative;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.timer-bar.timer-warning .timer-fill {
  background: linear-gradient(90deg, #ff6b6b, #ee5a5a);
}

.timer-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  border-radius: 15px;
  transition: width 1s linear;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-tag {
  display: inline-block;
  background: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 12px;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.5;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.option-btn:hover:not(:disabled) {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-btn.correct {
  background: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
}

.option-btn.wrong {
  background: #ffebee;
  border-color: #f44336;
  color: #c62828;
}

.option-btn.hidden {
  opacity: 0.5;
  background: #f5f5f5;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.option-btn.correct .option-letter {
  background: #4caf50;
}

.option-btn.wrong .option-letter {
  background: #f44336;
}

.option-btn.hidden .option-letter {
  background: #ccc;
}

.option-text {
  flex: 1;
  text-align: left;
}

.hidden-option {
  color: #999;
  letter-spacing: 4px;
}

.explanation {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}

.explanation-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.explanation-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.pause-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
}

.pause-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.pause-card p {
  color: #666;
  margin-bottom: 20px;
}

.resume-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.hint-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  z-index: 50;
}
</style>
