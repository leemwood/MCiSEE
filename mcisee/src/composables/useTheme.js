import { ref, watch } from 'vue'

// 主题状态
const theme = ref('auto')
const isDark = ref(false)

// 主题选项
export const themeOptions = [
  { value: 'auto', label: '自动' },
  { value: 'light', label: '亮色' },
  { value: 'dark', label: '暗色' }
]

// 检测系统主题
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题
function applyTheme(themeValue) {
  const actualTheme = themeValue === 'auto' ? getSystemTheme() : themeValue
  isDark.value = actualTheme === 'dark'
  
  // 设置HTML属性
  document.documentElement.setAttribute('data-theme', actualTheme)
  
  // 设置背景类
  const body = document.body
  body.classList.remove('theme-bg', 'light', 'dark', 'classic')
  
  if (actualTheme === 'dark') {
    body.classList.add('theme-bg', 'dark')
  } else {
    body.classList.add('theme-bg', 'light')
  }
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('mcisee-theme') || 'auto'
  theme.value = savedTheme
  applyTheme(savedTheme)
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'auto') {
      applyTheme('auto')
    }
  })
}

// 设置主题
function setTheme(newTheme) {
  theme.value = newTheme
  localStorage.setItem('mcisee-theme', newTheme)
  applyTheme(newTheme)
}

// 切换主题（用于快速切换按钮）
function toggleTheme() {
  const currentActualTheme = theme.value === 'auto' ? getSystemTheme() : theme.value
  const newTheme = currentActualTheme === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
}

// 监听主题变化
watch(theme, (newTheme) => {
  applyTheme(newTheme)
})

export function useTheme() {
  return {
    theme,
    isDark,
    themeOptions,
    initTheme,
    setTheme,
    toggleTheme
  }
}