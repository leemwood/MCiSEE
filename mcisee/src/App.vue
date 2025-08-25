<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import { useTheme } from './composables/useTheme.js'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div id="app" class="app-container">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定导航栏留出空间 */
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
}
</style>
