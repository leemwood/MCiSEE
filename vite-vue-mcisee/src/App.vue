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
    
    <!-- 主题设置区域 -->
    <div class="theme-settings">
      <div class="theme-container">
        <h3>{{ $t('theme_settings') || '主题设置' }}</h3>
        <div class="theme-options">
          <button 
            v-for="theme in themes" 
            :key="theme.value"
            @click="setTheme(theme.value)"
            :class="['theme-btn', { active: currentTheme === theme.value }]"
          >
            {{ theme.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import Introduction from './components/Introduction.vue'
import DeviceSelector from './components/DeviceSelector.vue'
import AppSection from './components/AppSection.vue'
import WebsiteSection from './components/WebsiteSection.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Introduction,
    DeviceSelector,
    AppSection,
    WebsiteSection,
    Sidebar,
    Footer
  },
  setup() {
    const currentTheme = ref('default')
    
    const themes = ref([
      { value: 'default', label: '跟随系统' },
      { value: 'light', label: '浅色主题' },
      { value: 'dark', label: '深色主题' }
    ])
    
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
      localStorage.setItem('theme', theme)
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
      themes,
      setTheme
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

/* 主题设置区域样式 */
.theme-settings {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 2rem 0;
  margin-top: 2rem;
}

.theme-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.theme-container h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.theme-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #28a745;
  background: white;
  color: #28a745;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
}

.theme-btn:hover {
  background: #28a745;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.theme-btn.active {
  background: #28a745;
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.4);
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .theme-settings {
    background: #1a1a1a;
    border-top-color: #444;
  }
  
  .theme-container h3 {
    color: #fff;
  }
  
  .theme-btn {
    background: #2d2d2d;
    border-color: #28a745;
    color: #28a745;
  }
  
  .theme-btn:hover {
    background: #28a745;
    color: white;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-settings {
    padding: 1.5rem 0;
  }
  
  .theme-container {
    padding: 0 0.5rem;
  }
  
  .theme-container h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .theme-options {
    gap: 0.5rem;
  }
  
  .theme-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    min-width: 100px;
  }
}
</style>