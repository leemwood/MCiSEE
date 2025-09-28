import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 导入路由配置
import router from './router'

// 注册 Material Design 3 组件
import { registerMaterialComponents } from './utils/material-components'

const app = createApp(App)

// 使用路由
app.use(router)

// 注册 Material Design 组件
registerMaterialComponents(app)

app.mount('#app')