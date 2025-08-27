import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dataService from '../services/dataService'
import i18nService from '../services/i18nService'

export type ThemeMode = 'auto' | 'light' | 'dark'

export const useAppStore = defineStore('app', () => {
  // 状态
  const themeMode = ref<ThemeMode>('auto')
  const language = ref('zh-CN')
  const isLoading = ref(false)
  const githubStats = ref({
    stars: 0,
    forks: 0,
    watchers: 0,
    issues: 0
  })
  
  // 计算属性
  const currentTheme = computed(() => {
    if (themeMode.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeMode.value
  })
  
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // 动作
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
    applyTheme()
  }
  
  const loadGitHubStats = async () => {
    try {
      const stats = await dataService.getGitHubStats()
      githubStats.value = stats
    } catch (error) {
      console.error('Failed to load GitHub stats:', error)
    }
  }
  
  const applyTheme = () => {
    const theme = currentTheme.value
    document.documentElement.setAttribute('data-theme', theme)
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
    
    // 设置背景图
    const backgroundImages = {
      light: '/assets/image/daylight.webp',
      dark: '/assets/image/dark.webp'
    }
    
    const backgroundUrl = backgroundImages[theme]
    
    document.body.style.backgroundImage = `url('${backgroundUrl}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundRepeat = 'no-repeat'
  }
  
  const setLanguage = (lang: string) => {
    language.value = lang
    i18nService.setStoredLocale(lang)
  }

  const loadLocaleData = async () => {
    const storedLocale = i18nService.getStoredLocale()
    language.value = storedLocale
  }

  const initializeApp = async () => {
    // 从localStorage恢复设置
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
    
    if (savedTheme) {
      themeMode.value = savedTheme
    }
    
    // 加载语言设置
    await loadLocaleData()
    
    // 加载数据
    await loadGitHubStats()
    
    // 应用主题
    applyTheme()
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (themeMode.value === 'auto') {
          applyTheme()
        }
      })
    }
  }
  
  return {
    // 状态
    themeMode,
    language,
    isLoading,
    githubStats,
    
    // 计算属性
    currentTheme,
    isDark,
    
    // 方法
    setThemeMode,
    setLanguage,
    loadLocaleData,
    loadGitHubStats,
    applyTheme,
    initializeApp
  }
})