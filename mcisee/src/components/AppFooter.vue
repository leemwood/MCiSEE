<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- GitHub统计信息 -->
      <div class="github-stats">
        <div class="stats-grid">
          <div class="stat-item">
            <i class="icon-star"></i>
            <span class="stat-value">{{ appStore.githubStats.stars }}</span>
            <span class="stat-label">{{ t('footer.stars') }}</span>
          </div>
          <div class="stat-item">
            <i class="icon-fork"></i>
            <span class="stat-value">{{ appStore.githubStats.forks }}</span>
            <span class="stat-label">{{ t('footer.forks') }}</span>
          </div>
          <div class="stat-item">
            <i class="icon-eye"></i>
            <span class="stat-value">{{ appStore.githubStats.watchers }}</span>
            <span class="stat-label">{{ t('footer.watchers') }}</span>
          </div>
          <div class="stat-item">
            <i class="icon-issue"></i>
            <span class="stat-value">{{ appStore.githubStats.issues }}</span>
            <span class="stat-label">{{ t('footer.issues') }}</span>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 项目信息 -->
      <div class="project-info">
        <div class="info-section">
          <h3 class="section-title">{{ t('footer.project') }}</h3>
          <p class="section-description">
            {{ t('footer.description') }}
          </p>
        </div>

        <div class="info-section">
          <h3 class="section-title">{{ t('footer.links') }}</h3>
          <div class="links-grid">
            <a 
              href="https://github.com/MCiSEE/MCiSEE" 
              target="_blank" 
              class="footer-link"
            >
              <i class="icon-github"></i>
              {{ t('footer.github') }}
            </a>
            <a 
              href="https://github.com/teaSummer/MCiSEE/releases" 
              target="_blank" 
              class="footer-link"
            >
              <i class="icon-download"></i>
              {{ t('footer.releases') }}
            </a>
            <a 
              href="https://github.com/teaSummer/MCiSEE/issues" 
              target="_blank" 
              class="footer-link"
            >
              <i class="icon-bug"></i>
              {{ t('footer.report') }}
            </a>
            <a 
              href="https://github.com/teaSummer/MCiSEE/wiki" 
              target="_blank" 
              class="footer-link"
            >
              <i class="icon-book"></i>
              {{ t('footer.wiki') }}
            </a>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">{{ t('footer.community') }}</h3>
          <div class="links-grid">
            <a
              href="https://discord.gg/mcisee" 
              target="_blank" 
              class="footer-link"
            >
              <i class="icon-discord"></i>
              {{ t('footer.discord') }}
            </a>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="copyright">
        <div class="copyright-text">
          <p>
            © {{ currentYear }} MCiSEE. {{ t('footer.copyright') }}
          </p>
          <p class="version-info">
            {{ t('footer.version') }} 2.0.0 | 
            {{ t('footer.built_with') }} 
            <a href="https://vuejs.org" target="_blank" class="tech-link">Vue 3</a> & 
            <a href="https://vitejs.dev" target="_blank" class="tech-link">Vite</a>
          </p>
        </div>
        
        <!-- 返回顶部按钮 -->
        <button 
          v-show="showBackToTop"
          @click="scrollToTop"
          class="back-to-top"
          :title="t('footer.back_to_top')"
        >
          <i class="icon-arrow-up"></i>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const { t } = useI18n()

// 响应式状态
const showBackToTop = ref(false)

// 计算属性
const currentYear = computed(() => new Date().getFullYear())

// 方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 加载GitHub统计数据
  appStore.loadGitHubStats()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-footer {
  margin-top: auto;
  padding: 3rem 0 1rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* GitHub统计 */
.github-stats {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(155, 140, 140, 0.1);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(155, 147, 147, 0.15);
}

.stat-item i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color, #3b82f6);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 分隔线 */
.divider {
  height: 1px;
  background: var(--border-color, #e5e7eb);
  margin: 2rem 0;
}

/* 项目信息 */
.project-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-section {
  text-align: center;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1rem;
}

.section-description {
  color: #000000;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #000000;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.footer-link:hover {
  color: var(--primary-color, #3b82f6);
  background: var(--hover-bg, rgba(59, 130, 246, 0.1));
}

/* 版权信息 */
.copyright {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  position: relative;
}

.copyright-text {
  text-align: center;
  flex: 1;
}

.copyright-text p {
  margin: 0.25rem 0;
  color: #000000;
  font-size: 0.875rem;
}

.version-info {
  font-size: 0.75rem !important;
}

.tech-link {
  color: var(--primary-color, #3b82f6);
  text-decoration: none;
  font-weight: 500;
}

.tech-link:hover {
  text-decoration: underline;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: var(--primary-color, #3b82f6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
}

.back-to-top:hover {
  background: var(--primary-hover, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

/* 图标样式 */
.icon-star::before { content: '⭐'; }
.icon-fork::before { content: '🍴'; }
.icon-eye::before { content: '👁️'; }
.icon-issue::before { content: '🐛'; }
.icon-github::before { content: '⚡'; }
.icon-download::before { content: '📥'; }
.icon-bug::before { content: '🐛'; }
.icon-book::before { content: '📚'; }
.icon-discord::before { content: '💬'; }
.icon-telegram::before { content: '✈️'; }
.icon-twitter::before { content: '🐦'; }
.icon-arrow-up::before { content: '↑'; }

/* 暗色模式 */
:global(.dark-theme) .app-footer {
  --footer-bg: #111827;
  --card-bg: #1f2937;
  --border-color: #374151;
  --text-color: #f9fafb;
  --text-secondary: #d1d5db;
  --hover-bg: rgba(255, 255, 255, 0.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app-footer {
    padding: 2rem 0 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-item {
    padding: 1rem 0.75rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .project-info {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .copyright {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 1rem;
  }

  .links-grid {
    gap: 0.25rem;
  }

  .footer-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>