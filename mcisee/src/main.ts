import './assets/main.css'
import './assets/clarity-ui.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18nInstance } from './services/i18nService'

// 异步初始化应用
async function initApp() {
  const app = createApp(App)
  
  // 创建i18n实例
  const i18n = await createI18nInstance()
  
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  
  app.mount('#app')
}

// 启动应用
initApp().catch(error => {
  console.error('Failed to initialize app:', error)
})
