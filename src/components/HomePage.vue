<template>
  <div class="home-container fade-in">
    <div class="home-card">
      <div class="title-section">
        <h1 class="game-title">📚 生活百科闯关</h1>
        <p class="game-subtitle">每关5题 · 挑战你的知识极限</p>
      </div>

      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">历史最高分</span>
          <span class="stat-value">{{ highScore }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最高连击</span>
          <span class="stat-value">{{ maxComboDisplay }}</span>
        </div>
      </div>

      <div class="categories">
        <h3>题目分类</h3>
        <div class="category-list">
          <span class="category-tag">🏥 健康</span>
          <span class="category-tag">⚖️ 法律常识</span>
          <span class="category-tag">🚑 急救</span>
          <span class="category-tag">💰 理财</span>
        </div>
      </div>

      <div class="rules">
        <h3>游戏规则</h3>
        <ul>
          <li>每题15秒，答对+100分 + 连击×10</li>
          <li>答错扣1颗心，共3颗心</li>
          <li>50/50：随机去掉2个错误选项</li>
          <li>查阅百科：查看提示文章5秒</li>
          <li>按 P 键可暂停游戏</li>
        </ul>
      </div>

      <button
        class="start-btn"
        :disabled="!canStart || loading"
        @click="startGame"
      >
        {{ loading ? '加载中...' : '开始游戏' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { formatComboDisplay } from '../utils/score'
import { getHighScore, getMaxComboRecord } from '../utils/session'

const store = useQuizStore()
const loading = ref(true)

const highScore = ref(0)
const maxComboRecord = ref(0)

const maxComboDisplay = computed(() => formatComboDisplay(maxComboRecord.value))
const canStart = computed(() => store.canStart)

onMounted(async () => {
  highScore.value = getHighScore()
  maxComboRecord.value = getMaxComboRecord()
  await store.loadBank()
  loading.value = false
})

function startGame() {
  store.startGame()
}
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.home-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.game-subtitle {
  font-size: 14px;
  color: #888;
}

.stats-section {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  color: white;
}

.stat-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.categories {
  margin-bottom: 20px;
}

.categories h3,
.rules h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
}

.rules {
  margin-bottom: 25px;
}

.rules ul {
  list-style: none;
  padding: 0;
}

.rules li {
  font-size: 13px;
  color: #666;
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.rules li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
}

.start-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
