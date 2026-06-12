<template>
  <div class="app">
    <HomePage v-if="status === 'idle'" />
    <GamePage v-else-if="status === 'playing' || status === 'paused'" />
    <ResultPage v-else-if="status === 'finished'" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuizStore } from './stores/quiz'
import HomePage from './components/HomePage.vue'
import GamePage from './components/GamePage.vue'
import ResultPage from './components/ResultPage.vue'

const store = useQuizStore()
const { status } = storeToRefs(store)

onMounted(async () => {
  await store.loadBank()
})
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
