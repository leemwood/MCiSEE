import { useI18n as useVueI18n } from 'vue-i18n'
import { switchLocale, SUPPORTED_LOCALES, getTranslation } from '../services/i18nService'
import { getCurrentInstance } from 'vue'

/**
 * 国际化组合式函数
 */
export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n()
  const instance = getCurrentInstance()
  const i18n = instance?.appContext.app.config.globalProperties.$i18n

  /**
   * 切换语言
   * @param newLocale 新语言代码
   */
  const changeLocale = async (newLocale: string) => {
    if (i18n) {
      await switchLocale(i18n, newLocale)
    }
  }

  /**
   * 获取当前语言信息
   */
  const getCurrentLocale = () => {
    return SUPPORTED_LOCALES.find(l => l.code === locale.value)
  }

  /**
   * 获取翻译文本（带备用文本）
   * @param key 翻译键
   * @param fallback 备用文本
   */
  const translate = (key: string, fallback?: string) => {
    if (i18n) {
      return getTranslation(i18n, key, fallback)
    }
    return t(key) || fallback || key
  }

  /**
   * 检查是否支持某个语言
   * @param localeCode 语言代码
   */
  const isLocaleSupported = (localeCode: string) => {
    return SUPPORTED_LOCALES.some(l => l.code === localeCode)
  }

  return {
    // Vue i18n 原生方法
    t,
    locale,
    availableLocales,
    
    // 自定义方法
    changeLocale,
    getCurrentLocale,
    translate,
    isLocaleSupported,
    
    // 常量
    supportedLocales: SUPPORTED_LOCALES
  }
}

export default useI18n