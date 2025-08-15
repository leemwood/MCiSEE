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
    
    <!-- 配置按钮 -->
    <mdui-fab 
      @click="toggleConfig" 
      icon="settings" 
      class="config-fab"
      :class="{ 'config-open': showConfig }"
    ></mdui-fab>
    
    <!-- 配置面板 -->
    <div v-if="showConfig" class="config-overlay" @click="closeConfig">
      <div class="config-panel" @click.stop>
        <div class="config-header">
          <h3>{{ $t('config') }}</h3>
          <mdui-button-icon @click="closeConfig" icon="close"></mdui-button-icon>
        </div>
        <ConfigSection />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import Introduction from './components/Introduction.vue'
import DeviceSelector from './components/DeviceSelector.vue'
import AppSection from './components/AppSection.vue'
import WebsiteSection from './components/WebsiteSection.vue'
import Sidebar from './components/Sidebar.vue'
import ConfigSection from './components/ConfigSection.vue'

export default {
  name: 'App',
  components: {
    Introduction,
    DeviceSelector,
    AppSection,
    WebsiteSection,
    Sidebar,
    ConfigSection
  },
  setup() {
    const currentTheme = ref('default')
    const showConfig = ref(false)
    
    const toggleConfig = () => {
      showConfig.value = !showConfig.value
    }
    
    const closeConfig = () => {
      showConfig.value = false
    }
    
    const applyTheme = (theme) => {
      const backgroundElement = document.querySelector('.background')
      if (!backgroundElement) return
      
      // 移除所有主题类
      backgroundElement.classList.remove('light', 'dark', 'classic', 'system')
      
      let finalTheme = theme
      if (theme === 'default' || theme === 'system') {
        // 使用系统默认主题
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          finalTheme = 'dark'
        } else {
          finalTheme = 'light'
        }
      }
      
      // 添加对应的主题类
      backgroundElement.classList.add(finalTheme)
      currentTheme.value = theme
      
      // 同时更新根元素的data-theme属性
      document.documentElement.setAttribute('data-theme', finalTheme)
      
      console.log(`主题已切换为: ${finalTheme}`)
    }
    
    const setTheme = (theme) => {
      applyTheme(theme)
    }
    
    onMounted(() => {
      // 初始化主题
      const savedTheme = localStorage.getItem('theme') || 'default'
      applyTheme(savedTheme)
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme.value === 'default' || currentTheme.value === 'system') {
          applyTheme(currentTheme.value)
        }
      })
    })
    
    return {
      currentTheme,
      setTheme,
      showConfig,
      toggleConfig,
      closeConfig
    }
  },
  provide() {
    return {
      setTheme: this.setTheme
    }
  }
}
</script>

<style>
/* 全局样式将在style.css中定义 */

/* 配置按钮样式 */
.config-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.config-fab.config-open {
  transform: rotate(45deg);
}

/* 配置面板样式 */
.config-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.config-panel {
  background: var(--mdui-color-surface);
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--mdui-color-outline-variant);
  padding-bottom: 16px;
}

.config-header h3 {
  margin: 0;
  color: var(--mdui-color-on-surface);
  font-size: 1.25rem;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-panel {
    width: 95%;
    padding: 20px;
  }
  
  .config-fab {
    bottom: 20px;
    right: 20px;
  }
}
</style>