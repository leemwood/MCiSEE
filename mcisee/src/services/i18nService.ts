import { createI18n } from 'vue-i18n'

// 支持的语言列表
export const SUPPORTED_LOCALES = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-HK', name: '繁體中文（香港）' },
  { code: 'en-US', name: 'English' },
  { code: 'en-UD', name: 'English (Upside Down)' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'lzh', name: '文言文' }
]

// 默认语言
const DEFAULT_LOCALE = 'zh-CN'

// 语言缓存
const localeCache = new Map<string, any>()

/**
 * 加载语言文件
 * @param locale 语言代码
 * @returns 语言数据
 */
export async function loadLocale(locale: string): Promise<any> {
  // 检查缓存
  if (localeCache.has(locale)) {
    return localeCache.get(locale)
  }

  try {
    // 从public/locales目录加载语言文件
    const response = await fetch(`/locales/${locale}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load locale ${locale}: ${response.status}`)
    }
    
    const localeData = await response.json()
    
    // 缓存语言数据
    localeCache.set(locale, localeData)
    
    return localeData
  } catch (error) {
    console.error(`Error loading locale ${locale}:`, error)
    
    // 如果加载失败且不是默认语言，尝试加载默认语言
    if (locale !== DEFAULT_LOCALE) {
      console.warn(`Falling back to default locale: ${DEFAULT_LOCALE}`)
      return loadLocale(DEFAULT_LOCALE)
    }
    
    // 返回空对象作为最后的备用
    return { language: locale, data: {} }
  }
}

/**
 * 获取浏览器首选语言
 * @returns 语言代码
 */
export function getBrowserLocale(): string {
  const browserLang = navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE
  
  // 检查是否支持该语言
  const supportedLocale = SUPPORTED_LOCALES.find(locale => 
    locale.code === browserLang || locale.code.startsWith(browserLang.split('-')[0])
  )
  
  return supportedLocale?.code || DEFAULT_LOCALE
}

/**
 * 获取存储的语言设置
 * @returns 语言代码
 */
export function getStoredLocale(): string {
  try {
    const stored = localStorage.getItem('mcisee-locale')
    if (stored && SUPPORTED_LOCALES.some(locale => locale.code === stored)) {
      return stored
    }
  } catch (error) {
    console.warn('Failed to get stored locale:', error)
  }
  
  return getBrowserLocale()
}

/**
 * 保存语言设置
 * @param locale 语言代码
 */
export function setStoredLocale(locale: string): void {
  try {
    localStorage.setItem('mcisee-locale', locale)
  } catch (error) {
    console.warn('Failed to store locale:', error)
  }
}

/**
 * 创建i18n实例
 * @param initialLocale 初始语言
 * @returns i18n实例
 */
export async function createI18nInstance(initialLocale?: string) {
  const locale = initialLocale || getStoredLocale()
  const localeData = await loadLocale(locale)
  
  const i18n = createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      [locale]: localeData.data || {}
    },
    globalInjection: true
  })
  
  return i18n
}

/**
 * 切换语言
 * @param i18n i18n实例
 * @param locale 目标语言代码
 */
export async function switchLocale(i18n: any, locale: string): Promise<void> {
  if (!SUPPORTED_LOCALES.some(l => l.code === locale)) {
    console.warn(`Unsupported locale: ${locale}`)
    return
  }
  
  try {
    // 检查语言是否支持
    if (!SUPPORTED_LOCALES.some(supportedLocale => supportedLocale.code === locale)) {
      console.warn(`Locale ${locale} is not supported`)
      return
    }

    // 兼容不同的i18n实例结构
    const globalInstance = i18n.global || i18n
    
    // 如果语言数据未加载，先加载
    const availableLocales = globalInstance.availableLocales || []
    if (!availableLocales.includes(locale)) {
      const localeData = await loadLocale(locale)
      // 使用正确的API方法
      if (globalInstance.setLocaleMessage) {
        globalInstance.setLocaleMessage(locale, localeData.data || {})
      } else if (i18n.global && i18n.global.setLocaleMessage) {
        i18n.global.setLocaleMessage(locale, localeData.data || {})
      }
    }
    
    // 切换语言
    if (globalInstance.locale && typeof globalInstance.locale === 'object' && 'value' in globalInstance.locale) {
      globalInstance.locale.value = locale
    } else if (globalInstance.locale) {
      globalInstance.locale = locale
    }
    
    // 保存设置
    setStoredLocale(locale)
    
    // 更新HTML lang属性
    document.documentElement.lang = locale
  } catch (error) {
    console.error('Error switching locale:', error)
  }
}

/**
 * 获取翻译文本的辅助函数
 * @param i18n i18n实例
 * @param key 翻译键
 * @param fallback 备用文本
 * @returns 翻译文本
 */
export function getTranslation(i18n: any, key: string, fallback?: string): string {
  try {
    const translation = i18n.global.t(key)
    return translation !== key ? translation : (fallback || key)
  } catch (error) {
    console.warn(`Translation error for key "${key}":`, error)
    return fallback || key
  }
}

/**
 * 预加载所有语言文件
 */
export async function preloadAllLocales(): Promise<void> {
  const loadPromises = SUPPORTED_LOCALES.map(locale => 
    loadLocale(locale.code).catch(error => {
      console.warn(`Failed to preload locale ${locale.code}:`, error)
      return null
    })
  )
  
  await Promise.all(loadPromises)
  console.log('All locales preloaded')
}

export default {
  SUPPORTED_LOCALES,
  loadLocale,
  getBrowserLocale,
  getStoredLocale,
  setStoredLocale,
  createI18nInstance,
  switchLocale,
  getTranslation,
  preloadAllLocales
}