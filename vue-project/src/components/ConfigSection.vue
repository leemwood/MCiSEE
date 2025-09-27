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
      
      if (theme === 'dark') {
        root.style.setProperty('color-scheme', 'dark')
      } else if (theme === 'light') {
        root.style.setProperty('color-scheme', 'light')
      } else {
        // 跟随系统
        root.style.removeProperty('color-scheme')
      }
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
.config-section {
  margin-top: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 8px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.config-label {
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 8px;
}

.config-description {
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.8;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.radio-label {
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.reset-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.reset-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.button-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .config-item {
    padding: 12px;
  }
}
</style>