<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

const appStore = useAppStore()

// 初始化应用
onMounted(async () => {
  await appStore.initializeApp()
})
</script>

<template>
  <div id="app" class="app-container">
    <!-- 导航栏 -->
    <AppNavbar />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
    
    <!-- 加载指示器 -->
    <div v-if="appStore.isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ appStore.t('common.loading', '加载中...') }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: var(--text-color, #374151);
  background: var(--bg-color, #ffffff);
  transition: all 0.3s ease;
  min-height: 100vh;
}

/* CSS变量定义 */
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --text-color: #374151;
  --text-secondary: #6b7280;
  --bg-color: #ffffff;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --hover-bg: rgba(0, 0, 0, 0.05);
  --active-bg: rgba(59, 130, 246, 0.1);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 暗色模式变量 */
.dark-theme {
  --primary-color: #60a5fa;
  --primary-hover: #3b82f6;
  --text-color: #f9fafb;
  --text-secondary: #d1d5db;
  --bg-color: #111827;
  --card-bg: #1f2937;
  --border-color: #374151;
  --hover-bg: rgba(255, 255, 255, 0.1);
  --active-bg: rgba(96, 165, 250, 0.2);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
}

/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* 加载覆盖层 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  background: var(--card-bg, white);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--border-color, #e5e7eb);
  border-top: 3px solid var(--primary-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-color);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 选择文本样式 */
::selection {
  background: var(--primary-color);
  color: white;
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
