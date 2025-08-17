<template>
  <div id="app">
    <!-- 背景 -->
    <div class="background" :class="currentTheme"></div>
    
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主要内容 -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="page-content" id="顶部">
        <h1>{{ $t('title') }}</h1>
        <p>{{ $t('description') }}</p>
        
        <!-- 介绍部分 -->
        <Introduction />
        
        <!-- 搜索功能 -->
        <section class="search-section" id="快速查询">
          <h2>{{ $t('search_title') || '快速搜索' }}</h2>
          <SearchBox />
        </section>
        
        <!-- 设备选择 -->
        <section id="设备">
          <DeviceSelector @device-changed="onDeviceChanged" />
        </section>
        
        <!-- 应用程序部分 -->
        <section id="软件">
          <AppSection :selected-device="selectedDevice" />
        </section>
        
        <!-- 网站部分 -->
        <section id="网站">
          <WebsiteSection />
        </section>
        
        <!-- 配置部分 -->
        <section id="配置">
          <ConfigSection />
        </section>
      </div>
      
      <!-- 页脚 -->
      <Footer id="底部" />
    </main>
    
    <!-- 更新通知 -->
    <UpdateNotification />
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'

import Introduction from './components/Introduction.vue'
import SearchBox from './components/SearchBox.vue'
import DeviceSelector from './components/DeviceSelector.vue'
import AppSection from './components/AppSection.vue'
import WebsiteSection from './components/WebsiteSection.vue'
import ConfigSection from './components/ConfigSection.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'
import UpdateNotification from './components/UpdateNotification.vue'

export default {
  name: 'App',
  components: {
    Introduction,
    SearchBox,
    DeviceSelector,
    AppSection,
    WebsiteSection,
    ConfigSection,
    Sidebar,
    Footer,
    UpdateNotification
  },
  setup() {
    const currentTheme = ref('default')
    const selectedDevice = ref('auto')
    const sidebarCollapsed = ref(true)
    
    const themes = ref([
      { value: 'default', label: '跟随系统' },
      { value: 'light', label: '浅色主题' },
      { value: 'dark', label: '深色主题' }
    ])
    
    const applyTheme = (theme) => {
      // 确保theme是字符串，如果是事件对象则提取值
      let themeValue = theme
      if (typeof theme === 'object' && theme !== null) {
        if (theme.target && theme.target.value) {
          themeValue = theme.target.value
        } else {
          console.warn('Invalid theme value:', theme)
          return
        }
      }
      
      // 确保themeValue是有效的字符串
      if (typeof themeValue !== 'string' || !themeValue) {
        console.warn('Theme value is not a valid string:', themeValue)
        return
      }
      
      const backgroundElement = document.querySelector('.background')
      if (!backgroundElement) return
      
      // 移除所有主题类
      backgroundElement.classList.remove('light', 'dark', 'classic', 'system')
      
      let finalTheme = themeValue
      if (themeValue === 'default' || themeValue === 'system') {
        // 使用系统默认主题
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          finalTheme = 'dark'
        } else {
          finalTheme = 'light'
        }
      }
      
      // 添加对应的主题类
      backgroundElement.classList.add(finalTheme)
      currentTheme.value = themeValue
      
      // 同时更新根元素的data-theme属性
      document.documentElement.setAttribute('data-theme', finalTheme)
    }
    
    const setTheme = (theme) => {
      applyTheme(theme)
      localStorage.setItem('theme', theme)
    }
    
    // 处理设备选择变化
    const onDeviceChanged = (device) => {
       selectedDevice.value = device
     }
    
    // 提供setTheme函数给子组件
    provide('setTheme', setTheme)
    
    onMounted(() => {
      // 初始化主题
      const savedTheme = localStorage.getItem('theme') || 'default'
      applyTheme(savedTheme)
      
      // 初始化设备选择
      const savedDevice = localStorage.getItem('selectedDevice') || 'auto'
      selectedDevice.value = savedDevice
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (currentTheme.value === 'default' || currentTheme.value === 'system') {
          applyTheme(currentTheme.value)
        }
      })
    })
    
    // 提供侧边栏状态给子组件
    provide('sidebarCollapsed', sidebarCollapsed)
    
    return {
      currentTheme,
      themes,
      setTheme,
      selectedDevice,
      onDeviceChanged,
      sidebarCollapsed
    }
  }
}
</script>

<style>
/* 全局样式将在style.css中定义 */

/* 主应用布局 */
#app {
  position: relative;
  min-height: 100vh;
}

/* 主要内容区域 */
.main-content {
  min-height: 100vh;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 页面内容 */
.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

/* 搜索部分样式 */
.search-section {
  margin: 2rem 0;
  padding: 2rem;
  background: var(--mdui-color-surface-container-low);
  border-radius: 16px;
  text-align: center;
}

.search-section h2 {
  color: var(--mdui-color-on-surface);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}
</style>