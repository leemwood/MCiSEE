<template>
  <div class="download-view">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            {{ appStore.t('download.title', '下载启动器') }}
          </h1>
          <p class="page-subtitle">
            {{ appStore.t('download.subtitle', '选择适合你的 Minecraft 启动器，开始你的游戏之旅') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 启动器列表 -->
    <section class="launchers-section">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ appStore.t('common.loading', '加载中...') }}</p>
        </div>

        <!-- 启动器网格 -->
        <div v-else class="launchers-grid">
          <div 
            v-for="launcher in launchers" 
            :key="launcher.name"
            class="launcher-card"
            :class="{ 'featured': launcher.featured }"
          >
            <!-- 特色标签 -->
            <div v-if="launcher.featured" class="featured-badge">
              {{ appStore.t('download.featured', '推荐') }}
            </div>

            <!-- 启动器图标 -->
            <div class="launcher-icon">
              <img 
                v-if="launcher.icon" 
                :src="launcher.icon" 
                :alt="launcher.name"
                @error="handleImageError"
              >
              <div v-else class="default-icon">
                <i class="icon-rocket"></i>
              </div>
            </div>

            <!-- 启动器信息 -->
            <div class="launcher-info">
              <h3 class="launcher-name">{{ launcher.name }}</h3>
              <p class="launcher-description">{{ launcher.description }}</p>
              
              <!-- 标签 -->
              <div class="launcher-tags">
                <span 
                  v-for="tag in launcher.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- 版本信息 -->
              <div class="launcher-meta">
                <div class="meta-item" v-if="launcher.version">
                  <i class="icon-tag"></i>
                  <span>{{ launcher.version }}</span>
                </div>
                <div class="meta-item" v-if="launcher.size">
                  <i class="icon-download"></i>
                  <span>{{ launcher.size }}</span>
                </div>
                <div class="meta-item" v-if="launcher.platform">
                  <i class="icon-desktop"></i>
                  <span>{{ launcher.platform }}</span>
                </div>
              </div>
            </div>

            <!-- 下载按钮 -->
            <div class="launcher-actions">
              <div class="download-buttons">
                <a 
                  v-for="download in launcher.downloads" 
                  :key="download.type"
                  :href="download.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-primary"
                  @click="trackDownload(launcher.name, download.type)"
                >
                  <i :class="getDownloadIcon(download.type)"></i>
                  {{ getDownloadLabel(download.type) }}
                </a>
              </div>
              
              <!-- 更多信息链接 -->
              <div class="launcher-links">
                <a 
                  v-if="launcher.website"
                  :href="launcher.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-button"
                >
                  <i class="icon-globe"></i>
                  {{ appStore.t('download.website', '官网') }}
                </a>
                <a 
                  v-if="launcher.github"
                  :href="launcher.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-button"
                >
                  <i class="icon-github"></i>
                  {{ appStore.t('download.github', 'GitHub') }}
                </a>
                <a 
                  v-if="launcher.docs"
                  :href="launcher.docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-button"
                >
                  <i class="icon-book"></i>
                  {{ appStore.t('download.docs', '文档') }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="error" class="error-container">
          <div class="error-icon">
            <i class="icon-alert"></i>
          </div>
          <h3>{{ appStore.t('common.error', '加载失败') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadLaunchers" class="btn btn-primary">
            {{ appStore.t('common.retry', '重试') }}
          </button>
        </div>
      </div>
    </section>

    <!-- 使用说明 -->
    <section class="instructions-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ appStore.t('download.instructions_title', '使用说明') }}
          </h2>
          <p class="section-subtitle">
            {{ appStore.t('download.instructions_subtitle', '如何选择和使用启动器') }}
          </p>
        </div>

        <div class="instructions-grid">
          <div class="instruction-card">
            <div class="instruction-icon">
              <i class="icon-search"></i>
            </div>
            <h3>{{ appStore.t('download.step1_title', '选择启动器') }}</h3>
            <p>{{ appStore.t('download.step1_desc', '根据你的需求选择合适的启动器。推荐标签的启动器通常更稳定易用。') }}</p>
          </div>

          <div class="instruction-card">
            <div class="instruction-icon">
              <i class="icon-download"></i>
            </div>
            <h3>{{ appStore.t('download.step2_title', '下载安装') }}</h3>
            <p>{{ appStore.t('download.step2_desc', '点击下载按钮获取启动器，根据你的操作系统选择对应版本。') }}</p>
          </div>

          <div class="instruction-card">
            <div class="instruction-icon">
              <i class="icon-settings"></i>
            </div>
            <h3>{{ appStore.t('download.step3_title', '配置启动') }}</h3>
            <p>{{ appStore.t('download.step3_desc', '安装完成后，配置游戏路径和Java环境，即可开始使用。') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ appStore.t('download.faq_title', '常见问题') }}
          </h2>
        </div>

        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="faq-item"
            :class="{ 'active': activeFaq === index }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <h4>{{ appStore.t(faq.questionKey, faq.question) }}</h4>
              <i class="icon-chevron" :class="{ 'rotated': activeFaq === index }"></i>
            </div>
            <div class="faq-answer" v-show="activeFaq === index">
              <p>{{ appStore.t(faq.answerKey, faq.answer) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import dataService from '../services/dataService'
import type { LauncherItem } from '../services/dataService'

const appStore = useAppStore()

// 响应式数据
const loading = ref(true)
const error = ref('')
const launchers = ref<LauncherItem[]>([])
const activeFaq = ref<number | null>(null)

// 常见问题数据
const faqs = [
  {
    question: '如何选择合适的启动器？',
    questionKey: 'download.faq1_question',
    answer: '建议新手选择推荐的启动器，它们通常更稳定且易于使用。有经验的用户可以根据特定需求选择功能更丰富的启动器。',
    answerKey: 'download.faq1_answer'
  },
  {
    question: '启动器安全吗？',
    questionKey: 'download.faq2_question',
    answer: '我们只收录知名且安全的启动器。所有下载链接都指向官方源，但仍建议使用杀毒软件扫描下载的文件。',
    answerKey: 'download.faq2_answer'
  },
  {
    question: '启动器无法运行怎么办？',
    questionKey: 'download.faq3_question',
    answer: '请确保已安装Java环境，并检查系统兼容性。如果问题持续，可以尝试以管理员身份运行或查看启动器的官方文档。',
    answerKey: 'download.faq3_answer'
  },
  {
    question: '可以同时安装多个启动器吗？',
    questionKey: 'download.faq4_question',
    answer: '可以，不同的启动器通常不会相互冲突。但建议为每个启动器设置不同的游戏目录以避免文件混乱。',
    answerKey: 'download.faq4_answer'
  }
]

// 加载启动器数据
const loadLaunchers = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await dataService.getLauncherData()
    launchers.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载启动器数据失败'
    console.error('Failed to load launchers:', err)
  } finally {
    loading.value = false
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// 获取下载图标
const getDownloadIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'windows': 'icon-windows',
    'mac': 'icon-apple',
    'linux': 'icon-linux',
    'jar': 'icon-java',
    'exe': 'icon-windows',
    'dmg': 'icon-apple',
    'deb': 'icon-linux',
    'rpm': 'icon-linux',
    'appimage': 'icon-linux'
  }
  return iconMap[type.toLowerCase()] || 'icon-download'
}

// 获取下载标签
const getDownloadLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    'windows': 'Windows',
    'mac': 'macOS',
    'linux': 'Linux',
    'jar': 'JAR',
    'exe': 'Windows',
    'dmg': 'macOS',
    'deb': 'Ubuntu/Debian',
    'rpm': 'RedHat/CentOS',
    'appimage': 'AppImage'
  }
  return labelMap[type.toLowerCase()] || type
}

// 跟踪下载
const trackDownload = (launcherName: string, downloadType: string) => {
  // 这里可以添加下载统计逻辑
  console.log(`Download tracked: ${launcherName} - ${downloadType}`)
}

// 切换FAQ
const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// 生命周期
onMounted(() => {
  loadLaunchers()
})
</script>

<style scoped>
.download-view {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 页面头部 */
.page-header {
  padding: 3rem 0;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  color: white;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 启动器区域 */
.launchers-section {
  padding: 4rem 0;
  background: var(--bg-color, #ffffff);
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--border-color, #e5e7eb);
  border-top: 3px solid var(--primary-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: var(--error-color, #ef4444);
  margin-bottom: 1rem;
}

.launchers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.launcher-card {
  background: var(--card-bg, white);
  border-radius: 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: var(--shadow);
}

.launcher-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color, #3b82f6);
}

.launcher-card.featured {
  border-color: var(--primary-color, #3b82f6);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
}

.featured-badge {
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  background: var(--primary-color, #3b82f6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.launcher-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.launcher-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}

.default-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.launcher-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.launcher-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.launcher-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: var(--primary-color, #3b82f6);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.launcher-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.launcher-actions {
  border-top: 1px solid var(--border-color, #e5e7eb);
  padding-top: 1.5rem;
}

.download-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover, #2563eb);
  transform: translateY(-1px);
}

.launcher-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.link-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--primary-color, #3b82f6);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: var(--primary-hover, #2563eb);
}

/* 使用说明区域 */
.instructions-section {
  padding: 4rem 0;
  background: var(--bg-secondary, #f8fafc);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
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

.instructions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.instruction-card {
  text-align: center;
  padding: 2rem;
  background: var(--card-bg, white);
  border-radius: 1rem;
  box-shadow: var(--shadow);
}

.instruction-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-color, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.25rem;
}

.instruction-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.instruction-card p {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

/* FAQ区域 */
.faq-section {
  padding: 4rem 0;
  background: var(--bg-color, #ffffff);
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-question {
  padding: 1.5rem;
  background: var(--card-bg, white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background: var(--bg-secondary, #f8fafc);
}

.faq-question h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin: 0;
}

.icon-chevron {
  transition: transform 0.3s ease;
}

.icon-chevron.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  background: var(--bg-secondary, #f8fafc);
}

.faq-answer p {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0;
}

/* 图标样式 */
.icon-rocket::before { content: '🚀'; }
.icon-tag::before { content: '🏷️'; }
.icon-download::before { content: '📥'; }
.icon-desktop::before { content: '🖥️'; }
.icon-globe::before { content: '🌐'; }
.icon-github::before { content: '⚡'; }
.icon-book::before { content: '📚'; }
.icon-alert::before { content: '⚠️'; }
.icon-search::before { content: '🔍'; }
.icon-settings::before { content: '⚙️'; }
.icon-chevron::before { content: '▼'; }
.icon-windows::before { content: '🪟'; }
.icon-apple::before { content: '🍎'; }
.icon-linux::before { content: '🐧'; }
.icon-java::before { content: '☕'; }

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .launchers-grid {
    grid-template-columns: 1fr;
  }

  .instructions-grid {
    grid-template-columns: 1fr;
  }

  .download-buttons {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }

  .launcher-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .launcher-card {
    padding: 1.5rem;
  }

  .instruction-card {
    padding: 1.5rem;
  }

  .faq-question {
    padding: 1rem;
  }

  .faq-answer {
    padding: 0 1rem 1rem;
  }
}
</style>