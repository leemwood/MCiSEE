// 多语言管理器
export class I18nManager {
  constructor() {
    this.currentLang = 'zh-CN';
    this.translations = {};
    this.availableLangs = ['zh-CN', 'en-US'];
  }

  // 加载语言文件
  async loadLanguage(lang) {
    try {
      const response = await fetch(`/src/locales/${lang}.json`);
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      return true;
    } catch (error) {
      console.error(`Failed to load language ${lang}:`, error);
      return false;
    }
  }

  // 获取翻译
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 返回原键名作为默认值
      }
    }
    
    return value || key;
  }

  // 切换语言
  async switchLanguage(lang) {
    if (this.availableLangs.includes(lang)) {
      const success = await this.loadLanguage(lang);
      if (success) {
        this.currentLang = lang;
        return true;
      }
    }
    return false;
  }

  // 获取当前语言
  getCurrentLang() {
    return this.currentLang;
  }

  // 获取可用语言列表
  getAvailableLangs() {
    return this.availableLangs;
  }
}

// 创建全局实例
export const i18n = new I18nManager();