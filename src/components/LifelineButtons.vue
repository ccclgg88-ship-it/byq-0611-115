<template>
  <div class="lifeline-buttons">
    <button
      class="lifeline-btn"
      :class="{ disabled: !lifelines.fiftyFifty || answered }"
      :disabled="!lifelines.fiftyFifty || answered"
      @click="useFiftyFifty"
    >
      <span class="lifeline-icon">50/50</span>
      <span class="lifeline-label">去掉一半</span>
    </button>

    <button
      class="lifeline-btn"
      :class="{ disabled: !lifelines.hint || answered }"
      :disabled="!lifelines.hint || answered"
      @click="useHint"
    >
      <span class="lifeline-icon">📖</span>
      <span class="lifeline-label">查阅百科</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuizStore } from '../stores/quiz'

const store = useQuizStore()
const { lifelines, answered } = storeToRefs(store)

function useFiftyFifty() {
  store.useFiftyFifty()
}

function useHint() {
  store.useHint()
}
</script>

<style scoped>
.lifeline-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.lifeline-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.lifeline-btn:hover:not(:disabled) {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.lifeline-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lifeline-icon {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.lifeline-label {
  font-size: 12px;
  color: #666;
}
</style>
