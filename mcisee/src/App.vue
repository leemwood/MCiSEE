<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app'
import { useI18n } from 'vue-i18n'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

const appStore = useAppStore()
const { t } = useI18n()

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
        <p>{{ t('common.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* 使用设计系统的CSS变量 */
:root {
  --primary-color: var(--color-primary-600);
  --primary-hover: var(--color-primary-700);
  --secondary-color: var(--color-gray-500);
  --success-color: var(--color-success-500);
  --warning-color: var(--color-warning-500);
  --error-color: var(--color-error-500);
  --text-color: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --bg-color: var(--color-background);
  --card-bg: var(--color-surface);
  --border-color: var(--color-border);
  --hover-bg: var(--color-gray-100);
  --active-bg: var(--color-primary-100);
  --shadow: var(--shadow-sm);
  --shadow-lg: var(--shadow-lg);
}

/* 暗色模式变量 */
.dark-theme {
  --primary-color: var(--color-primary-400);
  --primary-hover: var(--color-primary-500);
  --text-color: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --bg-color: var(--color-background);
  --card-bg: var(--color-surface);
  --border-color: var(--color-border);
  --hover-bg: var(--color-gray-800);
  --active-bg: var(--color-primary-900);
  --shadow: var(--shadow-sm);
  --shadow-lg: var(--shadow-lg);
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
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
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
  z-index: var(--z-modal);
  backdrop-filter: blur(4px);
}

.loading-spinner {
  background: var(--card-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-color);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: var(--spacing-lg);
    padding-bottom: var(--spacing-lg);
  }
  
  .loading-spinner {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
}
</style>
