<template>
  <div id="app">
    <!-- 背景 -->
    <div class="background" :class="currentTheme"></div>
    

    
    <!-- 主要内容 -->
    <main class="main-content">
      <div class="page-content" id="顶部">
        <h1>{{ $t('title') }}</h1>
        <p>{{ $t('description') }}</p>
        
        <!-- 介绍部分 -->
        <Introduction />
        
        <!-- 设备选择 -->
        <DeviceSelector />
        
        <!-- 应用程序部分 -->
        <AppSection />
        
        <!-- 网站部分 -->
        <WebsiteSection />
      
      <!-- 侧边栏 -->
      <Sidebar />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import Introduction from './components/Introduction.vue'
import DeviceSelector from './components/DeviceSelector.vue'
import AppSection from './components/AppSection.vue'
import WebsiteSection from './components/WebsiteSection.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Introduction,
    DeviceSelector,
    AppSection,
    WebsiteSection,
    Sidebar
  },
  setup() {
    const currentTheme = ref('system')
    
    onMounted(() => {
      // 初始化主题
      const savedTheme = localStorage.getItem('theme') || 'system'
      currentTheme.value = savedTheme
      applyTheme(savedTheme)
    })
    
    const applyTheme = (theme) => {
      const root = document.documentElement
      root.setAttribute('data-theme', theme)
      
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      }
    }
    
    return {
      currentTheme
    }
  }
}
</script>

<style>
/* 全局样式将在style.css中定义 */
</style>