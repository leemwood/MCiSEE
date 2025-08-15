import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

// JSONC 插件
function jsoncPlugin() {
  return {
    name: 'jsonc',
    transform(code, id) {
      if (id.endsWith('.jsonc')) {
        try {
          // 移除单行注释
          let cleanJson = code.replace(/\/\/.*$/gm, '')
          // 移除多行注释
          cleanJson = cleanJson.replace(/\/\*[\s\S]*?\*\//g, '')
          // 解析JSON
          const parsed = JSON.parse(cleanJson)
          return `export default ${JSON.stringify(parsed)}`
        } catch (e) {
          console.error(`JSONC parsing error in ${id}:`, e.message)
          // 返回空数组作为fallback
          return `export default []`
        }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/MCiSEE/' : '/',
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('mdui-')
      }
    }
  }), vueDevtools(), jsoncPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})