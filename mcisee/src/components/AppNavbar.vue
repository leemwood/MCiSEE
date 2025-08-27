<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 项目标题 -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <h1 class="brand-title">MCiSEE</h1>
        </router-link>
      </div>

      <!-- 移动端菜单按钮 -->
      <button 
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
        :class="{ active: isMobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- 导航菜单 -->
      <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
        <div class="navbar-nav">
          <router-link 
            v-for="route in navRoutes" 
            :key="route.path"
            :to="route.path" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            {{ t(route.titleKey) }}
          </router-link>
        </div>

        <!-- 工具栏 -->
        <div class="navbar-tools">
          <!-- 语言切换 -->
          <div class="dropdown language-dropdown">
            <button class="dropdown-toggle" @click="toggleLanguageDropdown">
              <i class="icon-globe"></i>
              <span class="language-text">{{ currentLanguageLabel }}</span>
              <i class="icon-chevron-down"></i>
            </button>
            <div class="dropdown-menu" :class="{ show: isLanguageDropdownOpen }">
              <button 
                v-for="lang in languages" 
                :key="lang.code"
                class="dropdown-item"
                @click="changeLanguage(lang.code)"
                :class="{ active: getCurrentLocale()?.code === lang.code }"
              >
                {{ lang.name }}
              </button>
            </div>
          </div>

          <!-- 暗色模式切换 -->
          <div class="dropdown theme-dropdown">
            <button class="dropdown-toggle" @click="toggleThemeDropdown">
              <i :class="themeIcon"></i>
              <span class="theme-text">{{ currentThemeLabel }}</span>
              <i class="icon-chevron-down"></i>
            </button>
            <div class="dropdown-menu" :class="{ show: isThemeDropdownOpen }">
              <button 
                v-for="theme in themes" 
                :key="theme.mode"
                class="dropdown-item"
                @click="changeTheme(theme.mode)"
                :class="{ active: appStore.themeMode === theme.mode }"
              >
                <i :class="theme.icon"></i>
                {{ t(theme.labelKey) || theme.label }}
              </button>
            </div>
          </div>

          <!-- GitHub链接 -->
          <a 
            href="https://github.com/teaSummer/MCiSEE" 
            target="_blank" 
            class="github-link"
            :title="t('navbar.github') || 'GitHub'"
          >
            <i class="icon-github"></i>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, type ThemeMode } from '../stores/app'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const appStore = useAppStore()
const { t, changeLocale, getCurrentLocale, supportedLocales } = useI18n()

// 响应式状态
const isMobileMenuOpen = ref(false)
const isLanguageDropdownOpen = ref(false)
const isThemeDropdownOpen = ref(false)

// 导航路由
const navRoutes = [
  { path: '/', titleKey: 'navbar.home' },
  { path: '/download', titleKey: 'navbar.download' },
  { path: '/websites', titleKey: 'navbar.websites' },
  { path: '/about', titleKey: 'navbar.about' }
]

// 语言选项使用国际化服务提供的数据
const languages = supportedLocales

// 主题选项
const themes = [
  { mode: 'auto' as ThemeMode, label: '跟随系统', labelKey: 'theme.auto', icon: 'icon-monitor' },
  { mode: 'light' as ThemeMode, label: '亮色模式', labelKey: 'theme.light', icon: 'icon-sun' },
  { mode: 'dark' as ThemeMode, label: '暗色模式', labelKey: 'theme.dark', icon: 'icon-moon' }
]

// 计算属性
const currentLanguageLabel = computed(() => {
  const currentLocale = getCurrentLocale()
  return currentLocale?.name || '简体中文'
})

const currentThemeLabel = computed(() => {
  const theme = themes.find(t => t.mode === appStore.themeMode)
  return t(theme?.labelKey || 'theme.auto') || theme?.label || '跟随系统'
})

const themeIcon = computed(() => {
  const theme = themes.find(t => t.mode === appStore.themeMode)
  return theme?.icon || 'icon-monitor'
})

// 方法
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
  isThemeDropdownOpen.value = false
}

const toggleThemeDropdown = () => {
  isThemeDropdownOpen.value = !isThemeDropdownOpen.value
  isLanguageDropdownOpen.value = false
}

const changeLanguage = async (langCode: string) => {
  await changeLocale(langCode)
  isLanguageDropdownOpen.value = false
}

const changeTheme = (mode: ThemeMode) => {
  appStore.setThemeMode(mode)
  isThemeDropdownOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.dropdown')) {
    isLanguageDropdownOpen.value = false
    isThemeDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: var(--navbar-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand .brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--primary-color, #3b82f6);
  transition: color 0.3s ease;
}

.brand-title:hover {
  color: var(--primary-hover, #2563eb);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
}

.mobile-menu-btn span {
  width: 100%;
  height: 2px;
  background: var(--text-color, #374151);
  margin: 2px 0;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color, #374151);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color, #3b82f6);
  background: var(--hover-bg, rgba(59, 130, 246, 0.1));
}

.nav-link.router-link-active {
  color: var(--primary-color, #3b82f6);
  background: var(--active-bg, rgba(59, 130, 246, 0.1));
}

.navbar-tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-color, #374151);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--dropdown-bg, white);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--text-color, #374151);
  cursor: pointer;
  transition: background 0.3s ease;
}

.dropdown-item:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dropdown-item.active {
  color: var(--primary-color, #3b82f6);
  background: var(--active-bg, rgba(59, 130, 246, 0.1));
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--text-color, #374151);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.github-link:hover {
  color: var(--primary-color, #3b82f6);
  background: var(--hover-bg, rgba(59, 130, 246, 0.1));
}

/* 图标样式 */
.icon-globe::before { content: '🌐'; }
.icon-chevron-down::before { content: '▼'; font-size: 0.75rem; }
.icon-monitor::before { content: '🖥️'; }
.icon-sun::before { content: '☀️'; }
.icon-moon::before { content: '🌙'; }
.icon-github::before { content: '⚡'; }

/* 暗色模式 */
:global(.dark-theme) .navbar {
  --navbar-bg: rgba(17, 24, 39, 0.95);
  --border-color: #374151;
  --text-color: #f9fafb;
  --hover-bg: rgba(255, 255, 255, 0.1);
  --active-bg: rgba(59, 130, 246, 0.2);
  --dropdown-bg: #1f2937;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--navbar-bg, rgba(255, 255, 255, 0.95));
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--border-color, #e5e7eb);
    flex-direction: column;
    gap: 0;
    padding: 1rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  }

  .navbar-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .navbar-nav {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .nav-link {
    width: 100%;
    padding: 1rem;
    text-align: center;
  }

  .navbar-tools {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color, #e5e7eb);
  }

  .language-text,
  .theme-text {
    display: none;
  }

  .dropdown-menu {
    position: fixed;
    top: auto;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }

  .dropdown-menu.show {
    transform: translateX(-50%) translateY(0);
  }
}
</style>