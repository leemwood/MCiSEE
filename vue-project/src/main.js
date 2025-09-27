import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 注册 Material Design 3 组件
import { registerMaterialComponents } from './utils/material-components'

const app = createApp(App)

// 注册 Material Design 组件
registerMaterialComponents(app)

app.mount('#app')