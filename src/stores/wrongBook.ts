import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WrongBookEntry, WrongBookFilter } from '../types'
import { fetchWrongBook, toggleMastered, deleteWrongBookEntry } from '../api/quiz'

export const useWrongBookStore = defineStore('wrongBook', () => {
  const entries = ref<WrongBookEntry[]>([])
  const total = ref(0)
  const loading = ref(false)
  const categoryFilter = ref('')
  const statusFilter = ref<WrongBookFilter>('all')

  const filteredEntries = computed(() => {
    return entries.value.filter(e => {
      if (categoryFilter.value && e.category !== categoryFilter.value) return false
      if (statusFilter.value === 'mastered' && !e.mastered) return false
      if (statusFilter.value === 'unmastered' && e.mastered) return false
      return true
    })
  })

  const unmasteredCount = computed(() => entries.value.filter(e => !e.mastered).length)
  const masteredCount = computed(() => entries.value.filter(e => e.mastered).length)

  async function loadEntries() {
    loading.value = true
    try {
      const params: { category?: string; mastered?: boolean } = {}
      if (categoryFilter.value) {
        params.category = categoryFilter.value
      }
      if (statusFilter.value === 'mastered') {
        params.mastered = true
      } else if (statusFilter.value === 'unmastered') {
        params.mastered = false
      }
      const data = await fetchWrongBook(params)
      entries.value = data.entries
      total.value = data.total
    } catch (e) {
      console.error('Failed to load wrong book:', e)
    } finally {
      loading.value = false
    }
  }

  async function markMastered(questionId: string, mastered: boolean) {
    try {
      await toggleMastered(questionId, mastered)
      const entry = entries.value.find(e => e.questionId === questionId)
      if (entry) {
        entry.mastered = mastered
      }
    } catch (e) {
      console.error('Failed to toggle mastered:', e)
    }
  }

  async function removeEntry(questionId: string) {
    try {
      await deleteWrongBookEntry(questionId)
      entries.value = entries.value.filter(e => e.questionId !== questionId)
      total.value = Math.max(0, total.value - 1)
    } catch (e) {
      console.error('Failed to delete entry:', e)
    }
  }

  function setCategoryFilter(category: string) {
    categoryFilter.value = category
  }

  function setStatusFilter(filter: WrongBookFilter) {
    statusFilter.value = filter
  }

  return {
    entries,
    total,
    loading,
    categoryFilter,
    statusFilter,
    filteredEntries,
    unmasteredCount,
    masteredCount,
    loadEntries,
    markMastered,
    removeEntry,
    setCategoryFilter,
    setStatusFilter
  }
})
