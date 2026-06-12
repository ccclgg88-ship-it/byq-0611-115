<template>
  <div class="hint-sidebar slide-in-right">
    <div class="hint-header">
      <h3>📖 百科参考</h3>
      <span class="hint-timer">{{ countdown }}s</span>
    </div>
    <div class="hint-content">
      <div class="mock-article">
        <div v-if="!loaded" class="article-skeleton">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div v-else class="article-body fade-in">
          <div class="article-title">{{ articleTitle }}</div>
          <div class="article-text">
            <p>{{ articleContent }}</p>
          </div>
          <a class="article-link" :href="url" target="_blank" rel="noopener noreferrer">
            🔗 查看完整百科原文
          </a>
        </div>
        <p class="hint-note">💡 提示内容已加载，计时仍在继续</p>
        <p class="hint-url">{{ url }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  url: string
  explanation?: string
}>()

const countdown = ref(5)
const loaded = ref(false)
let timer: number | null = null
let loadTimer: number | null = null

const articleTitle = ref('')
const articleContent = ref('')

function buildArticleContent() {
  if (props.explanation) {
    articleTitle.value = '相关百科知识'
    articleContent.value = props.explanation
  } else {
    articleTitle.value = '百科参考'
    articleContent.value = '请参考下方链接获取详细知识。'
  }
}

function startCountdown() {
  countdown.value = 5
  stopCountdown()
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startLoading() {
  loaded.value = false
  buildArticleContent()
  if (loadTimer) {
    clearTimeout(loadTimer)
  }
  loadTimer = window.setTimeout(() => {
    loaded.value = true
  }, 800)
}

onMounted(() => {
  startCountdown()
  startLoading()
})

onUnmounted(() => {
  stopCountdown()
  if (loadTimer) {
    clearTimeout(loadTimer)
    loadTimer = null
  }
})

watch(() => props.url, () => {
  startCountdown()
  startLoading()
})
</script>

<style scoped>
.hint-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border-radius: 0 16px 16px 0;
}

.hint-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.hint-header h3 {
  font-size: 16px;
  color: #333;
}

.hint-timer {
  background: #ff6b6b;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.hint-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.mock-article {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 100%;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

.skeleton-line.long {
  width: 100%;
  height: 24px;
}

.article-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.article-text {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
}

.article-link {
  display: inline-block;
  padding: 10px 16px;
  background: #e8eaf6;
  color: #3f51b5;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  text-align: center;
  transition: background 0.2s;
}

.article-link:hover {
  background: #c5cae9;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.hint-note {
  margin-top: 20px;
  padding: 10px;
  background: #fff3e0;
  border-radius: 8px;
  font-size: 12px;
  color: #e65100;
  text-align: center;
}

.hint-url {
  font-size: 11px;
  color: #999;
  word-break: break-all;
  text-align: center;
  margin-top: 8px;
}
</style>
