<template>
  <div class="config-container" id="配置">
    <div class="label margin-top-20">{{ $t('config') }}</div>
    
    <!-- 主题选择 -->
    <div class="config-item">
      <label class="config-label">{{ $t('theme') }}</label>
      <select 
        v-model="selectedTheme" 
        class="theme-selector"
      >
        <option value="default">{{ $t('theme_default') }}</option>
        <option value="light">{{ $t('theme_light') }}</option>
        <option value="dark">{{ $t('theme_dark') }}</option>
        <option value="classic">{{ $t('theme_classic') }}</option>

        <option value="system">{{ $t('theme_system') }}</option>
      </select>
    </div>
    
    <!-- 调试模式 -->
    <div class="config-item">
      <label class="config-label">
        <input 
          type="checkbox"
          v-model="debugMode" 
          @change="handleDebugModeChange"
          class="config-switch"
        />
        {{ $t('debug_mode') }}
      </label>
      <span class="config-description">{{ $t('debug_mode_desc') }}</span>
    </div>
    
    <!-- GitHub代理 -->
    <div class="config-item">
      <label class="config-label">{{ $t('github_proxy') }}</label>
      <select 
        v-model="githubProxy" 
        @change="handleGithubProxyChange"
        class="config-select"
      >
        <option value="none">{{ $t('proxy_none') }}</option>
        <option value="ghproxy">ghproxy.com</option>
        <option value="fastgit">hub.fastgit.xyz</option>
        <option value="gitclone">gitclone.com</option>
      </select>
      <span class="config-description">{{ $t('github_proxy_desc') }}</span>
    </div>
    
    <!-- 更新检查 -->
    <div class="config-item">
      <label class="config-label">
        <input 
          type="checkbox"
          v-model="autoUpdateCheck" 
          @change="handleAutoUpdateCheckChange"
          class="config-switch"
        />
        {{ $t('auto_update_check') }}
      </label>
      <span class="config-description">{{ $t('auto_update_check_desc') }}</span>
    </div>
    
    <!-- 可搜索提示长度 -->
    <div class="config-item">
      <label class="config-label">{{ $t('searchable_hint_length') }}</label>
      <input 
        type="range"
        v-model="searchableHintLength" 
        @input="handleSearchableHintLengthChange"
        min="5" 
        max="50" 
        step="5"
        class="config-slider"
      />
      <span class="config-value">{{ searchableHintLength }}</span>
      <span class="config-description">{{ $t('searchable_hint_length_desc') }}</span>
    </div>
    
    <!-- 语言选择 -->
    <div class="config-item">
      <label class="config-label">{{ $t('language') }}</label>
      <select 
        v-model="selectedLanguage" 
        @change="handleLanguageChange"
        class="config-select"
      >
        <option value="zh-CN">简体中文</option>
        <option value="en-US">English</option>
        <option value="pt-BR">Português (Brasil)</option>
        <option value="ja-JP">日本語</option>
        <option value="ko-KR">한국어</option>
      </select>
    </div>
    
    <!-- 重置配置 -->
    <div class="config-item">
      <button 
        @click="resetConfig" 
        class="reset-button"
      >
        {{ $t('reset_config') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject, watch } from 'vue'
import updateChecker from '../services/updateChecker.js'

export default {
  name: 'ConfigSection',
  setup() {
    const setTheme = inject('setTheme')
    
    // 配置状态
    const selectedTheme = ref('default')
    const debugMode = ref(false)
    const githubProxy = ref('none')
    const autoUpdateCheck = ref(true)
    const searchableHintLength = ref(20)
    const selectedLanguage = ref('zh-CN')
    
    // 主题切换处理
    const handleThemeChange = (value) => {
      // 确保value是字符串，如果是事件对象则提取值
      let themeValue = value
      if (typeof value === 'object' && value !== null) {
        if (value.target && value.target.value) {
          themeValue = value.target.value
        } else {
          console.warn('Invalid theme value:', value)
          return
        }
      }
      
      selectedTheme.value = themeValue
      localStorage.setItem('theme', themeValue)
      if (setTheme) {
        setTheme(themeValue)
      }
      applyTheme(themeValue)
    }
    
    // 应用主题
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
      
      // 同时更新根元素的data-theme属性
      document.documentElement.setAttribute('data-theme', finalTheme)
    }
    
    // 调试模式切换
    const handleDebugModeChange = (value) => {
      debugMode.value = value
      localStorage.setItem('debugMode', value.toString())
      
      if (value) {
        // 启用调试功能
        window.MCiSEE_DEBUG = true
      } else {
        window.MCiSEE_DEBUG = false
      }
    }
    
    // GitHub代理切换
    const handleGithubProxyChange = (value) => {
      githubProxy.value = value
      localStorage.setItem('githubProxy', value)
      
      // 设置全局代理配置
      window.GITHUB_PROXY = value
    }
    
    // 自动更新检查切换
    const handleAutoUpdateCheckChange = (value) => {
      autoUpdateCheck.value = value
      localStorage.setItem('autoUpdateCheck', value.toString())
      
      // 启用或禁用自动更新检查
      if (value) {
        updateChecker.enableAutoCheck()
      } else {
        updateChecker.disableAutoCheck()
      }
    }
    
    // 搜索提示长度变更
    const handleSearchableHintLengthChange = (value) => {
      searchableHintLength.value = value
      localStorage.setItem('searchableHintLength', value.toString())
    }
    
    // 语言切换
    const handleLanguageChange = (value) => {
      selectedLanguage.value = value
      localStorage.setItem('language', value)
      
      // 更新HTML lang属性
      document.documentElement.lang = value
    }
    
    // 重置配置
    const resetConfig = () => {
      // 重置所有配置到默认值
      selectedTheme.value = 'default'
      debugMode.value = false
      githubProxy.value = 'none'
      autoUpdateCheck.value = true
      searchableHintLength.value = 20
      selectedLanguage.value = 'zh-CN'
      
      // 清除本地存储
      localStorage.removeItem('theme')
      localStorage.removeItem('debugMode')
      localStorage.removeItem('githubProxy')
      localStorage.removeItem('autoUpdateCheck')
      localStorage.removeItem('searchableHintLength')
      localStorage.removeItem('language')
      
      // 应用默认设置
      applyTheme('default')
      document.documentElement.lang = 'zh-CN'
      window.MCiSEE_DEBUG = false
      window.GITHUB_PROXY = 'none'
    }
    
    // 加载保存的配置
    const loadConfig = () => {
      // 加载主题
      const savedTheme = localStorage.getItem('theme') || 'default'
      selectedTheme.value = savedTheme
      applyTheme(savedTheme)
      
      // 加载调试模式
      const savedDebugMode = localStorage.getItem('debugMode') === 'true'
      debugMode.value = savedDebugMode
      window.MCiSEE_DEBUG = savedDebugMode
      
      // 加载GitHub代理
      const savedGithubProxy = localStorage.getItem('githubProxy') || 'none'
      githubProxy.value = savedGithubProxy
      window.GITHUB_PROXY = savedGithubProxy
      
      // 加载自动更新检查
      const savedAutoUpdateCheck = localStorage.getItem('autoUpdateCheck') !== 'false'
      autoUpdateCheck.value = savedAutoUpdateCheck
      
      // 加载搜索提示长度
      const savedSearchableHintLength = parseInt(localStorage.getItem('searchableHintLength')) || 20
      searchableHintLength.value = savedSearchableHintLength
      
      // 加载语言
      const savedLanguage = localStorage.getItem('language') || 'zh-CN'
      selectedLanguage.value = savedLanguage
      document.documentElement.lang = savedLanguage
    }
    
    // 监听主题变化
    watch(selectedTheme, (newTheme) => {
      handleThemeChange(newTheme)
    })
    
    onMounted(() => {
      // 等待DOM更新后加载配置
      setTimeout(() => {
        loadConfig()
        
        // 初始化更新检查服务
        if (autoUpdateCheck.value) {
          updateChecker.enableAutoCheck()
        }
      }, 100)
    })
    
    return {
      selectedTheme,
      debugMode,
      githubProxy,
      autoUpdateCheck,
      searchableHintLength,
      selectedLanguage,
      handleThemeChange,
      handleDebugModeChange,
      handleGithubProxyChange,
      handleAutoUpdateCheckChange,
      handleSearchableHintLengthChange,
      handleLanguageChange,
      resetConfig
    }
  }
}
</script>

<style scoped>
.config-container {
  margin: 2rem 0;
}

.config-item {
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.config-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.config-description {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.config-value {
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: 500;
  color: #28a745;
}

.theme-selector,
.config-select {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  margin-bottom: 0.5rem;
}

.config-switch {
  margin-right: 0.5rem;
}

.config-slider {
  width: 100%;
  max-width: 300px;
  margin-right: 0.5rem;
}

.reset-button {
  padding: 0.5rem 1rem;
  background: white;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background-color: #dc3545;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-item {
    padding: 0.75rem;
  }
  
  .theme-selector {
    max-width: 100%;
  }
  
  .config-select,
  .config-slider {
    max-width: 100%;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .config-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .config-label {
    color: #fff;
  }
  
  .config-description {
    color: #ccc;
  }
}
/* 移动端优化 */
@media (max-width: 768px) {
  .config-section {
    padding: 1rem 0.5rem;
  }
  
  .config-item {
    margin-bottom: 1.5rem;
    padding: 1rem;
  }
  
  .config-label {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .config-description {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
  
  .config-select,
  .config-input {
    width: 100%;
    font-size: 16px;
    padding: 0.75rem;
    min-height: 44px;
  }
  
  .config-checkbox {
    transform: scale(1.2);
    margin-right: 0.75rem;
  }
  
  .config-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .config-section {
    padding: 0.75rem 0.25rem;
  }
  
  .config-item {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .config-label {
    font-size: 0.95rem;
  }
  
  .config-description {
    font-size: 0.8rem;
  }
  
  .config-select,
  .config-input {
    padding: 0.6rem;
  }
  
  .config-button {
    padding: 0.6rem;
  }
}
</style>