<template>
  <div class="app">
    <HomePage v-if="page === 'home'" @open-wrong-book="page = 'wrongBook'" />
    <WrongBookPage v-else-if="page === 'wrongBook'" @back="page = 'home'" />
    <GamePage v-else-if="page === 'game'" />
    <ResultPage v-else-if="page === 'result'" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuizStore } from './stores/quiz'
import HomePage from './components/HomePage.vue'
import GamePage from './components/GamePage.vue'
import ResultPage from './components/ResultPage.vue'
import WrongBookPage from './components/WrongBookPage.vue'

const store = useQuizStore()

type PageType = 'home' | 'game' | 'result' | 'wrongBook'
const page = ref<PageType>('home')

watch(() => store.status, (status) => {
  if (status === 'idle') {
    page.value = 'home'
  } else if (status === 'playing' || status === 'paused') {
    page.value = 'game'
  } else if (status === 'finished') {
    page.value = 'result'
  }
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
