<template>
  <div class="wrongbook-container fade-in">
    <div class="wrongbook-card">
      <div class="page-header">
        <button class="back-btn" @click="goBack">← 返回</button>
        <h1 class="page-title">📝 错题本</h1>
        <span class="entry-count">共 {{ total }} 题</span>
      </div>

      <div class="filter-bar">
        <div class="filter-group">
          <button
            class="filter-chip"
            :class="{ active: statusFilter === 'all' }"
            @click="setStatus('all')"
          >
            全部 ({{ entries.length }})
          </button>
          <button
            class="filter-chip"
            :class="{ active: statusFilter === 'unmastered' }"
            @click="setStatus('unmastered')"
          >
            未掌握 ({{ unmasteredCount }})
          </button>
          <button
            class="filter-chip"
            :class="{ active: statusFilter === 'mastered' }"
            @click="setStatus('mastered')"
          >
            已掌握 ({{ masteredCount }})
          </button>
        </div>
        <div class="category-filter">
          <select v-model="categoryValue" class="category-select" @change="onCategoryChange">
            <option value="">全部分类</option>
            <option value="health">🏥 健康</option>
            <option value="legal">⚖️ 法律常识</option>
            <option value="firstaid">🚑 急救</option>
            <option value="finance">💰 理财</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredEntries.length === 0" class="empty-state">
        <div class="empty-icon">🎉</div>
        <p class="empty-text">{{ emptyMessage }}</p>
      </div>

      <div v-else class="entry-list">
        <div
          v-for="entry in filteredEntries"
          :key="entry.questionId"
          class="entry-item"
          :class="{ mastered: entry.mastered }"
        >
          <div class="entry-header">
            <span class="entry-category">{{ getCategoryName(entry.category) }}</span>
            <span class="entry-error-count" :class="{ high: entry.errorCount >= 3 }">
              ❌ 错 {{ entry.errorCount }} 次
            </span>
          </div>

          <div class="entry-question">{{ entry.question }}</div>

          <div class="entry-answers">
            <div class="answer-row wrong-answer">
              <span class="answer-label">你的答案：</span>
              <span class="answer-value">{{ getUserAnswer(entry) }}</span>
            </div>
            <div class="answer-row correct-answer">
              <span class="answer-label">正确答案：</span>
              <span class="answer-value">{{ getCorrectAnswer(entry) }}</span>
            </div>
          </div>

          <div class="entry-explanation">
            <span class="explanation-label">解析：</span>
            {{ entry.explanation }}
          </div>

          <div class="entry-actions">
            <button
              class="action-btn master-btn"
              :class="{ mastered: entry.mastered }"
              @click="handleMastered(entry)"
            >
              {{ entry.mastered ? '✅ 已掌握' : '☑️ 标记已掌握' }}
            </button>
            <button
              class="action-btn delete-btn"
              @click="handleDelete(entry)"
            >
              🗑 删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWrongBookStore } from '../stores/wrongBook'
import { getCategoryName } from '../api/quiz'
import type { WrongBookEntry, WrongBookFilter } from '../types'

const emit = defineEmits<{
  back: []
}>()

const store = useWrongBookStore()
const { entries, total, loading, statusFilter, filteredEntries, unmasteredCount, masteredCount } = storeToRefs(store)

const categoryValue = ref('')

const emptyMessage = computed(() => {
  if (statusFilter.value === 'mastered') return '还没有已掌握的题目'
  if (statusFilter.value === 'unmastered') return '所有错题都已掌握，太棒了！'
  return '暂无错题记录，继续保持！'
})

function setStatus(filter: WrongBookFilter) {
  store.setStatusFilter(filter)
}

function onCategoryChange() {
  store.setCategoryFilter(categoryValue.value)
}

function getUserAnswer(entry: WrongBookEntry): string {
  if (entry.userAnswer < 0 || !entry.options[entry.userAnswer]) return '超时未答'
  return entry.options[entry.userAnswer]
}

function getCorrectAnswer(entry: WrongBookEntry): string {
  return entry.options[entry.correctAnswer] || ''
}

async function handleMastered(entry: WrongBookEntry) {
  await store.markMastered(entry.questionId, !entry.mastered)
}

async function handleDelete(entry: WrongBookEntry) {
  await store.removeEntry(entry.questionId)
}

function goBack() {
  emit('back')
}

onMounted(() => {
  store.loadEntries()
})
</script>

<style scoped>
.wrongbook-container {
  width: 100%;
  max-width: 560px;
  padding: 20px;
  max-height: 100vh;
  overflow-y: auto;
}

.wrongbook-card {
  background: white;
  border-radius: 20px;
  padding: 30px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f0f0f0;
}

.page-title {
  flex: 1;
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.entry-count {
  font-size: 13px;
  color: #888;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
}

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 6px;
}

.filter-chip {
  padding: 6px 14px;
  border: 1.5px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-chip.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.filter-chip:hover:not(.active) {
  border-color: #667eea;
  color: #667eea;
}

.category-select {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  font-size: 13px;
  color: #555;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.category-select:focus {
  outline: none;
  border-color: #667eea;
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #888;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entry-item {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #f44336;
  transition: border-color 0.2s, background 0.2s;
}

.entry-item.mastered {
  border-left-color: #4caf50;
  background: #f9fdf9;
  opacity: 0.75;
}

.entry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.entry-category {
  font-size: 11px;
  background: #e8eaf6;
  color: #3f51b5;
  padding: 3px 8px;
  border-radius: 10px;
}

.entry-error-count {
  font-size: 12px;
  color: #f44336;
  font-weight: 500;
}

.entry-error-count.high {
  color: #d32f2f;
  font-weight: 700;
}

.entry-question {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
}

.entry-answers {
  margin-bottom: 10px;
}

.answer-row {
  font-size: 12px;
  padding: 3px 0;
}

.answer-label {
  color: #888;
}

.wrong-answer .answer-value {
  color: #f44336;
  font-weight: 500;
}

.correct-answer .answer-value {
  color: #4caf50;
  font-weight: 500;
}

.entry-explanation {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  padding: 8px 10px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
}

.explanation-label {
  font-weight: 600;
  color: #555;
}

.entry-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.master-btn {
  background: #e8f5e9;
  color: #2e7d32;
}

.master-btn.mastered {
  background: #c8e6c9;
  color: #1b5e20;
}

.master-btn:hover {
  filter: brightness(0.95);
}

.delete-btn {
  background: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background: #ffcdd2;
}
</style>
