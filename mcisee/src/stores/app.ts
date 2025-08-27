import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dataService, { type LocaleData } from '../services/dataService'

export type ThemeMode = 'auto' | 'light' | 'dark'
export type Language = 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'en-UD' | 'it-IT' | 'lzh' | 'pt-BR'

export const useAppStore = defineStore('app', () => {
  // 状态
  const themeMode = ref<ThemeMode>('auto')
  const language = ref<Language>('zh-CN')
  const localeData = ref<LocaleData>({})
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
  
  // 获取本地化文本
  const t = (key: string, fallback?: string): string => {
    return localeData.value[key] || fallback || key
  }
  
  // 动作
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
    applyTheme()
  }
  
  const setLanguage = async (lang: Language) => {
    language.value = lang
    localStorage.setItem('language', lang)
    await loadLocaleData()
  }
  
  const loadLocaleData = async () => {
    try {
      isLoading.value = true
      const data = await dataService.getLocaleData(language.value)
      localeData.value = data
    } catch (error) {
      console.error('Failed to load locale data:', error)
    } finally {
      isLoading.value = false
    }
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
    
    document.body.style.backgroundImage = `url('${backgroundImages[theme]}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'
  }
  
  const initializeApp = async () => {
    // 从localStorage恢复设置
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
    const savedLanguage = localStorage.getItem('language') as Language
    
    if (savedTheme) {
      themeMode.value = savedTheme
    }
    
    if (savedLanguage) {
      language.value = savedLanguage
    }
    
    // 加载数据
    await Promise.all([
      loadLocaleData(),
      loadGitHubStats()
    ])
    
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
    localeData,
    isLoading,
    githubStats,
    
    // 计算属性
    currentTheme,
    isDark,
    
    // 方法
    t,
    setThemeMode,
    setLanguage,
    loadLocaleData,
    loadGitHubStats,
    applyTheme,
    initializeApp
  }
})