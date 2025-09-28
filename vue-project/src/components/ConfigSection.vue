<template>
  <div class="config-section">
    <h2 class="section-title">配置设置</h2>
    
    <div class="config-grid">
      <!-- 更新提示设置 -->
      <div class="config-item">
        <label class="checkbox-wrapper">
          <input 
            type="checkbox"
            v-model="localConfig.showUpdatePrompt"
            @change="updateConfig"
            class="checkbox"
          >
          <span class="checkbox-label">显示更新提示</span>
        </label>
        <span class="config-description">启用后会在有更新时显示提示</span>
      </div>
      
      <!-- 自动检查更新 -->
      <div class="config-item">
        <label class="checkbox-wrapper">
          <input 
            type="checkbox"
            v-model="localConfig.autoCheckUpdates"
            @change="updateConfig"
            class="checkbox"
          >
          <span class="checkbox-label">自动检查更新</span>
        </label>
        <span class="config-description">启动时自动检查启动器更新</span>
      </div>
      
      <!-- 主题设置 -->
      <div class="config-item">
        <label class="config-label">主题模式</label>
        <div class="theme-options">
          <label 
            v-for="theme in themes" 
            :key="theme.value"
            class="radio-wrapper"
          >
            <input 
              type="radio"
              :value="theme.value"
              v-model="localConfig.theme"
              @change="updateTheme(theme.value)"
              class="radio"
            >
            <span class="radio-label">{{ theme.label }}</span>
          </label>
        </div>
      </div>
      
      <!-- 数据重置 -->
      <div class="config-item">
        <button @click="resetConfig" class="reset-button">
          <span class="button-icon">🔄</span>
          重置配置
        </button>
        <span class="config-description">恢复默认设置</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ConfigSection',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  emits: ['config-change'],
  setup(props, { emit }) {
    const localConfig = ref({ ...props.config })
    
    const themes = [
      { value: 'auto', label: '跟随系统' },
      { value: 'light', label: '浅色模式' },
      { value: 'dark', label: '深色模式' }
    ]

    // 监听外部配置变化
    watch(() => props.config, (newConfig) => {
      localConfig.value = { ...newConfig }
    }, { deep: true })

    const updateConfig = () => {
      emit('config-change', localConfig.value)
    }

    const updateTheme = (theme) => {
      localConfig.value.theme = theme
      updateConfig()
      
      // 应用主题
      applyTheme(theme)
    }

    const applyTheme = (theme) => {
      const root = document.documentElement
      const appElement = document.getElementById('app')
      
      if (!appElement) return
      
      // 移除所有主题类
      appElement.classList.remove('light', 'dark')
      
      let actualTheme = theme
      
      if (theme === 'auto') {
        // 检测系统主题偏好
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        
        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = (e) => {
          if (localConfig.value.theme === 'auto') {
            const newTheme = e.matches ? 'dark' : 'light'
            appElement.classList.remove('light', 'dark')
            appElement.classList.add(newTheme)
            root.setAttribute('data-theme', newTheme)
            root.style.setProperty('color-scheme', newTheme)
          }
        }
        
        // 添加监听器（避免重复添加）
        if (!window._systemThemeListener) {
          mediaQuery.addEventListener('change', handleSystemThemeChange)
          window._systemThemeListener = handleSystemThemeChange
        }
      }
      
      // 应用主题类
      appElement.classList.add(actualTheme)
      root.setAttribute('data-theme', actualTheme)
      root.style.setProperty('color-scheme', actualTheme)
      
      // 保存主题设置到本地存储
      localStorage.setItem('mciSeeTheme', theme)
    }

    const resetConfig = () => {
      const defaultConfig = {
        showUpdatePrompt: true,
        autoCheckUpdates: true,
        theme: 'auto'
      }
      
      localConfig.value = { ...defaultConfig }
      emit('config-change', defaultConfig)
      
      // 应用默认主题
      applyTheme('auto')
    }

    return {
      localConfig,
      themes,
      updateConfig,
      updateTheme,
      resetConfig
    }
  }
}
</script>

<style scoped>
/* 引入配置组件样式 */
@import '../assets/css/config.css';
</style>