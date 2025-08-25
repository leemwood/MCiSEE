import { createI18n } from 'vue-i18n'

// 动态导入语言文件
const messages = {}
const localeModules = import.meta.glob('./locales/*.json', { eager: true })

for (const path in localeModules) {
  const matched = path.match(/\/([A-Za-z0-9-_]+)\.json$/)
  if (matched && matched.length > 1) {
    const locale = matched[1]
    messages[locale] = localeModules[path].default
  }
}

// 获取浏览器语言
function getBrowserLocale() {
  const navigatorLocale = navigator.languages !== undefined
    ? navigator.languages[0]
    : navigator.language
  
  if (!navigatorLocale) {
    return 'zh-CN'
  }
  
  const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0]
  
  // 语言映射
  const localeMap = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'it': 'it-IT',
    'pt': 'pt-BR'
  }
  
  return localeMap[trimmedLocale] || 'zh-CN'
}

// 从localStorage获取保存的语言设置
function getSavedLocale() {
  return localStorage.getItem('mcisee-locale') || getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'zh-CN',
  messages
})

export default i18n

// 导出语言切换函数
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('mcisee-locale', locale)
  document.documentElement.lang = locale
}

// 导出可用语言列表
export const availableLocales = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-HK', name: '繁體中文（香港）' },
  { code: 'en-US', name: 'English' },
  { code: 'en-UD', name: 'English (Upside Down)' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'lzh', name: '文言文' }
]