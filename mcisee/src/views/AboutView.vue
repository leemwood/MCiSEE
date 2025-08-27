<template>
  <div class="about-view">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="project-logo">
            <img src="/favicon.ico" alt="MCiSEE" class="logo-image">
          </div>
          <h1 class="page-title">MCiSEE</h1>
          <p class="page-subtitle">
            {{ appStore.t('about.subtitle', 'Minecraft 启动器和实用网站集合') }}
          </p>
          <div class="version-info">
            <span class="version-badge">v2.0.0</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目介绍 -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-content">
            <h2 class="section-title">
              {{ appStore.t('about.intro_title', '关于项目') }}
            </h2>
            <div class="intro-text">
              <p>{{ appStore.t('about.intro_p1', 'MCiSEE 是一个专为 Minecraft 玩家打造的综合性资源平台，致力于为玩家提供最全面、最实用的启动器和网站资源。') }}</p>
              <p>{{ appStore.t('about.intro_p2', '我们精心收集和整理了各种优秀的 Minecraft 启动器，以及与 Minecraft 相关的实用网站，帮助玩家更好地享受游戏体验。') }}</p>
              <p>{{ appStore.t('about.intro_p3', '项目完全开源，欢迎社区贡献和反馈，让我们一起打造更好的 Minecraft 生态。') }}</p>
            </div>
            
            <div class="project-stats">
              <div class="stat-item">
                <div class="stat-number">{{ githubStats.stars || '---' }}</div>
                <div class="stat-label">{{ appStore.t('about.stars', 'Stars') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ githubStats.forks || '---' }}</div>
                <div class="stat-label">{{ appStore.t('about.forks', 'Forks') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ githubStats.watchers || '---' }}</div>
                <div class="stat-label">{{ appStore.t('about.watchers', 'Watchers') }}</div>
              </div>
            </div>
          </div>
          
          <div class="intro-illustration">
            <div class="feature-cards">
              <div class="feature-card">
                <i class="icon-rocket"></i>
                <h4>{{ appStore.t('about.feature1_title', '启动器集合') }}</h4>
                <p>{{ appStore.t('about.feature1_desc', '收录各种优秀的 Minecraft 启动器') }}</p>
              </div>
              <div class="feature-card">
                <i class="icon-globe"></i>
                <h4>{{ appStore.t('about.feature2_title', '实用网站') }}</h4>
                <p>{{ appStore.t('about.feature2_desc', '精选 Minecraft 相关的实用网站') }}</p>
              </div>
              <div class="feature-card">
                <i class="icon-heart"></i>
                <h4>{{ appStore.t('about.feature3_title', '开源免费') }}</h4>
                <p>{{ appStore.t('about.feature3_desc', '完全开源，永久免费使用') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 网站设置 -->
    <section class="settings-section">
      <div class="container">
        <div class="settings-card">
          <div class="settings-header">
            <h2 class="section-title">
              <i class="icon-settings"></i>
              {{ appStore.t('about.settings_title', '网站设置') }}
            </h2>
            <p class="section-subtitle">
              {{ appStore.t('about.settings_subtitle', '个性化你的浏览体验') }}
            </p>
          </div>

          <div class="settings-grid">
            <!-- 主题设置 -->
            <div class="setting-group">
              <div class="setting-header">
                <h3 class="setting-title">
                  <i class="icon-palette"></i>
                  {{ appStore.t('about.theme_title', '主题模式') }}
                </h3>
                <p class="setting-description">
                  {{ appStore.t('about.theme_description', '选择你喜欢的主题模式') }}
                </p>
              </div>
              <div class="theme-options">
                <label 
                  v-for="theme in themeOptions" 
                  :key="theme.value"
                  class="theme-option"
                  :class="{ 'active': appStore.themeMode === theme.value }"
                >
                  <input 
                    type="radio" 
                    :value="theme.value" 
                    v-model="appStore.themeMode"
                    @change="handleThemeChange"
                  >
                  <div class="theme-preview">
                    <i :class="theme.icon"></i>
                  </div>
                  <div class="theme-info">
                    <div class="theme-name">{{ appStore.t(theme.labelKey, theme.label) }}</div>
                    <div class="theme-desc">{{ appStore.t(theme.descKey, theme.description) }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 语言设置 -->
            <div class="setting-group">
              <div class="setting-header">
                <h3 class="setting-title">
                  <i class="icon-globe"></i>
                  {{ appStore.t('about.language_title', '语言设置') }}
                </h3>
                <p class="setting-description">
                  {{ appStore.t('about.language_description', '选择界面显示语言') }}
                </p>
              </div>
              <div class="language-selector">
                <select 
                  v-model="appStore.language" 
                  @change="handleLanguageChange"
                  class="language-select"
                >
                  <option 
                    v-for="lang in languageOptions" 
                    :key="lang.code"
                    :value="lang.code"
                  >
                    {{ lang.flag }} {{ lang.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 其他设置 -->
            <div class="setting-group">
              <div class="setting-header">
                <h3 class="setting-title">
                  <i class="icon-sliders"></i>
                  {{ appStore.t('about.other_settings_title', '其他设置') }}
                </h3>
              </div>
              <div class="other-settings">
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="enableAnimations"
                      @change="handleAnimationChange"
                    >
                    <span class="checkmark"></span>
                    {{ appStore.t('about.enable_animations', '启用动画效果') }}
                  </label>
                </div>
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="enableSounds"
                      @change="handleSoundChange"
                    >
                    <span class="checkmark"></span>
                    {{ appStore.t('about.enable_sounds', '启用音效') }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 重置设置 -->
          <div class="settings-actions">
            <button @click="resetSettings" class="btn btn-outline">
              <i class="icon-refresh"></i>
              {{ appStore.t('about.reset_settings', '重置设置') }}
            </button>
            <button @click="exportSettings" class="btn btn-outline">
              <i class="icon-download"></i>
              {{ appStore.t('about.export_settings', '导出设置') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队信息 -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ appStore.t('about.team_title', '开发团队') }}
          </h2>
          <p class="section-subtitle">
            {{ appStore.t('about.team_subtitle', '感谢所有为项目做出贡献的开发者') }}
          </p>
        </div>

        <div class="team-grid">
          <div 
            v-for="member in teamMembers" 
            :key="member.name"
            class="team-member"
          >
            <div class="member-avatar">
              <img 
                v-if="member.avatar" 
                :src="member.avatar" 
                :alt="member.name"
                @error="handleAvatarError"
              >
              <div v-else class="default-avatar">
                <i class="icon-user"></i>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="member-links">
                <a 
                  v-if="member.github"
                  :href="member.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="member-link"
                >
                  <i class="icon-github"></i>
                </a>
                <a 
                  v-if="member.twitter"
                  :href="member.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="member-link"
                >
                  <i class="icon-twitter"></i>
                </a>
                <a 
                  v-if="member.website"
                  :href="member.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="member-link"
                >
                  <i class="icon-globe"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目链接 -->
    <section class="links-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ appStore.t('about.links_title', '相关链接') }}
          </h2>
        </div>

        <div class="links-grid">
          <a 
            v-for="link in projectLinks" 
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card"
          >
            <div class="link-icon">
              <i :class="link.icon"></i>
            </div>
            <div class="link-info">
              <h3 class="link-name">{{ appStore.t(link.nameKey, link.name) }}</h3>
              <p class="link-description">{{ appStore.t(link.descKey, link.description) }}</p>
            </div>
            <div class="link-arrow">
              <i class="icon-arrow-right"></i>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 许可证信息 -->
    <section class="license-section">
      <div class="container">
        <div class="license-card">
          <div class="license-content">
            <h3>{{ appStore.t('about.license_title', '开源许可') }}</h3>
            <p>{{ appStore.t('about.license_description', '本项目基于 MIT 许可证开源，你可以自由使用、修改和分发。') }}</p>
            <div class="license-actions">
              <a 
                href="https://github.com/MCiSEE/MCiSEE/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline"
              >
                <i class="icon-file"></i>
                {{ appStore.t('about.view_license', '查看许可证') }}
              </a>
            </div>
          </div>
          <div class="license-icon">
            <i class="icon-shield"></i>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

// 响应式数据
const enableAnimations = ref(true)
const enableSounds = ref(false)

// 主题选项
const themeOptions = [
  {
    value: 'auto',
    label: '自动',
    labelKey: 'about.theme_auto',
    description: '跟随系统设置',
    descKey: 'about.theme_auto_desc',
    icon: 'icon-auto'
  },
  {
    value: 'light',
    label: '亮色',
    labelKey: 'about.theme_light',
    description: '明亮清新的界面',
    descKey: 'about.theme_light_desc',
    icon: 'icon-sun'
  },
  {
    value: 'dark',
    label: '暗色',
    labelKey: 'about.theme_dark',
    description: '护眼的深色界面',
    descKey: 'about.theme_dark_desc',
    icon: 'icon-moon'
  }
]

// 语言选项
const languageOptions = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
]

// 团队成员
const teamMembers = [
  {
    name: 'MCiSEE Team',
    role: '项目维护者',
    bio: '致力于为 Minecraft 社区提供优质资源',
    avatar: '',
    github: 'https://github.com/MCiSEE',
    twitter: '',
    website: ''
  }
]

// 项目链接
const projectLinks = [
  {
    name: 'GitHub 仓库',
    nameKey: 'about.link_github',
    description: '查看源代码，提交问题和建议',
    descKey: 'about.link_github_desc',
    url: 'https://github.com/MCiSEE/MCiSEE',
    icon: 'icon-github'
  },
  {
    name: '发布版本',
    nameKey: 'about.link_releases',
    description: '下载最新版本和查看更新日志',
    descKey: 'about.link_releases_desc',
    url: 'https://github.com/MCiSEE/MCiSEE/releases',
    icon: 'icon-tag'
  },
  {
    name: '问题反馈',
    nameKey: 'about.link_issues',
    description: '报告 Bug 或提出功能建议',
    descKey: 'about.link_issues_desc',
    url: 'https://github.com/MCiSEE/MCiSEE/issues',
    icon: 'icon-bug'
  },
  {
    name: '贡献指南',
    nameKey: 'about.link_contributing',
    description: '了解如何为项目做出贡献',
    descKey: 'about.link_contributing_desc',
    url: 'https://github.com/MCiSEE/MCiSEE/blob/main/CONTRIBUTING.md',
    icon: 'icon-heart'
  }
]

// 计算属性
const githubStats = computed(() => appStore.githubStats)

// 方法
const handleThemeChange = () => {
  appStore.applyTheme()
}

const handleLanguageChange = () => {
  appStore.loadLocaleData()
}

const handleAnimationChange = () => {
  document.documentElement.style.setProperty(
    '--animation-duration', 
    enableAnimations.value ? '0.3s' : '0s'
  )
}

const handleSoundChange = () => {
  // 这里可以添加音效控制逻辑
  console.log('Sound settings changed:', enableSounds.value)
}

const resetSettings = () => {
  if (confirm(appStore.t('about.confirm_reset', '确定要重置所有设置吗？'))) {
    appStore.themeMode = 'auto'
    appStore.language = 'zh-CN'
    enableAnimations.value = true
    enableSounds.value = false
    
    appStore.applyTheme()
    appStore.loadLocaleData()
    handleAnimationChange()
    handleSoundChange()
  }
}

const exportSettings = () => {
  const settings = {
    theme: appStore.themeMode,
    language: appStore.language,
    enableAnimations: enableAnimations.value,
    enableSounds: enableSounds.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(settings, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mcisee-settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// 生命周期
onMounted(() => {
  // 加载设置
  const savedAnimations = localStorage.getItem('mcisee-animations')
  const savedSounds = localStorage.getItem('mcisee-sounds')
  
  if (savedAnimations !== null) {
    enableAnimations.value = JSON.parse(savedAnimations)
  }
  if (savedSounds !== null) {
    enableSounds.value = JSON.parse(savedSounds)
  }
  
  handleAnimationChange()
})
</script>

<style scoped>
.about-view {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 页面头部 */
.page-header {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  color: white;
  text-align: center;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.project-logo {
  margin-bottom: 1rem;
}

.logo-image {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.version-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* 介绍区域 */
.intro-section {
  padding: 4rem 0;
  background: var(--bg-color, #ffffff);
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color, #111827);
  margin-bottom: 1.5rem;
}

.intro-text p {
  color: var(--text-secondary, #6b7280);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.project-stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #3b82f6);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
  font-weight: 500;
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-card {
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
  box-shadow: var(--shadow);
}

.feature-card i {
  font-size: 2rem;
  color: var(--primary-color, #3b82f6);
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

/* 设置区域 */
.settings-section {
  padding: 4rem 0;
  background: var(--bg-secondary, #f8fafc);
}

.settings-card {
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.settings-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-subtitle {
  color: var(--text-secondary, #6b7280);
  font-size: 1.125rem;
  margin-top: 0.5rem;
}

.settings-grid {
  display: grid;
  gap: 3rem;
}

.setting-group {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 1rem;
  padding: 2rem;
}

.setting-header {
  margin-bottom: 1.5rem;
}

.setting-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

/* 主题选项 */
.theme-options {
  display: grid;
  gap: 1rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-option:hover {
  border-color: var(--primary-color, #3b82f6);
}

.theme-option.active {
  border-color: var(--primary-color, #3b82f6);
  background: rgba(59, 130, 246, 0.05);
}

.theme-option input {
  display: none;
}

.theme-preview {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.theme-name {
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.25rem;
}

.theme-desc {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
}

/* 语言选择器 */
.language-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  background: var(--card-bg, white);
  color: var(--text-color, #111827);
  font-size: 1rem;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 其他设置 */
.other-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-color, #111827);
}

.setting-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 0.25rem;
  position: relative;
  transition: all 0.3s ease;
}

.setting-label input[type="checkbox"]:checked + .checkmark {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
}

.setting-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

/* 设置操作 */
.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color, #e5e7eb);
  color: var(--text-color, #111827);
}

.btn-outline:hover {
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}

/* 团队区域 */
.team-section {
  padding: 4rem 0;
  background: var(--bg-color, #ffffff);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.team-member {
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--border-color, #e5e7eb);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.member-role {
  color: var(--primary-color, #3b82f6);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.member-bio {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.member-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.member-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  transition: all 0.3s ease;
}

.member-link:hover {
  background: var(--primary-color, #3b82f6);
  color: white;
}

/* 链接区域 */
.links-section {
  padding: 4rem 0;
  background: var(--bg-secondary, #f8fafc);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 1.5rem;
  text-decoration: none;
  border: 1px solid var(--border-color, #e5e7eb);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color, #3b82f6);
}

.link-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-color, #3b82f6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.link-info {
  flex: 1;
}

.link-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.25rem;
}

.link-description {
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
  line-height: 1.5;
}

.link-arrow {
  color: var(--text-secondary, #6b7280);
  transition: transform 0.3s ease;
}

.link-card:hover .link-arrow {
  transform: translateX(0.25rem);
}

/* 许可证区域 */
.license-section {
  padding: 4rem 0;
  background: var(--bg-color, #ffffff);
}

.license-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border-color, #e5e7eb);
  box-shadow: var(--shadow);
}

.license-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.license-content p {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.license-icon {
  font-size: 3rem;
  color: var(--primary-color, #3b82f6);
}

/* 图标样式 */
.icon-settings::before { content: '⚙️'; }
.icon-palette::before { content: '🎨'; }
.icon-globe::before { content: '🌐'; }
.icon-sliders::before { content: '🎛️'; }
.icon-refresh::before { content: '🔄'; }
.icon-download::before { content: '📥'; }
.icon-rocket::before { content: '🚀'; }
.icon-heart::before { content: '❤️'; }
.icon-auto::before { content: '🔄'; }
.icon-sun::before { content: '☀️'; }
.icon-moon::before { content: '🌙'; }
.icon-user::before { content: '👤'; }
.icon-github::before { content: '⚡'; }
.icon-twitter::before { content: '🐦'; }
.icon-tag::before { content: '🏷️'; }
.icon-bug::before { content: '🐛'; }
.icon-file::before { content: '📄'; }
.icon-shield::before { content: '🛡️'; }
.icon-arrow-right::before { content: '→'; }

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .intro-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .project-stats {
    justify-content: center;
  }

  .theme-options {
    grid-template-columns: 1fr;
  }

  .settings-actions {
    flex-direction: column;
    align-items: center;
  }

  .license-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .settings-card {
    padding: 1.5rem;
  }

  .setting-group {
    padding: 1.5rem;
  }

  .team-member {
    padding: 1.5rem;
  }

  .link-card {
    padding: 1rem;
  }
}
</style>
