<template>
  <div class="hint-sidebar slide-in-right">
    <div class="hint-header">
      <h3>📖 百科参考</h3>
      <span class="hint-timer">{{ countdown }}s</span>
    </div>
    <div class="hint-content">
      <div class="mock-article">
        <div class="article-skeleton">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
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
}>()

const countdown = ref(5)
let timer: number | null = null

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

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  stopCountdown()
})

watch(() => props.url, () => {
  startCountdown()
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
