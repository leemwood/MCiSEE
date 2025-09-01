<template>
  <div class="home-view">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              {{ t('home.title') || 'MCiSEE' }}
              <span class="version-badge">v2.0</span>
            </h1>
            <p class="hero-subtitle">
              {{ t('home.subtitle') || 'Minecraft 整合包启动器与实用工具集合' }}
            </p>
            <p class="hero-description">
              {{ t('home.description') || '为 Minecraft 玩家提供便捷的整合包管理、启动器下载和实用工具集合，让你的游戏体验更加顺畅。' }}
            </p>
            <div class="hero-actions">
              <router-link to="/download" class="btn btn-primary btn-lg">
                <i class="icon-download"></i>
                {{ t('home.download_now') || '立即下载' }}
              </router-link>
              <router-link to="/websites" class="btn btn-secondary btn-lg">
                <i class="icon-globe"></i>
                {{ t('home.explore_tools') || '探索工具' }}
              </router-link>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-card">
              <div class="card-header">
                <div class="card-controls">
                  <span class="control close"></span>
                  <span class="control minimize"></span>
                  <span class="control maximize"></span>
                </div>
                <h3>MCiSEE</h3>
              </div>
              <div class="card-content">
                <div class="launcher-preview">
                  <div class="launcher-item" v-for="i in 3" :key="i">
                    <div class="item-icon"></div>
                    <div class="item-info">
                      <div class="item-name"></div>
                      <div class="item-version"></div>
                    </div>
                    <div class="item-action"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性介绍 -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ t('home.features_title') || '核心特性' }}
          </h2>
          <p class="section-subtitle">
            {{ t('home.features_subtitle') || '为 Minecraft 玩家量身打造的全方位解决方案' }}
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.key">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3 class="feature-title">
              {{ t(feature.titleKey) || feature.title }}
            </h3>
            <p class="feature-description">
              {{ t(feature.descKey) || feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ appStore.githubStats.stars || '0' }}</div>
            <div class="stat-label">{{ t('stats.stars') || 'GitHub Stars' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ appStore.githubStats.forks || '0' }}</div>
            <div class="stat-label">{{ t('stats.forks') || 'Forks' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ launcherCount }}</div>
            <div class="stat-label">{{ t('stats.launchers') || '启动器' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ websiteCount }}</div>
            <div class="stat-label">{{ t('stats.websites') || '实用网站' }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="quickstart-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ t('home.quickstart_title') || '快速开始' }}
          </h2>
          <p class="section-subtitle">
            {{ t('home.quickstart_subtitle') || '三步即可开始使用 MCiSEE' }}
          </p>
        </div>
        <div class="steps-container">
          <div class="step-item" v-for="(step, index) in quickstartSteps" :key="step.key">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">
                {{ t(step.titleKey) || step.title }}
              </h3>
              <p class="step-description">
                {{ t(step.descKey) || step.description }}
              </p>
            </div>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 社区支持 -->
    <section class="community-section">
      <div class="container">
        <div class="community-content">
          <div class="community-text">
            <h2 class="community-title">
              {{ t('home.community_title') || '加入我们的社区' }}
            </h2>
            <p class="community-description">
              {{ t('home.community_description') || '与其他 Minecraft 玩家交流经验，获取技术支持，分享你的创意和想法。' }}
            </p>
            <div class="community-links">
              <a href="https://github.com/MCiSEE/MCiSEE" target="_blank" class="community-link">
                <i class="icon-github"></i>
                <span>GitHub</span>
              </a>
              <a href="https://discord.gg/mcisee" target="_blank" class="community-link">
                <i class="icon-discord"></i>
                <span>Discord</span>
              </a>
            </div>
          </div>
          <div class="community-image">
            <div class="community-avatar-group">
              <div class="avatar" v-for="i in 6" :key="i"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useI18n } from '../composables/useI18n'
import dataService from '../services/dataService'

const appStore = useAppStore()
const { t } = useI18n()

// 响应式数据
const launcherCount = ref(0)
const websiteCount = ref(0)

// 特性数据
const features = [
  {
    key: 'launcher',
    icon: 'icon-rocket',
    title: '启动器管理',
    titleKey: 'features.launcher.title',
    description: '集成多种 Minecraft 启动器，一键下载安装，轻松管理不同版本。',
    descKey: 'features.launcher.description'
  },
  {
    key: 'modpack',
    icon: 'icon-package',
    title: '整合包支持',
    titleKey: 'features.modpack.title',
    description: '支持主流整合包格式，自动处理依赖关系，简化安装流程。',
    descKey: 'features.modpack.description'
  },
  {
    key: 'tools',
    icon: 'icon-tools',
    title: '实用工具',
    titleKey: 'features.tools.title',
    description: '提供丰富的 Minecraft 相关工具和网站资源，提升游戏体验。',
    descKey: 'features.tools.description'
  },
  {
    key: 'opensource',
    icon: 'icon-code',
    title: '开源免费',
    titleKey: 'features.opensource.title',
    description: '完全开源，持续更新，社区驱动，永久免费使用。',
    descKey: 'features.opensource.description'
  },
  {
    key: 'multilang',
    icon: 'icon-globe',
    title: '多语言支持',
    titleKey: 'features.multilang.title',
    description: '支持多种语言界面，为全球用户提供本地化体验。',
    descKey: 'features.multilang.description'
  },
  {
    key: 'responsive',
    icon: 'icon-mobile',
    title: '响应式设计',
    titleKey: 'features.responsive.title',
    description: '完美适配桌面和移动设备，随时随地访问所需资源。',
    descKey: 'features.responsive.description'
  }
]

// 快速开始步骤
const quickstartSteps = [
  {
    key: 'download',
    icon: 'icon-download',
    title: '下载启动器',
    titleKey: 'quickstart.download.title',
    description: '从下载页面选择适合你的启动器版本并下载安装。',
    descKey: 'quickstart.download.description'
  },
  {
    key: 'configure',
    icon: 'icon-settings',
    title: '配置设置',
    titleKey: 'quickstart.configure.title',
    description: '根据你的需求配置游戏设置和启动参数。',
    descKey: 'quickstart.configure.description'
  },
  {
    key: 'play',
    icon: 'icon-play',
    title: '开始游戏',
    titleKey: 'quickstart.play.title',
    description: '选择你喜欢的整合包或版本，点击启动开始游戏。',
    descKey: 'quickstart.play.description'
  }
]

// 加载统计数据
const loadStats = async () => {
  try {
    const [launchers, websites] = await Promise.all([
      dataService.getLauncherData(),
      dataService.getUtilityWebsites()
    ])
    
    launcherCount.value = launchers.length
    websiteCount.value = websites.reduce((total, category) => total + category.websites.length, 0)
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

// 生命周期
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.home-view {
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}


.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.version-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  font-weight: 500;
}

.hero-description {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-primary {
  background: white;
  color: var(--primary-color, #3b82f6);
}

.btn-primary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 英雄卡片 */
.hero-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.close { background: #ff5f57; }
.control.minimize { background: #ffbd2e; }
.control.maximize { background: #28ca42; }

.card-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
}

.card-content {
  padding: 1.5rem;
}

.launcher-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.launcher-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.item-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(45deg, #60a5fa, #3b82f6);
  border-radius: 0.5rem;
}

.item-info {
  flex: 1;
}

.item-name {
  height: 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.item-version {
  height: 0.75rem;
  width: 60%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
}

.item-action {
  width: 4rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
}

/* 特性区域 */
.features-section {
  padding: 5rem 0;

}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color, #111827);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary, #6b7280);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.342);
  border-radius: 1rem;
  border: 1px solid var(--border-color, #e5e7eb17);
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color, #4376c734);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--primary-color, #0dd1b041), var(--primary-hover, #2563eb));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: rgb(255, 255, 255);
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

/* 统计区域 */
.stats-section {
  padding: 3rem 0;

  color: rgb(0, 1, 15);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 快速开始区域 */
.quickstart-section {
  padding: 5rem 0;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;

  border-radius: 1rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateX(10px);
  box-shadow: var(--shadow-lg);
}

.step-number {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #000000);
  margin-bottom: 0.5rem;
}

.step-description {
  color: var(--text-secondary, #000000);
  line-height: 1.6;
}

.step-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

/* 社区区域 */
.community-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, var(--primary-hover, #2563eb));
  color: white;
}

.community-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.community-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.community-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.community-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.community-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.community-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.community-avatar-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 300px;
}

.avatar {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* 图标样式 */
.icon-download::before { content: '📥'; }
.icon-globe::before { content: '🌐'; }
.icon-rocket::before { content: '🚀'; }
.icon-package::before { content: '📦'; }
.icon-tools::before { content: '🔧'; }
.icon-code::before { content: '💻'; }
.icon-mobile::before { content: '📱'; }
.icon-settings::before { content: '⚙️'; }
.icon-play::before { content: '▶️'; }
.icon-github::before { content: '⚡'; }
.icon-discord::before { content: '💬'; }
.icon-telegram::before { content: '✈️'; }

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .step-item {
    flex-direction: column;
    text-align: center;
  }

  .community-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .community-avatar-group {
    margin: 0 auto;
  }

  .section-title {
    font-size: 2rem;
  }

  .community-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 0;
  }

  .features-section,
  .quickstart-section,
  .community-section {
    padding: 3rem 0;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .community-links {
    flex-direction: column;
  }

  .community-link {
    justify-content: center;
  }
}
</style>
