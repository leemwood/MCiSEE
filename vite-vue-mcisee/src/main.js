import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入MDUI
import 'mdui/mdui.css'
import 'mdui'

// 导入国际化
import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

const app = createApp(App)
// 配置Vue以识别MDUI自定义元素
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('mdui-')
app.use(i18n)
app.mount('#app')