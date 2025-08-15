<template>
  <div class="config-container" id="配置">
    <div class="label margin-top-20">{{ $t('config') }}</div>
    
    <!-- 主题选择 -->
    <div class="config-item">
      <label class="config-label">{{ $t('theme') }}</label>
      <mdui-segmented-button-group 
        v-model="selectedTheme" 
        @change="handleThemeChange"
        class="theme-selector"
      >
        <mdui-segmented-button value="default">{{ $t('theme_default') }}</mdui-segmented-button>
        <mdui-segmented-button value="light">{{ $t('theme_light') }}</mdui-segmented-button>
        <mdui-segmented-button value="dark">{{ $t('theme_dark') }}</mdui-segmented-button>
        <mdui-segmented-button value="classic">{{ $t('theme_classic') }}</mdui-segmented-button>
      </mdui-segmented-button-group>
    </div>
    
    <!-- 调试模式 -->
    <div class="config-item">
      <label class="config-label">{{ $t('debug_mode') }}</label>
      <mdui-switch 
        v-model="debugMode" 
        @change="handleDebugModeChange"
        class="config-switch"
      ></mdui-switch>
      <span class="config-description">{{ $t('debug_mode_desc') }}</span>
    </div>
    
    <!-- GitHub代理 -->
    <div class="config-item">
      <label class="config-label">{{ $t('github_proxy') }}</label>
      <mdui-select 
        v-model="githubProxy" 
        @change="handleGithubProxyChange"
        class="config-select"
      >
        <mdui-menu-item value="none">{{ $t('proxy_none') }}</mdui-menu-item>
        <mdui-menu-item value="ghproxy">ghproxy.com</mdui-menu-item>
        <mdui-menu-item value="fastgit">hub.fastgit.xyz</mdui-menu-item>
        <mdui-menu-item value="gitclone">gitclone.com</mdui-menu-item>
      </mdui-select>
      <span class="config-description">{{ $t('github_proxy_desc') }}</span>
    </div>
    
    <!-- 更新检查 -->
    <div class="config-item">
      <label class="config-label">{{ $t('auto_update_check') }}</label>
      <mdui-switch 
        v-model="autoUpdateCheck" 
        @change="handleAutoUpdateCheckChange"
        class="config-switch"
      ></mdui-switch>
      <span class="config-description">{{ $t('auto_update_check_desc') }}</span>
    </div>
    
    <!-- 可搜索提示长度 -->
    <div class="config-item">
      <label class="config-label">{{ $t('searchable_hint_length') }}</label>
      <mdui-slider 
        v-model="searchableHintLength" 
        @change="handleSearchableHintLengthChange"
        min="5" 
        max="50" 
        step="5"
        class="config-slider"
      ></mdui-slider>
      <span class="config-value">{{ searchableHintLength }}</span>
      <span class="config-description">{{ $t('searchable_hint_length_desc') }}</span>
    </div>
    
    <!-- 语言选择 -->
    <div class="config-item">
      <label class="config-label">{{ $t('language') }}</label>
      <mdui-select 
        v-model="selectedLanguage" 
        @change="handleLanguageChange"
        class="config-select"
      >
        <mdui-menu-item value="zh-CN">简体中文</mdui-menu-item>
        <mdui-menu-item value="en-US">English</mdui-menu-item>
        <mdui-menu-item value="pt-BR">Português (Brasil)</mdui-menu-item>
        <mdui-menu-item value="ja-JP">日本語</mdui-menu-item>
        <mdui-menu-item value="ko-KR">한국어</mdui-menu-item>
      </mdui-select>
    </div>
    
    <!-- 重置配置 -->
    <div class="config-item">
      <mdui-button 
        @click="resetConfig" 
        variant="outlined" 
        class="reset-button"
      >
        {{ $t('reset_config') }}
      </mdui-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ConfigSection',
  setup() {
    const { t, locale } = useI18n()
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
      selectedTheme.value = value
      localStorage.setItem('theme', value)
      if (setTheme) {
        setTheme(value)
      }
      applyTheme(value)
    }
    
    // 应用主题
    const applyTheme = (theme) => {
      const body = document.body
      // 移除所有主题类
      body.classList.remove('light-theme', 'dark-theme', 'classic-theme')
      
      switch (theme) {
        case 'light':
          body.classList.add('light-theme')
          break
        case 'dark':
          body.classList.add('dark-theme')
          break
        case 'classic':
          body.classList.add('classic-theme')
          break
        case 'default':
        default:
          // 使用系统默认主题
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-theme')
          } else {
            body.classList.add('light-theme')
          }
          break
      }
    }
    
    // 调试模式切换
    const handleDebugModeChange = (value) => {
      debugMode.value = value
      localStorage.setItem('debugMode', value.toString())
      
      if (value) {
        console.log('调试模式已启用')
        // 启用调试功能
        window.MCiSEE_DEBUG = true
      } else {
        console.log('调试模式已禁用')
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
    }
    
    // 搜索提示长度变更
    const handleSearchableHintLengthChange = (value) => {
      searchableHintLength.value = value
      localStorage.setItem('searchableHintLength', value.toString())
    }
    
    // 语言切换
    const handleLanguageChange = (value) => {
      selectedLanguage.value = value
      locale.value = value
      localStorage.setItem('language', value)
      
      // 更新HTML lang属性
      document.documentElement.lang = value
    }
    
    // 重置配置
    const resetConfig = () => {
      if (confirm(t('reset_config_confirm'))) {
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
        locale.value = 'zh-CN'
        document.documentElement.lang = 'zh-CN'
        window.MCiSEE_DEBUG = false
        window.GITHUB_PROXY = 'none'
        
        alert(t('reset_config_success'))
      }
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
      locale.value = savedLanguage
      document.documentElement.lang = savedLanguage
    }
    
    onMounted(() => {
      loadConfig()
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

.theme-selector {
  width: 100%;
  max-width: 400px;
}

.config-switch {
  margin-right: 0.5rem;
}

.config-select {
  width: 100%;
  max-width: 300px;
  margin-bottom: 0.5rem;
}

.config-slider {
  width: 100%;
  max-width: 300px;
  margin-right: 0.5rem;
}

.reset-button {
  color: #dc3545;
  border-color: #dc3545;
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
</style>